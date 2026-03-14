import React from 'react';
import ProgressRing from './ProgressRing';

export default function HabitCard({ habit, onToggle }) {
  const progressPercent = Math.min((habit.progress / habit.goal) * 100, 100);
  const isComplete = habit.completedToday;

  return (
    <div className={`glass-card animate-fade-in-up`} style={{
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow for completed tasks */}
      {isComplete && (
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%', width: '150px', height: '150px',
          background: 'var(--success)', opacity: '0.1', filter: 'blur(40px)', borderRadius: '50%'
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 1 }}>
        <button 
          onClick={() => onToggle(habit.id)}
          style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: isComplete ? 'var(--success)' : 'var(--glass-bg)',
            border: `2px solid ${isComplete ? 'var(--success)' : 'var(--glass-border-highlight)'}`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: isComplete ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          {isComplete ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--glass-border-highlight)' }} />
          )}
        </button>

        <div>
          <h3 style={{ 
            fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.25rem 0',
            textDecoration: isComplete ? 'line-through' : 'none',
            color: isComplete ? 'var(--text-muted)' : 'var(--text-main)',
            transition: 'color 0.3s ease'
          }}>
            {habit.title}
          </h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Streak: {habit.streak}
            </span>
            <span>Category: {habit.category || 'Lifestyle'}</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        <ProgressRing 
          radius={30} 
          stroke={4} 
          progress={progressPercent} 
          color={isComplete ? "var(--success)" : "var(--primary)"} 
        />
        <div style={{ position: 'absolute', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {habit.progress}/{habit.goal}
        </div>
      </div>
    </div>
  );
}
