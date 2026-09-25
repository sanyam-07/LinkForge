import OpenAI from 'openai';

let openaiClient = null;

if (process.env.OPENAI_API_KEY) {
  try {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (err) {
    console.error('OpenAI client initialization failed:', err.message);
  }
}

/**
 * Helper to check OpenAI readiness
 */
const checkOpenAiAvailable = () => {
  return !!process.env.OPENAI_API_KEY && !!openaiClient;
};

/**
 * @desc    Analyze a long destination URL using AI to suggest alias, category, and metadata
 * @route   POST /api/ai/analyze-url
 * @access  Private
 */
export const analyzeUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a URL to analyze',
      });
    }

    if (!checkOpenAiAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI features are currently unavailable. (OPENAI_API_KEY not configured)',
      });
    }

    const systemPrompt = `You are LinkForge AI Assistant. Analyze destination web URLs and generate structured branding recommendations. Respond ONLY with valid JSON matching this schema:
{
  "suggestedAlias": "url-safe-kebab-case-alias",
  "category": "Technology | Marketing | Education | Business | Entertainment | Personal | Other",
  "tags": ["tag1", "tag2", "tag3"],
  "description": "Short description of the destination content",
  "campaignName": "Suggested campaign name"
}`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this destination URL: ${url}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const parsedContent = JSON.parse(completion.choices[0].message.content);

    // Sanitize suggested alias (3-20 chars, alphanumeric/hyphens)
    if (parsedContent.suggestedAlias) {
      parsedContent.suggestedAlias = parsedContent.suggestedAlias
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '')
        .substring(0, 20);
    }

    res.json({
      success: true,
      message: 'AI URL Analysis complete',
      data: parsedContent,
    });
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'AI Assistant service encountered an error while processing the request',
    });
  }
};

/**
 * @desc    Generate AI natural language insights from MongoDB calculated click statistics
 * @route   POST /api/ai/analytics-insights
 * @access  Private
 */
export const generateAnalyticsInsights = async (req, res, next) => {
  try {
    const { totalClicks, clicksToday, clicksThisWeek, clicksThisMonth, deviceStats, browserStats, osStats } = req.body;

    if (!checkOpenAiAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI Analytics Insights unavailable. (OPENAI_API_KEY not configured)',
      });
    }

    const inputMetrics = {
      totalClicks: totalClicks || 0,
      clicksToday: clicksToday || 0,
      clicksThisWeek: clicksThisWeek || 0,
      clicksThisMonth: clicksThisMonth || 0,
      topDevices: deviceStats || [],
      topBrowsers: browserStats || [],
      topOS: osStats || [],
    };

    const systemPrompt = `You are LinkForge AI Analytics Engine. Interpret empirical click metrics and provide a concise, high-value business summary. Do NOT invent numbers. Base insights strictly on provided metrics. Respond ONLY with valid JSON:
{
  "summary": "Brief 1-2 sentence executive summary of link engagement",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "recommendation": "Strategic recommendation to improve click-through or targeting"
}`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Interpret these click analytics metrics: ${JSON.stringify(inputMetrics)}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    const parsedContent = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      data: parsedContent,
    });
  } catch (error) {
    console.error('AI Analytics Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI analytics insights',
    });
  }
};

/**
 * @desc    Generate AI marketing campaign UTM parameters & suggestions
 * @route   POST /api/ai/suggest-campaign
 * @access  Private
 */
export const suggestCampaign = async (req, res, next) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a campaign goal or concept',
      });
    }

    if (!checkOpenAiAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'AI features are currently unavailable',
      });
    }

    const systemPrompt = `You are LinkForge AI Marketing Campaign Planner. Generate campaign metadata based on user goal. Respond ONLY with valid JSON:
{
  "campaignName": "Campaign Title",
  "suggestedAlias": "custom-alias",
  "tags": ["tag1", "tag2"],
  "utm": {
    "utm_source": "source",
    "utm_medium": "medium",
    "utm_campaign": "campaign_name"
  }
}`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Campaign Goal: ${goal}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    });

    const parsedContent = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      data: parsedContent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI campaign parameters',
    });
  }
};

export default {
  analyzeUrl,
  generateAnalyticsInsights,
  suggestCampaign,
};
