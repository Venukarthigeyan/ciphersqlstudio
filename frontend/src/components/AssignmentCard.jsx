import React from 'react';

export default function AssignmentCard({ assignment, onClick }) {
  return (
    <div className="assignment-card" onClick={onClick}>
      <div className={`assignment-card__difficulty assignment-card__difficulty--${assignment.difficulty}`}>
        {assignment.difficulty}
      </div>
      <div className="assignment-card__title">{assignment.title}</div>
      <div className="assignment-card__description">{assignment.description}</div>
      <div className="assignment-card__arrow">→ Attempt</div>
    </div>
  );
}