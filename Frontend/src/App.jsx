import axios from "axios";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const chatEndRef = useRef(null);

  // Send Message
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        sessionId,
        message,
      });

      const aiMessage = {
        sender: "assistant",
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

  // Create or Get Session ID
  useEffect(() => {
    let storedId = localStorage.getItem("sessionId");

    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("sessionId", storedId);
    }

    setSessionId(storedId);
  }, []);

  // Load Previous Conversation
  useEffect(() => {
    if (!sessionId) return;

    axios
      .get(`http://localhost:5000/api/conversations/${sessionId}`)
      .then((res) => {
        const formatted = res.data.map((msg) => ({
          sender: msg.role === "assistant" ? "assistant" : "user",
          text: msg.content,
        }));

        setChat(formatted);
      })
      .catch((err) => console.error(err));
  }, [sessionId]);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="container">
      <h2>AI Support Assistant</h2>

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

        <div ref={chatEndRef} />
      </div>

      <div className="input-box">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;