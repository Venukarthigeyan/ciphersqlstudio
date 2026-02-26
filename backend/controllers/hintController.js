const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.getHint = async (req, res) => {
  const { question, userQuery, tableSchema } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 150,
      messages: [
        {
          role: 'system',
          content: 'You are a SQL tutor. Give hints only — never the full solution. 2-3 sentences max.'
        },
        {
          role: 'user',
          content: `Assignment: ${question}\nSchema: ${JSON.stringify(tableSchema)}\nStudent query: ${userQuery || '(none yet)'}\n\nGive a hint without revealing the answer.`
        }
      ]
    });
    res.json({ hint: completion.choices[0].message.content });
  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: err.message });
  }
};