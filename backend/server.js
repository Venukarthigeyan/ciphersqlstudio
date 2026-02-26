require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectMongo = require('./config/mongo');
const mongoose = require('mongoose');
setTimeout(async () => {
  try {
    const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.collection('users').dropIndex('username_1');
      
    }
  } catch (e) {
    
  }
}, 2000);

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
connectMongo();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/query', require('./routes/query'));
app.use('/api/hints', require('./routes/hints'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/auth', require('./routes/auth'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
