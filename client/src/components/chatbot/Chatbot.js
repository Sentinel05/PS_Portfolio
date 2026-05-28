import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import Avatar from "../../assets/images/chatbot-avatar.png";

const INITIAL_MESSAGE = {
  role: "bot",
  text: "Hi! I'm Priyanshu's AI assistant. Ask me anything about his experience, projects, or skills!",
};

const TypingDots = () => (
  <div className="chat__typing">
    <span />
    <span />
    <span />
  </div>
);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ps-portfolio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const answer = data.success
        ? data.answer
        : "Sorry, I ran into an issue. Please try again or use the Contact section.";
      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Network error. Please check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot">
      {/* ── Chat Panel ── */}
      <div className={`chatbot__panel ${open ? "chatbot__panel--open" : ""}`} role="dialog" aria-label="Portfolio AI assistant">
        {/* Header */}
        <div className="chatbot__header">
          <img src={Avatar} alt="AI Avatar" className="chatbot__header-avatar" />
          <div className="chatbot__header-info">
            <span className="chatbot__header-name">Priyanshu's AI</span>
            <span className="chatbot__header-status">
              <span className="chatbot__status-dot" />
              Online
            </span>
          </div>
          <button
            className="chatbot__close"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat__message chat__message--${msg.role}`}>
              {msg.role === "bot" && (
                <img src={Avatar} alt="bot" className="chat__message-avatar" />
              )}
              <div className="chat__bubble">{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat__message chat__message--bot">
              <img src={Avatar} alt="bot" className="chat__message-avatar" />
              <div className="chat__bubble">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot__input-area">
          <input
            ref={inputRef}
            className="chatbot__input"
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            disabled={loading}
            aria-label="Chat message input"
          />
          <button
            className="chatbot__send"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Floating Trigger Button ── */}
      <button
        className={`chatbot__trigger ${open ? "chatbot__trigger--active" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle AI chat assistant"
      >
        <img src={Avatar} alt="AI Chat" className="chatbot__trigger-avatar" />
        {!open && <span className="chatbot__trigger-dot" />}
      </button>
    </div>
  );
};

export default Chatbot;
