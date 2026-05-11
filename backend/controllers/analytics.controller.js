const Task = require('../models/Task');
const FocusSession = require('../models/FocusSession');

exports.getAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    const sessions = await FocusSession.find({ userId: req.user.id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalFocusTime = sessions.reduce((acc, curr) => acc + curr.duration, 0);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trend = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      const count = tasks.filter(t => {
        if (!t.completed) return false;
        const updated = new Date(t.updatedAt || t.createdAt);
        return updated >= dayStart && updated <= dayEnd;
      }).length;
      trend.push({ name: dayNames[day.getDay()], completed: count });
    }

    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      const hasActivity = tasks.some(t => t.completed && new Date(t.updatedAt) >= dayStart && new Date(t.updatedAt) <= dayEnd)
        || sessions.some(s => new Date(s.createdAt) >= dayStart && new Date(s.createdAt) <= dayEnd);
      if (hasActivity) { streak++; }
      else if (i > 0) { break; }
    }

    const insights = [];
    if (totalTasks === 0) insights.push("Welcome! Add your first tasks to get started with your study plan.");
    else if (completionRate >= 80) insights.push(`Outstanding! You completed ${completionRate}% of your tasks. You're on fire! 🔥`);
    else if (completionRate >= 50) insights.push(`You completed ${completionRate}% of your tasks. Good progress — keep pushing!`);
    else insights.push(`You completed ${completionRate}% of your tasks. Focus on your highest priority items first.`);

    const overdueCount = tasks.filter(t => !t.completed && new Date(t.deadline) < now).length;
    if (overdueCount > 0) insights.push(`You have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}. They've been reprioritized to the top.`);
    else if (totalTasks > 0) insights.push("No overdue tasks — you're staying ahead of your deadlines! ✅");

    if (totalFocusTime > 0) {
      const hrs = Math.floor(totalFocusTime / 60), mins = totalFocusTime % 60;
      insights.push(`You've logged ${hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`} of focus time. ${totalFocusTime >= 120 ? 'Excellent dedication!' : 'Try to log more sessions.'}`);
    } else {
      insights.push("Start your first Focus Mode session to begin tracking study time.");
    }

    if (streak >= 3) insights.push(`🔥 You're on a ${streak}-day streak! Consistency is your superpower.`);

    const subjectCounts = {};
    tasks.filter(t => !t.completed).forEach(t => { subjectCounts[t.subject] = (subjectCounts[t.subject] || 0) + 1; });
    const top = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] > 1) insights.push(`"${top[0]}" has the most pending tasks (${top[1]}). Consider scheduling a dedicated session.`);

    res.status(200).json({ success: true, data: { totalTasks, completedTasks, completionRate, totalFocusTime, streak, trend, insights } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
