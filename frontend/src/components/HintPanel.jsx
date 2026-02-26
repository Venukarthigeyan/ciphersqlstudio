import React from 'react';

export default function HintPanel({ hint }) {
  if (!hint) return null;
  return (
    <div className="hint-panel" style={{ margin: '0 16px 16px' }}>
      <div className="hint-panel__label">💡 Hint</div>
      <div className="hint-panel__text">{hint}</div>
    </div>
  );
}