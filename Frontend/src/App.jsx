import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
  sessionId: "user-1",
  message,
});

      const aiMessage = {
        sender: "ai",
        text: response.data.reply,
      };

      setChat((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      alert("Backend not connected");
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>AI Chat Assistant</h2>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-msg" : "ai-msg"}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="ai-msg">Thinking...</div>}
      </div>

      <div className="input-box">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;