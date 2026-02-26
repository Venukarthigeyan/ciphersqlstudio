import React, { useEffect, useState } from 'react';
import { fetchAssignments } from '../services/api';
import AssignmentCard from '../components/AssignmentCard';

export default function AssignmentsPage({ onSelect }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments()
      .then(res => setAssignments(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container page" style={{ color: '#7a7f94', fontFamily: 'JetBrains Mono, monospace' }}>
      Loading assignments...
    </div>
  );

  if (error) return (
    <div className="container page" style={{ color: '#ff4d6d' }}>
      Error: {error}
    </div>
  );

  return (
    <main className="container page">
      <div className="assignments__header">
        <h1>SQL <span>Assignments</span></h1>
        <p>Pick a challenge and sharpen your SQL skills</p>
      </div>
      <div className="assignments__grid">
        {assignments.map(a => (
          <AssignmentCard key={a._id} assignment={a} onClick={() => onSelect(a._id)} />
        ))}
      </div>
    </main>
  );
}