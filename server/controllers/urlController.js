import useragent from 'express-useragent';
import Url from '../models/Url.js';
import Click from '../models/Click.js';
import validateUrl from '../utils/validateUrl.js';
import generateUniqueShortCode from '../utils/generateShortCode.js';
import { getCache, setCache, delCache } from '../services/redisService.js';
import { emitClickEvent } from '../socket.js';
import { scheduleUrlExpiration } from '../queues/urlQueue.js';

const RESERVED_ALIASES = [
  'api',
  'login',
  'register',
  'dashboard',
  'analytics',
  'admin',
  'health',
  'static',
  'assets',
  'expired',
  '404',
  'favicon.ico',
];

/**
 * Helper to calculate expiration date
 */
const calculateExpiration = (expirationOption) => {
  if (!expirationOption || expirationOption === 'never') return null;

  const now = new Date();
  if (expirationOption === '1d') {
    return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
  } else if (expirationOption === '7d') {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  } else if (expirationOption === '30d') {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  } else {
    // Custom date string
    const parsedDate = new Date(expirationOption);
    if (!isNaN(parsedDate.getTime()) && parsedDate > now) {
      return parsedDate;
    }
  }
  return null;
};

/**
 * @desc    Create a shortened URL
 * @route   POST /api/urls
 * @access  Public / Optional Auth
 */
export const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiration } = req.body;

    // Validate URL
    const validation = validateUrl(originalUrl);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const formattedOriginalUrl = validation.formattedUrl;
    let finalCode = '';

    // Handle Custom Alias
    if (customAlias && customAlias.trim()) {
      const alias = customAlias.trim();

      // Check length (3 to 20 chars)
      if (alias.length < 3 || alias.length > 20) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias must be between 3 and 20 characters long',
        });
      }

      // Check allowed characters (alphanumeric, hyphens, underscores)
      if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias can only contain letters, numbers, hyphens, and underscores',
        });
      }

      // Check reserved words
      if (RESERVED_ALIASES.includes(alias.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `The custom alias '${alias}' is a reserved system keyword`,
        });
      }

      // Check collision with shortCode or customAlias
      const existingUrl = await Url.findOne({
        $or: [{ shortCode: alias }, { customAlias: alias }],
      });

      if (existingUrl) {
        return res.status(400).json({
          success: false,
          message: `The custom alias '${alias}' is already taken. Please choose another one.`,
        });
      }

      finalCode = alias;
    } else {
      // Generate standard 6-character short code
      finalCode = await generateUniqueShortCode(6);
    }

    const expiresAt = calculateExpiration(expiration);
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    const url = await Url.create({
      originalUrl: formattedOriginalUrl,
      shortCode: finalCode,
      customAlias: customAlias ? finalCode : null,
      user: req.user ? req.user._id : null,
      expiresAt,
      isActive: true,
    });

    // Schedule background expiration job if expiration is set
    if (expiresAt) {
      const delayMs = new Date(expiresAt).getTime() - Date.now();
      if (delayMs > 0) {
        scheduleUrlExpiration(url._id, url.shortCode, delayMs).catch(() => {});
      }
    }

    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        clicks: url.clicks,
        expiresAt: url.expiresAt,
        isActive: url.isActive,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all URLs created by logged-in user
 * @route   GET /api/urls
 * @access  Private
 */
