const pool = require('./db');
 
async function createSandbox(assignmentId, sampleTables) {
  const schemaName = `workspace_${assignmentId}`;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
 
    await client.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
    await client.query(`CREATE SCHEMA "${schemaName}"`);
 
    for (const table of sampleTables) {
      const { tableName, columns, rows } = table;
 
      const colDefs = columns.map(c => {
        const pgType = mapType(c.dataType);
        return `"${c.columnName}" ${pgType}`;
      }).join(', ');

      await client.query(
        `CREATE TABLE "${schemaName}"."${tableName}" (${colDefs})`
      );
 
      for (const row of rows) {
        const keys = Object.keys(row);
        const values = Object.values(row);
        const colNames = keys.map(k => `"${k}"`).join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        await client.query(
          `INSERT INTO "${schemaName}"."${tableName}" (${colNames}) VALUES (${placeholders})`,
          values
        );
      }
    }

    await client.query('COMMIT');
    return schemaName;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
 
async function executeInSandbox(schemaName, userQuery) {
  const client = await pool.connect();
  try { 
    await client.query(`SET search_path TO "${schemaName}", public`);
    const result = await client.query(userQuery);
    return {
      rows: result.rows,
      fields: result.fields.map(f => f.name),
      rowCount: result.rowCount
    };
  } finally { 
    await client.query(`SET search_path TO public`);
    client.release();
  }
}
 
async function dropSandbox(schemaName) {
  await pool.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
}
 
function mapType(dataType) {
  const map = {
    'INTEGER': 'INTEGER',
    'TEXT': 'TEXT',
    'REAL': 'NUMERIC',
    'BOOLEAN': 'BOOLEAN',
    'DATE': 'DATE',
    'TIMESTAMP': 'TIMESTAMP'
  };
  return map[dataType?.toUpperCase()] || 'TEXT';
}

module.exports = { createSandbox, executeInSandbox, dropSandbox };