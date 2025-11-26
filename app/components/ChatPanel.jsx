"use client";
import ChatMessage from "./ChatMessage";
import { useState, useEffect, useRef } from "react";

export default function ChatPanel({ analysis }) {
  const [messages, setMessages] = useState(() => [
    { role: "assistant", content: `Hi! Upload an X-ray to get started.` },
  ]);
  const [text, setText] = useState("");
  const boxRef = useRef();

  useEffect(() => {
    if (analysis) {
      // Push analysis to chat
      setMessages((m) => [...m, { role: "assistant", content: `Analysis result: Cobb angle ${analysis.cobb_angle ?? "N/A"}°` }]);
      // optionally add overlay link
    }
  }, [analysis]);

  const send = async () => {
    if (!text.trim()) return;
    const msg = { role: "user", content: text };
    setMessages((m) => [...m, msg]);
    setText("");

    // demo bot reply
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: "Thanks — here are recommended exercises: core strengthening, hamstring stretches, and postural training." }]);
      boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
    }, 700);
  };

  return (
    <div className="card p-4 mt-4 chat-window">
      <div ref={boxRef} className="chat-history">
        {messages.map((m, i) => <ChatMessage key={i} msg={m} />)}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about exercises, lifestyle or your result..."
          className="flex-1 p-3 rounded-md border bg-white"
        />
        <button onClick={send} className="px-4 py-2 rounded bg-white text-primary-500 border">Send</button>
      </div>
    </div>
  );
}
