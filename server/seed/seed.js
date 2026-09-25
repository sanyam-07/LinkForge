import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Url from '../models/Url.js';
import Click from '../models/Click.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/linkforge';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Url.deleteMany({});
    await Click.deleteMany({});

    console.log('Cleared existing database records.');

    // Create Demo User
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@linkforge.com',
      password: 'password123',
    });

    console.log('Created Demo User: demo@linkforge.com / password123');

    // Create Demo URLs
    const urlsData = [
      {
        originalUrl: 'https://github.com/facebook/react',
        shortCode: 'reactjs',
        customAlias: 'reactjs',
        user: demoUser._id,
        clicks: 42,
        isActive: true,
      },
      {
        originalUrl: 'https://tailwindcss.com/docs/installation',
        shortCode: 'twdocs',
        customAlias: 'twdocs',
        user: demoUser._id,
        clicks: 28,
        isActive: true,
      },
      {
        originalUrl: 'https://mongodb.com/docs/manual/tutorial/getting-started/',
        shortCode: 'mgdb01',
        user: demoUser._id,
        clicks: 15,
        isActive: true,
      },
      {
        originalUrl: 'https://expressjs.com/en/starter/hello-world.html',
        shortCode: 'exp391',
        user: demoUser._id,
        clicks: 9,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        originalUrl: 'https://example.com/expired-test-link',
        shortCode: 'exptst',
        user: demoUser._id,
        clicks: 3,
        isActive: true,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expired yesterday
      },
    ];

    const createdUrls = await Url.insertMany(urlsData);
    console.log(`Created ${createdUrls.length} demo URLs.`);

    // Generate click logs for the first demo URL
    const primaryUrl = createdUrls[0];
    const devices = ['Desktop', 'Desktop', 'Desktop', 'Mobile', 'Mobile', 'Tablet'];
    const browsers = ['Chrome', 'Chrome', 'Safari', 'Firefox', 'Edge'];
    const osList = ['Windows', 'MacOS', 'iOS', 'Android', 'Linux'];
    const referrers = ['https://google.com', 'https://twitter.com', 'https://linkedin.com', 'Direct'];

    const clickRecords = [];
    const now = new Date();

    for (let i = 0; i < 42; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 3600000);

      clickRecords.push({
        url: primaryUrl._id,
        timestamp,
        userAgent: 'Mozilla/5.0 Demo UserAgent',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 100 + 1)}`,
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        operatingSystem: osList[Math.floor(Math.random() * osList.length)],
      });
    }

    await Click.insertMany(clickRecords);
    console.log(`Created ${clickRecords.length} click analytics records for ${primaryUrl.shortCode}.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
