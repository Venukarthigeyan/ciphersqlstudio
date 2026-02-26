const Assignment = require('../models/Assignment');
const { createSandbox } = require('../config/sandbox');

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find(
      {},
      'title description difficulty question createdAt'
    ).sort({ createdAt: 1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
 
    const schemaName = await createSandbox(id, assignment.sampleTables);
 
    const sampleData = {};
    for (const table of assignment.sampleTables) {
      sampleData[table.tableName] = {
        columns: table.columns.map(c => ({
          column_name: c.columnName,
          data_type: c.dataType
        })),
        rows: table.rows
      };
    }

    res.json({
      assignment: {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        difficulty: assignment.difficulty,
        question: assignment.question,
        expectedOutput: assignment.expectedOutput
      },
      sampleData,
      schemaName
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};