export const getUserUrls = async (req, res, next) => {
  try {
    const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    const formattedUrls = urls.map((url) => ({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      customAlias: url.customAlias,
      clicks: url.clicks,
      expiresAt: url.expiresAt,
      isActive: url.isActive,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    }));

    res.json({
      success: true,
      count: formattedUrls.length,
      data: formattedUrls,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single URL details by ID
 * @route   GET /api/urls/:id
 * @access  Private
 */
export const getUrlById = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    if (url.user && (!req.user || url.user.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this URL',
      });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      success: true,
      data: {
        ...url.toObject(),
        shortUrl: `${baseUrl}/${url.shortCode}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update URL (Original URL, expiration, active status)
 * @route   PUT /api/urls/:id
 * @access  Private
 */
export const updateUrl = async (req, res, next) => {
  try {
    const { originalUrl, expiration, isActive } = req.body;

    let url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    // Verify ownership
    if (!url.user || url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this URL',
      });
    }

    if (originalUrl) {
      const validation = validateUrl(originalUrl);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: validation.error,
        });
      }
      url.originalUrl = validation.formattedUrl;
    }

    if (expiration !== undefined) {
      url.expiresAt = calculateExpiration(expiration);
      if (url.expiresAt) {
        const delayMs = new Date(url.expiresAt).getTime() - Date.now();
        if (delayMs > 0) {
          scheduleUrlExpiration(url._id, url.shortCode, delayMs).catch(() => {});
        }
      }
    }

    if (typeof isActive === 'boolean') {
      url.isActive = isActive;
    }

    await url.save();

    // Invalidate Redis cache
    await delCache(`url:${url.shortCode}`);

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      success: true,
      message: 'URL updated successfully',
      data: {
        ...url.toObject(),
        shortUrl: `${baseUrl}/${url.shortCode}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete URL
 * @route   DELETE /api/urls/:id
 * @access  Private
 */
export const deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    // Verify ownership
    if (!url.user || url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this URL',
      });
    }

    // Invalidate Redis Cache
    await delCache(`url:${url.shortCode}`);

    // Delete all related clicks
    await Click.deleteMany({ url: url._id });

    // Delete URL
    await Url.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Redirect short code to original URL with Redis Caching & Socket.IO events
 * @route   GET /:shortCode
 * @access  Public
 */
export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // Ignore requests for static assets or favicon
    if (shortCode === 'favicon.ico') {
      return res.status(404).end();
    }

    let urlTarget = null;
    let cacheHit = false;

    // 1. Try Redis Cache
    const cachedData = await getCache(`url:${shortCode}`);
    if (cachedData) {
      urlTarget = cachedData;
      cacheHit = true;
    } else {
      // 2. Fallback to MongoDB Query
      const dbUrl = await Url.findOne({ shortCode });
      if (dbUrl) {
        urlTarget = dbUrl.toObject();
        // Cache in Redis for 1 hour
        await setCache(`url:${shortCode}`, urlTarget, 3600);
      }
    }

    // Check existence
    if (!urlTarget) {
      return res.redirect(`${clientUrl}/404`);
    }

    // Check if active
    if (!urlTarget.isActive) {
      return res.redirect(`${clientUrl}/expired?reason=disabled`);
    }

    // Check expiration
    if (urlTarget.expiresAt && new Date(urlTarget.expiresAt) < new Date()) {
      return res.redirect(`${clientUrl}/expired?reason=expired`);
    }

    // Increment click counter in DB
    const updatedUrl = await Url.findByIdAndUpdate(
      urlTarget._id,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    const updatedClicks = updatedUrl ? updatedUrl.clicks : (urlTarget.clicks || 0) + 1;

    // Record Click Analytics asynchronously
    const uaString = req.headers['user-agent'] || '';
    const ua = useragent.parse(uaString);

    let deviceType = 'Desktop';
    if (ua.isMobile) deviceType = 'Mobile';
    if (ua.isTablet) deviceType = 'Tablet';

    const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ipAddress = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();

    Click.create({
      url: urlTarget._id,
      userAgent: uaString.substring(0, 300),
      ipAddress,
      referrer: referrer.substring(0, 200),
      device: deviceType,
      browser: ua.browser || 'Unknown',
      operatingSystem: ua.os || 'Unknown',
    }).catch((err) => console.error('Error logging click analytics:', err));

    // Emit Socket.IO real-time click event to connected dashboards
    emitClickEvent({
      shortCode,
      urlId: urlTarget._id,
      clicks: updatedClicks,
      cacheHit,
      timestamp: new Date().toISOString(),
      device: deviceType,
      browser: ua.browser || 'Unknown',
      operatingSystem: ua.os || 'Unknown',
      referrer,
    });

    // Redirect to destination
    return res.redirect(urlTarget.originalUrl);
  } catch (error) {
    next(error);
  }
};
