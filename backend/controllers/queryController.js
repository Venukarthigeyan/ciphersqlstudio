const { executeInSandbox } = require('../config/sandbox');
const UserProgress = require('../models/UserProgress');

exports.executeQuery = async (req, res) => {
  const { query, assignmentId, schemaName, userId } = req.body;

  if (!schemaName) {
    return res.status(400).json({ error: 'No sandbox schema provided' });
  }

  try {
    const result = await executeInSandbox(schemaName, query);
 
    await UserProgress.findOneAndUpdate(
      { userId: userId || 'anonymous', assignmentId },
      {
        sqlQuery: query,
        lastAttempt: new Date(),
        $inc: { attemptCount: 1 }
      },
      { upsert: true, new: true }
    );

    res.json(result);
  } catch (err) { 
    await UserProgress.findOneAndUpdate(
      { userId: userId || 'anonymous', assignmentId },
      {
        sqlQuery: query,
        lastAttempt: new Date(),
        $inc: { attemptCount: 1 }
      },
      { upsert: true, new: true }
    ).catch(() => {});

    res.status(400).json({ error: err.message });
  }
};