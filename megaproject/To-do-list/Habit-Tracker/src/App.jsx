import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HabitCard from './components/HabitCard';
import AddHabitForm from './components/AddHabitForm';
import Navbar from './components/Navbar';
import HabitDetailCard from './components/HabitDetailCard';
import AnalyticsChart from './components/AnalyticsChart';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [habits, setHabits] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchHabits = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/habits`);
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleAddHabit = async (newHabit) => {
    try {
      const response = await fetch(`${API_BASE_URL}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHabit),
      });
      if (response.ok) {
        const addedHabit = await response.json();
        setHabits([addedHabit, ...habits]);
      }
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const handleToggleHabit = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/habits/${id}/toggle`, {
        method: 'POST',
      });
      if (response.ok) {
        const updatedInfo = await response.json();
        
        // Optimistically/Locally update the state based on response
        setHabits(habits.map(habit => {
          if (habit.id === id) {
            return {
              ...habit,
              progress: updatedInfo.progress,
              completedToday: updatedInfo.completedToday,
              // Note: streak is slightly disconnected here for simplicity,
              // typically would reload habits or return full habit from toggle
            };
          }
          return habit;
        }));
      }
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  // Calculate some stats for the dashboard header
  const totalCompleted = habits.filter(h => h.completedToday).length;
  const progressPercentage = habits.length > 0 ? (totalCompleted / habits.length) * 100 : 0;

  const renderContent = () => {
    if (activeTab === 'home') {
      return (
        <div className="animate-fade-in-up">
          {/* Daily Summary Glass Panel */}
          <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Daily Progress</h2>
              <p style={{ color: 'var(--text-muted)' }}>You've completed {totalCompleted} out of {habits.length} habits today.</p>
            </div>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--glass-border)"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage}, 100`}
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Your Habits</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '6rem' }}>
              {habits.map(habit => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onToggle={handleToggleHabit} 
                />
              ))}
              {habits.length === 0 && (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No habits defined yet. Add one above to get started!
                </div>
              )}
            </div>
          </section>
        </div>
      );
    }

    if (activeTab === 'habit') {
      return (
        <div className="animate-fade-in-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Habit Details</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Tap on a habit to view your detailed progress and stats.</p>
          
          <AddHabitForm onAdd={handleAddHabit} />
          
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '6rem' }}>
            {habits.map(habit => (
              <HabitDetailCard key={habit.id} habit={habit} />
            ))}
            {habits.length === 0 && (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No habits to detail yet. Add one from the Home tab!
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'analytics') {
      return (
        <div className="animate-fade-in-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Analytics</h2>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Your daily completion rate over the last 7 days.</p>
          
          <AnalyticsChart data={analyticsData} />
          
          <div style={{ paddingBottom: '6rem' }}></div>
        </div>
      );
    }
  };

  return (
    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '2rem 1rem', position: 'relative', minHeight: '100vh' }}>
      <Header />
      <main>
        {renderContent()}
      </main>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
