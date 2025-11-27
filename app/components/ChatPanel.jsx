"use client";

import { useState } from "react";

export default function ChatPanel({ history, setHistory }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };
    setHistory([...history, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "spinal-user-123",
          saveHistory: true,
          messages: [...history, userMsg]   // FULL HISTORY
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setHistory(prev => [
          ...prev,
          { role: "assistant", content: "Chat error: " + json.error }
        ]);
        setLoading(false);
        return;
      }

      setHistory(prev => [
        ...prev,
        { role: "assistant", content: json.message }
      ]);

    } catch (err) {
      setHistory(prev => [
        ...prev,
        { role: "assistant", content: "Chat failed: " + String(err) }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="space-y-2 mb-4">
        {history.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className="block p-2 bg-gray-100 rounded whitespace-pre-wrap">
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
