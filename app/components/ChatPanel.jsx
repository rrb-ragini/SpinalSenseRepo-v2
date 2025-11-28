
"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPanel({ analysis }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, how can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

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
    setIsThinking(true);

    try {
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
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3">
        <img
          src="/spine-avatar.jpg"
          alt="AI Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold text-gray-800">Ortho Assistant</h3>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <img
              src={m.role === "user" ? "/user-avatar.png" : "/spine-avatar.jpg"}
              alt={m.role === "user" ? "User" : "AI"}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />

            {/* Bubble */}
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${m.role === "user"
                ? "bg-indigo-600 text-white rounded-tr-none"
                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  a: ({ node, ...props }) => <a className="underline hover:text-blue-300" {...props} />,
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-3">
            <img
              src="/spine-avatar.jpg"
              alt="AI"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="bg-white text-gray-800 border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 ml-0.5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>

        <p className="text-[10px] text-gray-400 mt-2 text-center">
          AI can make mistakes. Please consult a doctor.
          <br />
          <a
            href="/terms"
            className="text-blue-500 hover:text-blue-700 underline"
            target="_blank"
          >
            Terms & Conditions
          </a>
        </p>
      </div>
    </div>
  );
}
