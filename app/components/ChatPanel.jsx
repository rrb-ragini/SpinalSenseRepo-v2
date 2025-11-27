"use client";

import { useState, useEffect } from "react";

export default function ChatPanel({ analysis }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🔥 When X-ray analysis arrives: show it + store it in server memory
  useEffect(() => {
    if (!analysis) return;

    const text = `📘 X-ray Analysis Result
Cobb Angle: ${analysis.cobb_angle ?? "N/A"}°
Severity: ${analysis.severity ?? "N/A"}
Explanation: ${analysis.explanation ?? "N/A"}`;

    // Show visually in chat
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: text }
    ]);

    // Save into backend memory (MUST be awaited inside async IIFE)
    (async () => {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "spinal-user-123",
          saveHistory: true,
          messages: [
            {
              role: "assistant",
              content: text
            }
          ]
        })
      });
    })();
  }, [analysis]);

  // 🔥 Send user message to chat backend with memory enabled
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "spinal-user-123",
          saveHistory: true,
          messages: [userMsg]    // ONLY send the newest user message
        })
      });

      const json = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Chat error: " + json.error }
        ]);
        return;
      }

      // Show assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.message }   // correct field
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Request failed: " + err.message }
      ]);
    }
  };

  return (
    <div>
      {/* Chat history window */}
      <div className="mb-4 space-y-2 h-64 overflow-y-auto bg-white p-4 rounded">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <span className="block p-2 bg-gray-100 rounded whitespace-pre-wrap">
              {m.content}
            </span>
          </div>
        ))}
      </div>

      {/* Message input area */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
