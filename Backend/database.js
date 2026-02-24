const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const database = new sqlite3.Database(
  path.resolve(__dirname, "chat.db"),
  (err) => {
    if (err) console.error("DB Error:", err);
    else console.log("SQLite Connected");
  }
);

// Create tables
database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      role TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    )
  `);
});

module.exports = database;