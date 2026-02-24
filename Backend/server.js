require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors = require("cors");
const rateLimit = require("express-rate-limit");



const app = express();

app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30
  })
);


app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: "Missing sessionId or message" });
    }

    // Ensure session exists
    db.run(
      `INSERT OR IGNORE INTO sessions(id) VALUES(?)`,
      [sessionId]
    );

    // Save user message
    db.run(
      `INSERT INTO messages(session_id, role, content)
       VALUES(?, 'user', ?)`,
      [sessionId, message]
    );

    // Get last 10 messages
    db.all(
      `SELECT role, content
       FROM messages
       WHERE session_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [sessionId],
      async (err, rows) => {
        if (err) {
          return res.status(500).json({ error: "DB error" });
        }

        const context = rows.reverse();

        const { generateReply } = require("./llm");
        const reply = await generateReply(context, message);

        // Save assistant reply
        db.run(
          `INSERT INTO messages(session_id, role, content)
           VALUES(?, 'assistant', ?)`,
          [sessionId, reply]
        );

        // ✅ Only ONE response
        res.json({ reply });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/conversations/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;

  db.all(
    `SELECT role, content, created_at
     FROM messages
     WHERE session_id = ?
     ORDER BY created_at ASC`,
    [sessionId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }
      res.json(rows);
    }
  );
});

app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});