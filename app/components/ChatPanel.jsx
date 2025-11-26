"use client";
import ChatMessage from "./ChatMessage";
import { useState, useEffect, useRef } from "react";

export default function ChatPanel({ analysis }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! Upload an X-ray to begin." }
  ]);

  const [text, setText] = useState("");
  const chatRef = useRef();

  useEffect(() => {
    if (analysis) {
      setMessages(m => [
        ...m,
        { 
          role: "assistant", 
          content: `Cobb angle detected: ${analysis.cobb_angle}°.\n${analysis.explanation ?? ""}` 
        }
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const json = await res.json();
    setMessages(m => [...m, json.assistant]);

    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
    }, 100);
  };

  return (
    <div className="card p-4 mt-4 chat-window">
      <div ref={chatRef} className="chat-history">
        {messages.map((m, i) => <ChatMessage key={i} msg={m} />)}
      </div>

      <div className="chat-input">
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-3 rounded-md"
          placeholder="Ask about exercises, posture, lifestyle..."
        />
        <button onClick={send} className="px-4 py-2 border rounded-md">
          Send
        </button>
      </div>
    </div>
  );
}
