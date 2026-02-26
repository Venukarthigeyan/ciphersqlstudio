const FORBIDDEN = ['drop', 'delete', 'truncate', 'insert', 'update', 'alter', 'create', 'grant', 'revoke'];

const sanitizeQuery = (req, res, next) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'No query provided' });
  }
  const lower = query.toLowerCase().trim();
  const hasForbidden = FORBIDDEN.some(word => {
    const regex = new RegExp(`\\b${word}\\b`);
    return regex.test(lower);
  });
  if (hasForbidden) {
    return res.status(403).json({ error: 'Only SELECT queries are allowed' });
  }
  if (!lower.startsWith('select')) {
    return res.status(403).json({ error: 'Query must start with SELECT' });
  }
  next();
};

module.exports = sanitizeQuery;