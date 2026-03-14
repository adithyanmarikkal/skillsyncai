const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Helper function to get today's date in YYYY-MM-DD
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Helper to fill in missing days for analytics
function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// GET all habits and check today's progress to set `completedToday` & `progress`
app.get('/api/habits', (req, res) => {
  const today = getTodayDate();
  
  const query = `
    SELECT 
      h.id, h.title, h.goal, h.streak, h.category,
      COALESCE(p.completed_amount, 0) as progress
    FROM habits h
    LEFT JOIN progress p ON h.id = p.habit_id AND p.date = ?
  `;

  db.all(query, [today], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Map data to match frontend expectations
    const habits = rows.map(row => ({
      id: row.id,
      title: row.title,
      goal: row.goal,
      streak: row.streak,
      category: row.category,
      progress: row.progress,
      completedToday: row.progress >= row.goal
    }));
    
    res.json(habits);
  });
});

// POST a new habit
app.post('/api/habits', (req, res) => {
  const { title, goal, category } = req.body;
  const id = Date.now().toString(); // simple ID generator used previously in frontend

  const stmt = db.prepare(`INSERT INTO habits (id, title, goal, category, streak) VALUES (?, ?, ?, ?, 0)`);
  stmt.run(id, title, goal || 1, category || 'Custom', function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, title, goal: goal || 1, category: category || 'Custom', streak: 0, progress: 0, completedToday: false });
  });
  stmt.finalize();
});

// POST toggle/increment a habit's progress for today
app.post('/api/habits/:id/toggle', (req, res) => {
  const habitId = req.params.id;
  const today = getTodayDate();

  // 1. Get current habit goal to check if it's already complete
  db.get(`SELECT goal, streak FROM habits WHERE id = ?`, [habitId], (err, habitRow) => {
    if (err || !habitRow) return res.status(404).json({ error: 'Habit not found' });
    
    const goal = habitRow.goal;

    // 2. See if there is a progress row for today
    db.get(`SELECT id, completed_amount FROM progress WHERE habit_id = ? AND date = ?`, [habitId, today], (err, progressRow) => {
      if (err) return res.status(500).json({ error: err.message });

      if (progressRow) {
        // Toggle logic: If already completed goal, reset to (goal - 1). Else, increment.
        const wasCompleted = progressRow.completed_amount >= goal;
        const newAmount = wasCompleted ? Math.max(0, progressRow.completed_amount - 1) : Math.min(goal, progressRow.completed_amount + 1);
        
        db.run(`UPDATE progress SET completed_amount = ? WHERE id = ?`, [newAmount, progressRow.id], function(updateErr) {
            if (updateErr) return res.status(500).json({ error: updateErr.message });
            
            // Adjust streak (simple increment if just finished today, decrement if revoked - overly simplified for demo)
            if (!wasCompleted && newAmount >= goal) {
                db.run(`UPDATE habits SET streak = streak + 1 WHERE id = ?`, [habitId]);
            } else if (wasCompleted && newAmount < goal) {
                db.run(`UPDATE habits SET streak = MAX(0, streak - 1) WHERE id = ?`, [habitId]);
            }
            
            res.json({ habitId, progress: newAmount, completedToday: newAmount >= goal });
        });
      } else {
        // First progress log for today (starts at 1)
        db.run(`INSERT INTO progress (habit_id, date, completed_amount) VALUES (?, ?, 1)`, [habitId, today], function(insertErr) {
            if (insertErr) return res.status(500).json({ error: insertErr.message });
            
            // Adjust streak if goal was exactly 1
            if (goal === 1) {
                db.run(`UPDATE habits SET streak = streak + 1 WHERE id = ?`, [habitId]);
            }
            
            res.json({ habitId, progress: 1, completedToday: goal === 1 });
        });
      }
    });
  });
});

// GET analytics data for the chart
app.get('/api/analytics', (req, res) => {
  const last7Days = getLast7Days();
  const today = getTodayDate();
  
  // Get total active habits count to calculate percentage
  db.get(`SELECT COUNT(*) as count FROM habits`, [], (err, totalHabitsRow) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const totalHabits = totalHabitsRow.count;
    if (totalHabits === 0) {
      // Return 0s if no habits exist
      const emptyData = last7Days.map(date => {
          const d = new Date(date);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          return { date: dayName, percentage: 0 };
      });
      return res.json(emptyData);
    }

    // Getting the sum of habits completed relative to goal per day
    const query = `
      SELECT p.date, COUNT(p.habit_id) as habitsCompleted
      FROM progress p
      JOIN habits h ON p.habit_id = h.id
      WHERE p.date >= ? AND p.completed_amount >= h.goal
      GROUP BY p.date
    `;

    db.all(query, [last7Days[0]], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const mapByDate = {};
        rows.forEach(r => { mapByDate[r.date] = r.habitsCompleted; });

        const analyticsData = last7Days.map(date => {
            const completedCount = mapByDate[date] || 0;
            const percentage = Math.round((completedCount / totalHabits) * 100);
            
            const d = new Date(date);
            // Re-format `Mon`, `Tue` to match frontend chart style
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            
            return { date: dayName, percentage };
        });

        res.json(analyticsData);
    });
  });
});

// Default seed script endpoint for easy testing
app.get('/api/seed', (req, res) => {
  const habits = [
    { id: '1', title: 'Learn React', goal: 1, streak: 5, category: 'Learning' },
    { id: '2', title: 'Drink Water', goal: 8, streak: 12, category: 'Health' },
    { id: '3', title: 'Morning Run', goal: 1, streak: 3, category: 'Fitness' }
  ];
  
  db.serialize(() => {
    // Clear existing
    db.run("DELETE FROM habits");
    db.run("DELETE FROM progress");

    const stmt = db.prepare("INSERT INTO habits (id, title, goal, streak, category) VALUES (?, ?, ?, ?, ?)");
    habits.forEach(h => {
        stmt.run(h.id, h.title, h.goal, h.streak, h.category);
    });
    stmt.finalize();
    
    // Seed some progress for today
    const today = getTodayDate();
    const pStmt = db.prepare("INSERT INTO progress (habit_id, date, completed_amount) VALUES (?, ?, ?)");
    pStmt.run('2', today, 4); // Drink Water 4/8
    pStmt.run('3', today, 1); // Morning run 1/1 (complete)
    pStmt.finalize();

    res.send("Database seeded!");
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
