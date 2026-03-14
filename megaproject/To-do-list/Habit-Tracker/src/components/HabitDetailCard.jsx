import React, { useState } from 'react';
import ProgressRing from './ProgressRing';

export default function HabitDetailCard({ habit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progressPercent = Math.min((habit.progress / habit.goal) * 100, 100);
  const isComplete = habit.completedToday;

  return (
    <div 
      className={`glass-card animate-fade-in-up`} 
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        padding: '1.5rem',
        marginBottom: '1rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: isExpanded ? '200px' : 'auto',
      }}
    >
      {/* Subtle indicator that card is expandable/collapsible */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        color: 'var(--text-muted)',
        transition: 'transform 0.3s ease',
        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* Header / Always Visible Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        zIndex: 1,
        marginBottom: isExpanded ? '1.5rem' : '0'
      }}>
        <div style={{
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          background: isComplete ? 'var(--success)' : 'var(--primary)',
          boxShadow: isComplete ? '0 0 10px var(--success)' : '0 0 10px var(--primary-glow)'
        }} />
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            margin: '0 0 0.25rem 0',
            color: 'var(--text-main)'
          }}>
            {habit.title}
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            🔥 {habit.streak} day streak
          </div>
        </div>
      </div>

      {/* Expanded Details Section */}
      <div style={{
        maxHeight: isExpanded ? '500px' : '0',
        opacity: isExpanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          borderTop: '1px solid var(--glass-border-highlight)',
          paddingTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</span>
            <span style={{ fontWeight: '500' }}>{habit.category || 'Lifestyle'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Goal</span>
            <span style={{ fontWeight: '500' }}>{habit.goal} {habit.goal === 1 ? 'time' : 'times'} / day</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', gridColumn: 'span 2' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Progress</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <ProgressRing 
                radius={24} 
                stroke={4} 
                progress={progressPercent} 
                color={isComplete ? "var(--success)" : "var(--primary)"} 
              />
              <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                {habit.progress} <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/ {habit.goal}</span>
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
