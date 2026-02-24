AI Support Assistant

A full-stack AI-powered support assistant built with React + Node.js + MongoDB.
The system stores conversations per session and returns AI-based responses.

📌 Features

Session-based conversation storage

Persistent chat history

REST API backend

Clean React UI

Token usage tracking

🛠 Tech Stack

Frontend:

React

Axios

UUID

Backend:

Node.js

Express.js

GROK API

🚀 Setup Instructions
1️⃣ Clone Repository
git clone <your-repo-url>
2️⃣ Backend Setup
cd backend
npm install

Create .env file inside /backend:

PORT=5000
GROK_API_KEY=your_GROK_key

Run backend:

npm start

Server runs at:

http://localhost:5000
3️⃣ Frontend Setup
cd frontend
npm install
npm start

Frontend runs at:

http://localhost:5007
📡 API Documentation
🔹 POST /api/chat

Send user message and receive AI response.

Request Body
{
  "sessionId": "abc123",
  "message": "how to change password"
}
Response
{
  "reply": "AI response text",
  "tokensUsed": 120
}
🔹 GET /api/conversations/:sessionId

Fetch full conversation history for session.

Response
[
  {
    "role": "user",
    "content": "Hello"
  },
  {
    "role": "assistant",
    "content": "Hi! How can I help?"
  }
]
🗄 Database Schema Explanation
Conversation Schema
{
  sessionId: String,
  role: String,       // "user" or "assistant"
  content: String,
  createdAt: Date
}
Explanation:

sessionId → Identifies unique user session

role → Identifies speaker

content → Message text

createdAt → Timestamp

This enables session-based conversation tracking.

📸 Sample Screenshots

docs.json :
[
  {
    "title": "Reset Password",
    "content": "Users can reset password from Settings > Security."
  },
  {
    "title": "Refund Policy",
    "content": "Refunds are allowed within 7 days of purchase."
  }
]


📌 Assumptions

Each user session is identified via UUID stored in localStorage.

Conversations are stored message-by-message.

No authentication required.

GROK responses may vary.

System designed for single-user local testing environment.
