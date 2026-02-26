import React, { useState } from 'react';

export default function SampleDataViewer({ sampleData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="schema-viewer">
      <div className="schema-viewer__title">
        Available Tables
        <button
          style={{marginLeft:8,background:'none',border:'none',cursor:'pointer',color:'#00e5cc',fontFamily:'inherit',fontSize:11}}
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? '▲ hide data' : '▼ show data'}
        </button>
      </div>
      {Object.entries(sampleData).map(([tableName, { columns, rows }]) => (
        <div key={tableName} className="schema-viewer__table">
          <div className="schema-viewer__table-name">{tableName}</div>
          <div className="schema-viewer__table-cols">
            {columns.map(c => (
              <span key={c.column_name} className="schema-viewer__table-col">
                <span>{c.column_name}</span>:{c.data_type}
              </span>
            ))}
          </div>
          {expanded && rows.length > 0 && (
            <div style={{marginTop:8,overflowX:'auto'}}>
              <table style={{fontSize:11,fontFamily:'JetBrains Mono,monospace',borderCollapse:'collapse',width:'100%'}}>
                <thead>
                  <tr>{Object.keys(rows[0]).map(k => (
                    <th key={k} style={{padding:'3px 8px',textAlign:'left',color:'#7a7f94',borderBottom:'1px solid #2a2f45'}}>{k}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((v, j) => (
                        <td key={j} style={{padding:'3px 8px',color:'#e8eaf0'}}>{String(v ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}