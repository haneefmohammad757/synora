const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ priorityScore: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { subject, topic, deadline, difficulty, importance, estimatedTime } = req.body;
    const task = await Task.create({ userId: req.user.id, subject, topic, deadline, difficulty, importance, estimatedTime });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.userId.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });
    Object.assign(task, req.body);
    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.userId.toString() !== req.user.id) return res.status(401).json({ success: false, message: 'Not authorized' });
    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, completed: false }).sort({ priorityScore: -1 }).limit(3);
    const now = new Date();
    const overdueCount = await Task.countDocuments({ userId: req.user.id, completed: false, deadline: { $lt: now } });
    const message = overdueCount > 0
      ? `You have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}. The AI has re-prioritized them — let's recover!`
      : tasks.length > 0 ? "You're on track! Here are your top priority tasks." : "No pending tasks. You're all caught up! 🎉";
    res.status(200).json({ success: true, data: { recommendations: tasks, message } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
