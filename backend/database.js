const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table ready');
    }
  });

  // Resumes table
  db.run(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      template TEXT DEFAULT 'classic',
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating resumes table:', err.message);
    } else {
      console.log('Resumes table ready');
    }
  });

  // Jobs table
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'Applied',
      notes TEXT,
      appliedDate TEXT,
      industry TEXT,
      responseDate TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating jobs table:', err.message);
    } else {
      console.log('Jobs table ready');

      // Add industry column if it doesn't exist (for existing databases)
      db.run(`ALTER TABLE jobs ADD COLUMN industry TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Note: industry column may already exist');
        } else if (!err) {
          console.log('Added industry column to jobs table');
        }
      });

      // Add responseDate column if it doesn't exist (for existing databases)
      db.run(`ALTER TABLE jobs ADD COLUMN responseDate TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Note: responseDate column may already exist');
        } else if (!err) {
          console.log('Added responseDate column to jobs table');
        }
      });
    }
  });

  // Resume Events table - track resume interactions
  db.run(`
    CREATE TABLE IF NOT EXISTS resume_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      resumeId INTEGER NOT NULL,
      eventType TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating resume_events table:', err.message);
    } else {
      console.log('Resume events table ready');
    }
  });

  // Application Events table - track job application timeline
  db.run(`
    CREATE TABLE IF NOT EXISTS application_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      jobId INTEGER NOT NULL,
      eventType TEXT NOT NULL,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating application_events table:', err.message);
    } else {
      console.log('Application events table ready');
    }
  });
}

module.exports = db;
