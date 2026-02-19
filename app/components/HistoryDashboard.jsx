"use client";

import { TrendingDown, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function HistoryDashboard() {
    const mockHistory = [
        { date: "Oct 2024", angle: 12.5, status: "Mild", trend: "stable" },
        { date: "Jan 2025", angle: 14.2, status: "Mild", trend: "up" },
        { date: "May 2025", angle: 13.8, status: "Mild", trend: "down" },
        { date: "Aug 2025", angle: 13.1, status: "Mild", trend: "down" },
    ];

    return (
        <div className="glass-card rounded-3xl p-6 h-full border border-indigo-100/50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Spinal History</h3>
                    <p className="text-sm text-slate-500">Cobb angle progression over 12 months</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    <TrendingDown className="w-3 h-3" />
                    -1.1° Trend
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
                {mockHistory.map((item, idx) => (
                    <div
                        key={idx}
                        className="group flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-slate-100 hover:border-indigo-200 transition-all hover:translate-x-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{item.date}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase ${item.status === 'Mild' ? 'text-emerald-600' : 'text-amber-600'
                                        }`}>{item.status}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="text-xs text-slate-500">Clinical Verification</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">{item.angle}°</p>
                            <p className={`text-[10px] font-bold flex items-center justify-end gap-1 ${item.trend === 'down' ? 'text-emerald-600' : 'text-amber-600'
                                }`}>
                                {item.trend === 'down' ? 'Improvement' : 'Progression'}
                                <ArrowUpRight className={`w-3 h-3 ${item.trend === 'down' ? 'rotate-90' : ''}`} />
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
                <h4 className="font-bold mb-1 flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Insight from AI Assistant
                </h4>
                <p className="text-xs text-indigo-100 leading-relaxed">
                    Your spinal curvature has improved significantly since January. The current exercise protocol is showing positive results in Cobb angle reduction.
                </p>
            </div>
        </div>
    );
}
