import React from 'react';

export default function ResultsTable({ results, error }) {
  if (error) return (
    <div className="results-panel">
      <div className="results-panel__error">⚠ {error}</div>
    </div>
  );

  if (!results) return (
    <div className="results-panel">
      <div className="results-panel__empty">
        <span style={{fontSize:24}}>⌨</span>
        Write a query and click Run
      </div>
    </div>
  );

  if (results.rows.length === 0) return (
    <div className="results-panel">
      <div className="results-panel__meta">✓ Query executed — 0 rows returned</div>
    </div>
  );

  return (
    <div className="results-panel">
      <div className="results-panel__meta">✓ {results.rowCount} row{results.rowCount !== 1 ? 's' : ''} returned</div>
      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>{results.fields.map(f => <th key={f}>{f}</th>)}</tr>
          </thead>
          <tbody>
            {results.rows.map((row, i) => (
              <tr key={i}>
                {results.fields.map(f => <td key={f}>{String(row[f] ?? 'NULL')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}