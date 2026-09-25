import Url from '../models/Url.js';
import Click from '../models/Click.js';

/**
 * @desc    Get comprehensive analytics for a specific shortCode or URL ID
 * @route   GET /api/analytics/:shortCode
 * @access  Private
 */
export const getUrlAnalytics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Find URL by shortCode or ID
    const url = await Url.findOne({
      $or: [{ shortCode }, { _id: shortCode.match(/^[0-9a-fA-F]{24}$/) ? shortCode : null }],
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    // Check ownership
    if (!url.user || url.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this URL',
      });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Queries
    const totalClicks = url.clicks;

    const clicksToday = await Click.countDocuments({
      url: url._id,
      timestamp: { $gte: startOfToday },
    });

    const clicksThisWeek = await Click.countDocuments({
      url: url._id,
      timestamp: { $gte: sevenDaysAgo },
    });

    const clicksThisMonth = await Click.countDocuments({
      url: url._id,
      timestamp: { $gte: thirtyDaysAgo },
    });

    // Clicks over time (last 7 days breakdown)
    const clicksOverTime = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await Click.countDocuments({
        url: url._id,
        timestamp: { $gte: dayStart, $lte: dayEnd },
      });

      clicksOverTime.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks: count,
      });
    }

    // Device distribution
    const deviceAggregate = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Browser distribution
    const browserAggregate = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // OS distribution
    const osAggregate = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: '$operatingSystem', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Format distributions with percentage
    const formatStats = (aggregate, total) => {
      const validTotal = total > 0 ? total : 1;
      return aggregate.map((item) => ({
        name: item._id || 'Unknown',
        value: item.count,
        percentage: Math.round((item.count / validTotal) * 100),
      }));
    };

    const deviceStats = formatStats(deviceAggregate, totalClicks);
    const browserStats = formatStats(browserAggregate, totalClicks);
    const osStats = formatStats(osAggregate, totalClicks);

    // Recent clicks log (last 15)
    const recentClicks = await Click.find({ url: url._id })
      .sort({ timestamp: -1 })
      .limit(15)
      .select('timestamp referrer device browser operatingSystem ipAddress');

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      success: true,
      data: {
        url: {
          _id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${baseUrl}/${url.shortCode}`,
          createdAt: url.createdAt,
          expiresAt: url.expiresAt,
          isActive: url.isActive,
        },
        summary: {
          totalClicks,
          clicksToday,
          clicksThisWeek,
          clicksThisMonth,
        },
        clicksOverTime,
        deviceStats,
        browserStats,
        osStats,
        recentClicks,
      },
    });
  } catch (error) {
    next(error);
  }
};
