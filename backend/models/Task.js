const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  subject: { type: String, required: [true, 'Please add a subject'] },
  topic: { type: String, required: [true, 'Please add a topic'] },
  deadline: { type: Date, required: [true, 'Please add a deadline'] },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  importance: { type: Number, min: 1, max: 5, default: 3 },
  estimatedTime: { type: Number, required: [true, 'Please add estimated time'] },
  completed: { type: Boolean, default: false },
  priorityScore: { type: Number, default: 0 }
}, { timestamps: true });

taskSchema.pre('save', function (next) {
  if (!this.completed) {
    const now = new Date();
    const daysUntilDeadline = Math.max(0.1, (this.deadline - now) / (1000 * 60 * 60 * 24));
    const proximityScore = Math.max(0, 10 - daysUntilDeadline);
    const difficultyMap = { easy: 1, medium: 2, hard: 3 };
    const diffScore = difficultyMap[this.difficulty] || 2;
    this.priorityScore = (proximityScore * 5) + diffScore + this.importance;
  } else {
    this.priorityScore = -1;
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
