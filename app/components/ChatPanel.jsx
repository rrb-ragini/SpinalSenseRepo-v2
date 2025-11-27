"use client";

import { useState, useEffect } from "react";

export default function ChatPanel({ analysis, history, setHistory }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ When X-ray analysis arrives, show it AND save it to chat memory
  useEffect(() => {
    if (!analysis) return;

    const text = `📘 X-ray Analysis Result
Cobb Angle: ${analysis.cobb_angle ?? "N/A"}°
Severity: ${analysis.severity ?? "N/A"}
Explanation: ${analysis.explanation ?? "N/A"}`;

    // update UI
    setHistory((prev) => [...prev, { role: "assistant", content: text }]);

    // update backend memory
    (async () => {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "spinal-user-123",
          saveHistory: true,
          messages: [{ role: "assistant", content: text }]
        })
      });
    })();
  }, [analysis]);

  const send = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };
    setHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "spinal-user-123",
          saveHistory: true,

          // ⭐ send full history for perfect memory
          messages: [...history, userMsg]
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: "Chat error: " + json.error }
        ]);
        setLoading(false);
        return;
      }

      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: json.message }
      ]);

    } catch (err) {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Chat failed: " + err.message }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="space-y-2 mb-4 h-80 overflow-y-auto bg-white p-4 rounded">
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
