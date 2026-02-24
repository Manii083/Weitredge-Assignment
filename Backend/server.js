require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const database = require("./database");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(
//   rateLimit({
//     windowMs: 60 * 1000,
//     max: 30
//   })
// );

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});

app.use(limiter);


app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // 1️⃣ Validation
    if (!sessionId || !message) {
      return res.status(400).json({
        error: "sessionId and message are required",
      });
    }

    // 2️⃣ Create session if it doesn't exist
    db.run(
      `INSERT OR IGNORE INTO sessions (id) VALUES (?)`,
      [sessionId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create session" });
        }
      }
    );

    // 3️⃣ Store user message
    db.run(
      `INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)`,
      [sessionId, "user", message],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to store user message" });
        }
      }
    );

    // 4️⃣ Fetch last 10 messages (5 user + 5 assistant pairs)
    db.all(
      `SELECT role, content 
       FROM messages 
       WHERE session_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [sessionId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch history" });
        }

        const history = rows.reverse(); // chronological order

        // 5️⃣ Load docs
        const docs = require("./docs.json");

        

      // 6️⃣ Smarter document matching

      const normalizedMessage = message.toLowerCase();

      // Remove common useless words
      const stopWords = ["what", "is", "the", "how", "can", "i", "a", "an", "about", "please"];

      const messageWords = normalizedMessage
        .replace(/[^\w\s]/gi, "")
        .split(" ")
        .filter(word => word && !stopWords.includes(word));

      // Score each document
      let bestMatch = null;
      let highestScore = 0;

      docs.forEach(doc => {
        const docText = (doc.title + " " + doc.content).toLowerCase();

        let score = 0;

        messageWords.forEach(word => {
          if (docText.includes(word)) {
            score++;
          }
        });

        if (score > highestScore) {
          highestScore = score;
          bestMatch = doc;
        }
      });

      let reply;

      // Require at least 1 keyword match
      if (!bestMatch || highestScore === 0) {
        reply = "Sorry, I don’t have information about that.";
      } else {
        reply = bestMatch.content;
      }

        // 8️⃣ Store assistant reply
        db.run(
          `INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)`,
          [sessionId, "assistant", reply],
          (err) => {
            if (err) {
              return res.status(500).json({ error: "Failed to store assistant message" });
            }
          }
        );

        // 9️⃣ Update session timestamp
        db.run(
          `UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [sessionId]
        );

        // 🔟 Return response
        res.json({
          reply,
          tokensUsed: 0, // You can update if using real LLM
        });
      }
    );

  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});