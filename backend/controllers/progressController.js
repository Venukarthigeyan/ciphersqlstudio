const UserProgress = require('../models/UserProgress');

exports.getProgress = async (req, res) => {
  const { assignmentId } = req.params;
  const userId = req.query.userId || 'anonymous';
  try {
    const progress = await UserProgress.findOne({ userId, assignmentId });
    if (!progress) return res.json({ found: false, attemptCount: 0, attempts: [] });
    res.json({
      found: true,
      sqlQuery: progress.sqlQuery,
      attemptCount: progress.attemptCount,
      isCompleted: progress.isCompleted,
      lastAttempt: progress.lastAttempt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markComplete = async (req, res) => {
  const { assignmentId, userId } = req.body;
  try {
    await UserProgress.findOneAndUpdate(
      { userId: userId || 'anonymous', assignmentId },
      { isCompleted: true },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};