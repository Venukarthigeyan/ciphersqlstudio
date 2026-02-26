const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  columnName: String,
  dataType: String
});

const sampleTableSchema = new mongoose.Schema({
  tableName: String,
  columns: [columnSchema],
  rows: [mongoose.Schema.Types.Mixed]
});

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  question: String,
  sampleTables: [sampleTableSchema],
  expectedOutput: {
    type: { type: String },
    value: mongoose.Schema.Types.Mixed
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);