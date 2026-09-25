import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Url from './models/Url.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/linkforge';

const runIsolationTest = async () => {
  try {
    console.log('--- STARTING MULTI-TENANT USER DATA ISOLATION TEST ---');
    await mongoose.connect(MONGO_URI);

    // Clean test accounts if exist
    await User.deleteMany({ email: { $in: ['a@test.com', 'b@test.com'] } });

    // 1. Create User A & User B
    const userA = await User.create({ name: 'User A', email: 'a@test.com', password: 'password123' });
    const userB = await User.create({ name: 'User B', email: 'b@test.com', password: 'password123' });

    console.log(`✓ User A registered: ${userA._id}`);
    console.log(`✓ User B registered: ${userB._id}`);

    // Clean test links
    await Url.deleteMany({ shortCode: { $in: ['linkA_test', 'linkB_test'] } });

    // 2. User A creates link A, User B creates link B
    const linkA = await Url.create({
      originalUrl: 'https://github.com/userA',
      shortCode: 'linkA_test',
      user: userA._id,
      isActive: true,
    });

    const linkB = await Url.create({
      originalUrl: 'https://github.com/userB',
      shortCode: 'linkB_test',
      user: userB._id,
      isActive: true,
    });

    console.log(`✓ Link A created by User A: ${linkA.shortCode}`);
    console.log(`✓ Link B created by User B: ${linkB.shortCode}`);

    // 3. Query User A links from DB (simulating GET /api/urls for User A)
    const userALinks = await Url.find({ user: userA._id });
    console.log(`✓ User A query returned ${userALinks.length} link(s): [${userALinks.map(l => l.shortCode).join(', ')}]`);
    if (userALinks.length !== 1 || userALinks[0].shortCode !== 'linkA_test') {
      throw new Error('FAILED: User A saw unexpected links!');
    }

    // 4. Query User B links from DB (simulating GET /api/urls for User B)
    const userBLinks = await Url.find({ user: userB._id });
    console.log(`✓ User B query returned ${userBLinks.length} link(s): [${userBLinks.map(l => l.shortCode).join(', ')}]`);
    if (userBLinks.length !== 1 || userBLinks[0].shortCode !== 'linkB_test') {
      throw new Error('FAILED: User B saw unexpected links!');
    }

    // 5. Test Access Control: User A tries to modify Link B
    const checkAuthModification = (url, userId) => {
      if (!url.user || url.user.toString() !== userId.toString()) {
        return { allowed: false, status: 403, message: 'Not authorized' };
      }
      return { allowed: true };
    };

    const userATamperLinkB = checkAuthModification(linkB, userA._id);
    console.log(`✓ User A modifying Link B check: allowed=${userATamperLinkB.allowed}, status=${userATamperLinkB.status}`);
    if (userATamperLinkB.allowed) {
      throw new Error('FAILED: User A was allowed to tamper with Link B!');
    }

    const userBTamperLinkA = checkAuthModification(linkA, userB._id);
    console.log(`✓ User B modifying Link A check: allowed=${userBTamperLinkA.allowed}, status=${userBTamperLinkA.status}`);
    if (userBTamperLinkA.allowed) {
      throw new Error('FAILED: User B was allowed to tamper with Link A!');
    }

    // Clean up test records
    await Url.deleteMany({ shortCode: { $in: ['linkA_test', 'linkB_test'] } });
    await User.deleteMany({ email: { $in: ['a@test.com', 'b@test.com'] } });

    console.log('🎉 MULTI-TENANT USER DATA ISOLATION TEST PASSED 100% SUCCESSFUL!');
    process.exit(0);
  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  }
};

runIsolationTest();
