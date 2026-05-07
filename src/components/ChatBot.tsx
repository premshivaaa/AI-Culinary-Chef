"use client";

import React, { useState } from "react";
import styles from "../app/page.module.css";
import { FaCommentDots } from "react-icons/fa";

interface ChatBotProps {
  recipeContext: string;
}

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatBot({ recipeContext }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, text: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          history: newMessages.slice(0, -1), // Everything except the new message 
          message: input, 
          context: recipeContext 
        }),
      });

      if (!response.ok) throw new Error("Chat failed");

      const data = await response.json();
      setMessages([...newMessages, { role: "model", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "model", text: "Sorry, I'm having trouble thinking right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed", bottom: "20px", right: "20px",
          width: "60px", height: "60px", borderRadius: "30px",
          background: "var(--primary)", color: "var(--background)", fontSize: "24px",
          border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", zIndex: 999
        }}
      >
        <FaCommentDots size={24} />
      </button>
    );
  }

  return (
    <div className="glass-panel" style={{
      position: "fixed", bottom: "20px", right: "20px",
      width: "350px", height: "500px", display: "flex", flexDirection: "column",
      zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.8)"
    }}>
      <div style={{ padding: "15px", borderBottom: "1px solid var(--surface-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Chef AI</h3>
        <button className="btn" onClick={() => setIsOpen(false)} style={{ padding: "5px 10px" }}>✕</button>
      </div>

      <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--secondary)", fontSize: "0.9rem" }}>
            Ask me anything about the recipe! e.g., &quot;How do I make it crispier?&quot;
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            background: msg.role === "user" ? "var(--primary)" : "var(--surface-border)",
            color: msg.role === "user" ? "var(--background)" : "var(--foreground)",
            padding: "10px 15px", borderRadius: "12px", maxWidth: "80%"
          }}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: "flex-start", background: "var(--surface-border)", color: "var(--foreground)", padding: "10px 15px", borderRadius: "12px" }}>
            <p style={{ margin: 0, fontSize: "0.95rem" }}>Thinking...</p>
          </div>
        )}
      </div>

      <div style={{ padding: "15px", borderTop: "1px solid var(--surface-border)", display: "flex", gap: "10px" }}>
        <input 
          className={styles.textarea}
          style={{ minHeight: "40px", padding: "10px", flex: 1 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question..."
        />
        <button className="btn btn-primary" onClick={sendMessage} disabled={isLoading || !input.trim()}>Send</button>
      </div>
    </div>
  );
}
