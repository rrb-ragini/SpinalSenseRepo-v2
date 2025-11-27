"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPanel({ analysis }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // When X-ray analysis arrives → append to chat
  useEffect(() => {
    if (!analysis) return;

    const text = `## 📘 X-ray Analysis Result

**Cobb Angle:** ${analysis.cobb_angle ?? "N/A"}°

**Severity:** ${analysis.severity ?? "N/A"}

**Explanation:**  
${analysis.explanation ?? "N/A"}
`;

    setMessages((prev) => [...prev, { role: "assistant", content: text }]);

    // save to server memory
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: "spinal-user-123",
        saveHistory: true,
        messages: [{ role: "assistant", content: text }],
      }),
    });
  }, [analysis]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: "spinal-user-123",
        saveHistory: true,
        messages: [userMsg],
      }),
    });

    const json = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: json.message }]);
  };

  return (
    <div>
      <div className="mb-4 space-y-2 h-96 overflow-y-auto bg-white p-4 rounded">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`p-3 rounded-lg inline-block max-w-[85%] ${
                m.role === "assistant" ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 border p-2 rounded"
        />
        <button onClick={sendMessage} className="bg-primary text-white px-4 py-2 rounded">
          Send
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center px-6">
        By using SpinalSense, you agree to our&nbsp;
        <a 
          href="/terms" 
          className="underline text-blue-600 hover:text-blue-800"
          target="_blank"
        >
          Terms & Conditions
        </a>. <br />
        This assistant is for educational support only and does not provide medical advice, 
        diagnosis, or treatment. Always consult a licensed healthcare professional for 
        decisions regarding your spine and overall health.
      </p>

      
    </div>
  );
}
