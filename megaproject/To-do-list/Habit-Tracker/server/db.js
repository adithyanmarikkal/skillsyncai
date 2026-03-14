const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database (stores data in a local file in the /server dir)
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDB();
  }
});

// Create tables if they don't exist
function initializeDB() {
  db.serialize(() => {
    // Habits table
    db.run(`
      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        goal INTEGER NOT NULL DEFAULT 1,
        streak INTEGER NOT NULL DEFAULT 0,
        category TEXT
      )
    `);

    // Progress table to track daily completion
    db.run(`
      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id TEXT NOT NULL,
        date TEXT NOT NULL,
        completed_amount INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY(habit_id) REFERENCES habits(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Tables initialized securely.');
      }
    });
  });
}

module.exports = db;
