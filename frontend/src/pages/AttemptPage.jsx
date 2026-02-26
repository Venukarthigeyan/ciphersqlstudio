import React, { useEffect, useState } from 'react';
import { fetchAssignment, executeQuery, getHint, fetchProgress } from '../services/api';
import SqlEditor from '../components/SqlEditor';
import HintPanel from '../components/HintPanel';
import ResultsTable from '../components/ResultsTable';
import SampleDataViewer from '../components/SampleDataViewer';
import SavedQuery from '../components/SavedQuery';

export default function AttemptPage({ id, onBack, userId }) {
  const [data, setData] = useState(null);
  const [schemaName, setSchemaName] = useState(null);
  const [query, setQuery] = useState('SELECT * FROM employees');
  const [results, setResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [execLoading, setExecLoading] = useState(false);
  const [progress, setProgress] = useState(null);

  const uid = userId || 'anonymous';

  useEffect(() => {
    fetchAssignment(id).then(res => {
      setData(res.data);
      setSchemaName(res.data.schemaName);
      const firstTable = Object.keys(res.data.sampleData || {})[0] || 'employees';
      setQuery(`SELECT * FROM ${firstTable}`);
    }).catch(err => console.error(err));

    fetchProgress(id, uid).then(res => {
      setProgress(res.data);
    }).catch(() => {});
  }, [id, uid]);  

  const handleExecute = async () => {
    setExecLoading(true);
    setResults(null);
    setQueryError(null);
    try {
      const res = await executeQuery(id, query, schemaName, uid);
      setResults(res.data);
      fetchProgress(id, uid).then(r => setProgress(r.data)).catch(() => {});
    } catch (err) {
      setQueryError(err.response?.data?.error || 'Execution failed');
    } finally {
      setExecLoading(false);
    }
  };

  const handleHint = async () => {
    if (!data) return;
    setHintLoading(true);
    setHint(null);
    try {
      const schema = Object.fromEntries(
        Object.entries(data.sampleData).map(([t, v]) => [t, v.columns])
      );
      const res = await getHint(data.assignment.question, query, schema);
      setHint(res.data.hint);
    } catch {
      setHint('Could not load hint. Try again.');
    } finally {
      setHintLoading(false);
    }
  };

  const handleRestore = (savedQuery) => {
    setQuery(savedQuery);
    setResults(null);
    setQueryError(null);
    setHint(null);
  };

  if (!data) return (
    <div className="container page" style={{ color: '#7a7f94', fontFamily: 'JetBrains Mono, monospace' }}>
      Setting up sandbox...
    </div>
  );

  const { assignment, sampleData } = data;

  return (
    <main className="container page">
      <div className="attempt-layout">

        {/* Left Panel */}
        <div>
          <div className="question-panel">
            <button className="question-panel__back" onClick={onBack}>
              ← All Assignments
            </button>
            <div className="question-panel__difficulty">{assignment.difficulty}</div>
            <div className="question-panel__title">{assignment.title}</div>
            <div className="question-panel__question">{assignment.question}</div>
            <SampleDataViewer sampleData={sampleData} />
          </div>
        </div>

        {/* Right Panel */}
        <div>
          <div className="editor-section">
            <div className="editor-section__toolbar">
              <span className="editor-section__label">SQL Editor</span>
              <div className="editor-section__actions">
                <button
                  className="btn btn--hint"
                  onClick={handleHint}
                  disabled={hintLoading}
                >
                  {hintLoading ? 'Thinking...' : '💡 Get Hint'}
                </button>
                <button
                  className="btn btn--primary"
                  onClick={handleExecute}
                  disabled={execLoading}
                >
                  {execLoading ? 'Running...' : '▶ Run Query'}
                </button>
              </div>
            </div>

            <SqlEditor value={query} onChange={setQuery} />
            <HintPanel hint={hint} />

            <div style={{ padding: '0 16px 16px' }}>
              <SavedQuery progress={progress} onRestore={handleRestore} />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <ResultsTable results={results} error={queryError} />
          </div>
        </div>

      </div>
    </main>
  );
}