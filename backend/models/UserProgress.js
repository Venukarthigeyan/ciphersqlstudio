const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: String,
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  sqlQuery: String,
  lastAttempt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  attemptCount: { type: Number, default: 1 }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);