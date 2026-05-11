const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Task = require('../models/Task');
const Note = require('../models/Note');
const FocusSession = require('../models/FocusSession');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected for Seeding...');

    await User.deleteMany();
    await Task.deleteMany();
    await Note.deleteMany();
    await FocusSession.deleteMany();
    console.log('Previous Data Cleared.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Synora123', salt);

    const demoUser = await User.create({ name: 'Demo Student', email: 'demo@synora.ai', password: hashedPassword });
    console.log('Demo User Created:', demoUser.email);

    const now = new Date();
    const tasks = [
      { userId: demoUser._id, subject: 'Computer Science', topic: 'Implement Graph Algorithms', deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), difficulty: 'hard', importance: 5, estimatedTime: 120, completed: false },
      { userId: demoUser._id, subject: 'Calculus', topic: 'Review Chapter 4 - Integrals', deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), difficulty: 'medium', importance: 4, estimatedTime: 90, completed: false },
      { userId: demoUser._id, subject: 'History', topic: 'Write Essay Outline', deadline: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), difficulty: 'medium', importance: 3, estimatedTime: 45, completed: false },
      { userId: demoUser._id, subject: 'Physics', topic: 'Solve Lab Report', deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), difficulty: 'easy', importance: 2, estimatedTime: 30, completed: true },
      { userId: demoUser._id, subject: 'Computer Science', topic: 'Binary Search Trees', deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), difficulty: 'medium', importance: 4, estimatedTime: 60, completed: true },
    ];
    for (const task of tasks) await Task.create(task);
    console.log('Demo Tasks Created.');

    await Note.create({ userId: demoUser._id, title: 'Physics Formulas', content: 'F = ma\nE = mc²\nv = u + at\ns = ut + ½at²' });
    await Note.create({ userId: demoUser._id, title: 'CS Project Ideas', content: '- AI Study Planner\n- Habit Tracker\n- Budget App' });
    console.log('Demo Notes Created.');

    await FocusSession.create({ userId: demoUser._id, duration: 25 });
    await FocusSession.create({ userId: demoUser._id, duration: 25 });
    await FocusSession.create({ userId: demoUser._id, duration: 25 });
    console.log('Demo Focus Sessions Created.');

    console.log('\n✅ Seeding Complete!');
    console.log('Login with: demo@synora.ai / Synora123');
    process.exit(0);
  } catch (error) {
    console.error('Error with Seeding:', error.message);
    process.exit(1);
  }
};

seedData();
