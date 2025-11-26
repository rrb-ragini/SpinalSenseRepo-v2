"use client";
import ChatMessage from "./ChatMessage";
import { useState, useRef, useEffect } from "react";

export default function ChatPanel({ analysis }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! Upload an X-ray to begin." }
  ]);

  const [text, setText] = useState("");
  const ref = useRef();

  useEffect(() => {
    if (analysis) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Cobb angle detected: ${analysis.cobb_angle}°\n${analysis.explanation ?? ""}` }
      ]);
    }
  }, [analysis]);

  const send = async () => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setText("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const json = await res.json();
    const assistant = json.assistant;

    setMessages((m) => [...m, assistant]);
    setTimeout(() => ref.current?.scrollTo({ top: ref.current.scrollHeight }), 200);
  };

  return (
    <div className="chat-window card p-4 mt-4">
      <div ref={ref} className="chat-history">
        {messages.map((m, i) => <ChatMessage key={i} msg={m} />)}
      </div>

      <div className="chat-input">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-3 rounded-md"
          placeholder="Ask about exercises or your spine health..."
        />
        <button className="px-4 py-2 border rounded-md" onClick={send}>Send</button>
      </div>
    </div>
  );
}
