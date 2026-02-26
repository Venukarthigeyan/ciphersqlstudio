import React from 'react';

export default function SavedQuery({ progress, onRestore }) {
  if (!progress || !progress.found) return null;

  return (
    <div style={{
      marginTop: 12,
      padding: '10px 14px',
      background: 'rgba(0, 229, 204, 0.05)',
      border: '1px solid rgba(0, 229, 204, 0.2)',
      borderRadius: 6,
      fontFamily: 'JetBrains Mono, monospace'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
      }}>
        <span style={{ fontSize: 11, color: '#00e5cc', textTransform: 'uppercase', letterSpacing: 1 }}>
          💾 Last Saved Query
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#7a7f94' }}>
            {progress.attemptCount} attempt{progress.attemptCount !== 1 ? 's' : ''}
          </span>
          {progress.isCompleted && (
            <span style={{
              fontSize: 11,
              background: 'rgba(0, 201, 122, 0.15)',
              color: '#00c97a',
              padding: '2px 8px',
              borderRadius: 4
            }}>
              ✓ Completed
            </span>
          )}
          <button
            onClick={() => onRestore(progress.sqlQuery)}
            style={{
              fontSize: 11,
              background: 'rgba(0, 229, 204, 0.1)',
              border: '1px solid rgba(0, 229, 204, 0.3)',
              color: '#00e5cc',
              padding: '3px 10px',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Restore
          </button>
        </div>
      </div>
      <div style={{
        fontSize: 12,
        color: '#7a7f94',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        maxHeight: 60,
        overflow: 'hidden'
      }}>
        {progress.sqlQuery}
      </div>
      <div style={{ fontSize: 10, color: '#4a4f64', marginTop: 4 }}>
        Last attempt: {new Date(progress.lastAttempt).toLocaleString()}
      </div>
    </div>
  );
}