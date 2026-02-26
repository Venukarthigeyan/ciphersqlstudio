import { useState } from 'react';
import { executeQuery } from '../services/api';

export default function useQuery() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const runQuery = async (assignmentId, query) => {
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const res = await executeQuery(assignmentId, query);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Execution failed');
    } finally {
      setLoading(false);
    }
  };

  return { results, error, loading, runQuery };
}