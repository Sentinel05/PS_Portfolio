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

/**
 * Lightweight markdown renderer — handles bold, inline code, bullet lists,
 * and line breaks without requiring an external library.
 */
const renderMarkdown = (text) => {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  const parseInline = (str) => {
    // Split on **bold** and `code` patterns
    const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={idx} className="chat__inline-code">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    // Collect consecutive bullet lines into a <ul>
    if (/^(\s*[-*•]\s)/.test(line)) {
      const items = [];
      while (i < lines.length && /^(\s*[-*•]\s)/.test(lines[i])) {
        items.push(
          <li key={i}>{parseInline(lines[i].replace(/^\s*[-*•]\s/, ""))}</li>
        );
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="chat__list">{items}</ul>);
      continue;
    }

    // Empty line → spacer
    if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(<p key={i} className="chat__para">{parseInline(line)}</p>);
    }
    i++;
  }

  return elements;
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // true only while the panel is fully open (not during close animation)
  const isOpen = open && !isClosing;

  // Show speech bubble after a short delay on first mount
  useEffect(() => {
    const t = setTimeout(() => setBubbleVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Re-show speech bubble after the chat closes (unless permanently dismissed)
  useEffect(() => {
    if (!open && !bubbleDismissed) {
      const t = setTimeout(() => setBubbleVisible(true), 700);
      return () => clearTimeout(t);
    }
  }, [open, bubbleDismissed]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 420);
  }, [isOpen]);

  const handleOpen = () => {
    setBubbleVisible(false);
    setIsClosing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 380);
  };

  const handleDismissBubble = (e) => {
    e.stopPropagation();
    setBubbleVisible(false);
    setBubbleDismissed(true);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Capture current history BEFORE adding the new user message
    const historySnapshot = messages;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ps-portfolio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          // Send prior conversation so the backend can maintain context
          history: historySnapshot.map(({ role, text: t }) => ({ role, text: t })),
        }),
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

  const bubbleShowing = bubbleVisible && !isOpen;

  return (
    <div className="chatbot">
      {/* ── Chat Panel ── */}
      <div
        className={`chatbot__panel${isOpen ? " chatbot__panel--open" : ""}`}
        role="dialog"
        aria-label="Portfolio AI assistant"
        aria-hidden={!isOpen}
      >
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
          <button className="chatbot__close" onClick={handleClose} aria-label="Close chat">
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
              <div className="chat__bubble">
                {msg.role === "bot" ? renderMarkdown(msg.text) : msg.text}
              </div>
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

      {/* ── Full Figure (closed state) ── */}
      <div
        className={`chatbot__figure${isOpen ? " chatbot__figure--hidden" : ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={isOpen ? -1 : 0}
        aria-label="Open AI chat assistant"
        onKeyDown={(e) => !isOpen && e.key === "Enter" && handleOpen()}
      >
        {/* Speech bubble */}
        <div className={`chatbot__speech${bubbleShowing ? " chatbot__speech--visible" : ""}`}>
          <span className="chatbot__speech-text">Need any help? 👋</span>
          <button
            className="chatbot__speech-dismiss"
            onClick={handleDismissBubble}
            aria-label="Dismiss"
            tabIndex={bubbleShowing ? 0 : -1}
          >
            ✕
          </button>
          <span className="chatbot__speech-tail" aria-hidden="true" />
        </div>

        {/* Figure image with ambient glow + online dot */}
        <div className="chatbot__figure-body">
          <span className="chatbot__figure-glow" aria-hidden="true" />
          <img src={Avatar} alt="AI Assistant" className="chatbot__figure-img" />
          <span className="chatbot__figure-dot" aria-hidden="true" />
        </div>
      </div>

      {/* ── Small Avatar Trigger (open state) ── */}
      <button
        className={`chatbot__trigger${isOpen ? " chatbot__trigger--visible" : ""}`}
        onClick={handleClose}
        aria-label="Minimize chat"
        tabIndex={isOpen ? 0 : -1}
      >
        <img src={Avatar} alt="AI Chat" className="chatbot__trigger-avatar" />
      </button>
    </div>
  );
};

export default Chatbot;
