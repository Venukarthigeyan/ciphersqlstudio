import React from 'react';
import Editor from '@monaco-editor/react';

export default function SqlEditor({ value, onChange }) {
  const isMobile = window.innerWidth < 641;

  return (
    <Editor
      height={isMobile ? '200px' : '280px'}
      defaultLanguage="sql"
      language="sql"
      value={value}
      onChange={(val) => onChange(val ?? '')}
      theme="vs-dark"
      options={{
        fontSize: isMobile ? 12 : 14,
        fontFamily: "'JetBrains Mono', monospace",
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
      }}
    />
  );
}