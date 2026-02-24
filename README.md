🧪 AI-Powered Support Assistant

An AI-powered full-stack Support Assistant built using:

Frontend: React.js

Backend: Node.js (Express)

Database: SQLite

LLM Provider: (GROK)

The assistant answers strictly based on provided product documentation, maintains session-based context, and stores all conversations in SQLite.

If a question is outside the documentation scope, the assistant responds:

"Sorry, I don’t have information about that."

🚀 Features
✅ Core Features

Chat-based UI built in React

Session-based conversation memory

SQLite-based persistent storage

Document-restricted AI responses.

Context handling, last 5 user+assistant pairs

Rate limiting per IP

Proper error handling

📁 Project Structure
Weitredge-Assignment/
│
├── frontend/      → React application
├── backend/       → Express server + SQLite + LLM logic
├── docs.json      → Product documentation 
└── README.md
🧠 How It Works

User sends a message from React UI

Backend:

Validates session

Fetches last 5 message pairs from SQLite

Loads relevant docs content from docs.json

Constructs a strict prompt

Calls LLM

LLM generates answer using ONLY docs

Messages are stored in SQLite

Response returned to frontend

🗄 Database Schema
✅ sessions Table
Column	Type	Description
id	TEXT	sessionId (PK)
created_at	DATETIME	Created timestamp
updated_at	DATETIME	Last message timestamp
✅ messages Table
Column	Type	Description
id	INTEGER	Primary Key (Auto Increment)
session_id	TEXT	Foreign key → sessions.id
role	TEXT	"user" or "assistant"
content	TEXT	Message text
created_at	DATETIME	Timestamp
🔌 API Endpoints
✅ 1️⃣ POST /api/chat

Send a message to the assistant.

Request
{
  "sessionId": "abc123",
  "message": "How can I reset my password?"
}
Response
{
  "reply": "Users can reset password from Settings > Security.",
  "tokensUsed": 123
}
✅ 2️⃣ GET /api/conversations/:sessionId

Returns all messages for a session (chronological order).

✅ 3️⃣ GET /api/sessions

Returns list of all sessions with lastUpdated timestamps.

📄 Document-Based Answering

The system uses a docs.json file:

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
Strict Rules

Assistant answers ONLY using content from this file

If information is not found:

"Sorry, I don’t have information about that."

No guessing or hallucination

🔄 Context Handling

Last 5 user + assistant pairs are fetched from SQLite

Context is included in prompt

No in-memory session storage

Fully persistent conversation history

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/Manii083/Weitredge-Assignment.git
cd Weitredge-Assignment
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
LLM_API_KEY=your_api_key_here
LLM_PROVIDER=openai

Run backend:

npm start
3️⃣ Frontend Setup
cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3000

Backend runs on:

http://localhost:5000
🛡 Error Handling

The backend handles:

Missing sessionId

Missing message

LLM API failures

Database failures

Rate limit exceeded

All errors return clean JSON:

{
  "error": "Message is required."
}
🚦 Rate Limiting

Basic IP-based rate limiting is implemented to prevent abuse.


📸 Screenshots
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b3152aca-0765-4dc5-92c2-85d0dd16467c" />

<img width="1916" height="937" alt="image" src="https://github.com/user-attachments/assets/b43ba7ca-c270-41ea-b228-75b807b88117" />

📌 Assumptions

Documentation is small and stored locally (docs.json)

LLM token usage is returned if supported by provider

SQLite is sufficient for assignment scope

👨‍💻 Author

Manideep Katkam

Backend-focused developer building scalable systems with:

Node.js

Express

React


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


