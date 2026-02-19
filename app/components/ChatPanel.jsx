"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, FileText, Download, CheckCircle2, AlertCircle } from "lucide-react";

export default function ChatPanel({ analysis }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your SpinalSense AI Assistant. Please upload an X-ray so I can analyze it for you." },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // When X-ray analysis arrives → append to chat
  useEffect(() => {
    if (!analysis) return;

    const text = `## 📘 Clinical Analysis Report
Determined by SpinalSense AI Vision Engine

- **Cobb Angle:** ${analysis.cobb_angle ?? "N/A"}°
- **Clinical Severity:** ${analysis.severity?.toUpperCase() ?? "N/A"}
- **Verification Status:** AI-Calculated 

### Diagnostic Explanation
${analysis.explanation ?? "No additional details provided."}

---
*Disclaimer: This analysis is for educational purposes and should be verified by a licensed orthopedic surgeon.*
`;

    setMessages((prev) => [...prev, { role: "assistant", content: text }]);
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
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting to my spinal knowledge base. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">Ortho Assistant</h3>
            <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Vision Engine Active
            </p>
          </div>
        </div>

        {analysis && (
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            style={{ animation: 'slideUp 0.4s ease-out forwards' }}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-slate-900' : 'bg-white border border-slate-200'
              }`}>
              {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-indigo-600" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] p-4 rounded-3xl shadow-sm leading-relaxed border ${m.role === "user"
                  ? "bg-indigo-600 text-white border-transparent rounded-tr-none"
                  : "bg-white text-slate-700 border-slate-100 rounded-tl-none font-medium text-[15px]"
                }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="markdown-content"
                components={{
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-4 flex items-center gap-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-3 space-y-1" {...props} />,
                  li: ({ node, ...props }) => <li className="text-sm" {...props} />,
                  hr: () => <hr className="my-4 border-slate-100" />,
                  strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white border-t border-slate-100">
        <div className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your results..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="absolute right-2 top-2 w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95 group-hover:translate-x-[-2px]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            Educational Use Only
          </p>
          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
          <a href="/terms" target="_blank" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-widest">
            Privacy Policy
          </a>
        </div>
      </div>

      {/* Report Modal Mockup */}
      {showReport && (
        <div className="absolute inset-0 z-50 bg-white p-8 flex flex-col animate-fade-in overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2 font-bold text-indigo-600">
              <Bot className="w-5 h-5" />
              SpinalSense Clinical Export
            </div>
            <button
              onClick={() => setShowReport(false)}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
            >
              <AlertCircle className="w-6 h-6 rotate-45" />
            </button>
          </div>

          <div className="max-w-xl mx-auto w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Clinical Assessment</h2>
              <p className="text-slate-500 font-medium">Patient ID: #SP-8829 | {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Cobb Angle</p>
                <p className="text-3xl font-bold text-indigo-600">{analysis.cobb_angle ?? "N/A"}°</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Severity</p>
                <p className="text-3xl font-bold text-emerald-600">{analysis.severity ?? "N/A"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                AI Vision Findings
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                {analysis.explanation}
              </p>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
              <Download className="w-6 h-6" />
              Download Clinical PDF
            </button>
            <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed">
              This report contains sensitive medical data. Under HIPAA and GDPR regulations,
              ensure secure transmission if sharing with medical professionals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
