"use client";

import Link from "next/link";
import { MoveRight, Activity, ShieldCheck, FileText, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 blur-[120px] rounded-full"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI-Powered Scoliosis Analysis
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Precise Spinal Insights <br />
            <span className="gradient-text">Powered by AI</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            SpinalSense uses advanced computer vision to analyze X-rays and calculate Cobb angles with clinical-grade accuracy. Empowering patients and doctors with instant, reliable data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app/home"
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
            >
              Start Free Analysis
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 rounded-2xl font-semibold text-lg hover:bg-white transition-all hover:border-slate-300"
            >
              Doctor Login
            </Link>
          </div>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="md:col-span-2 glass-card p-8 rounded-3xl animate-fade-in [animation-delay:200ms]">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Real-time Cobb Angle Detection</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Our AI automatically identifies the apical and end-vertebrae to provide an instant Cobb angle measurement, reducing human error in scoliosis screening.
            </p>
            <div className="h-48 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl relative overflow-hidden border border-indigo-100/50">
              {/* Mock Visualizer */}
              <div className="absolute inset-x-8 inset-y-8 border-2 border-dashed border-indigo-200 rounded-lg flex items-center justify-center">
                <div className="text-indigo-400 font-mono text-sm">Processing X-Ray Matrix...</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl animate-fade-in [animation-delay:400ms]">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Clinical Grade Accuracy</h3>
            <p className="text-slate-600 leading-relaxed">
              Validated against gold-standard manual measurements with a mean absolute error of less than 3 degrees.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl animate-fade-in [animation-delay:600ms]">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Reports</h3>
            <p className="text-slate-600 leading-relaxed">
              Generate clinical-ready summaries for your orthopedic consultations in one click.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl animate-fade-in [animation-delay:800ms] md:col-span-2">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Instant Progress Tracking</h3>
                <p className="text-slate-600 leading-relaxed">
                  Monitor curve progression over years with interactive trend charts. Visualize the effectiveness of bracing or therapy.
                </p>
              </div>
              <div className="flex gap-2">
                {[42, 38, 35, 30].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className="w-8 bg-indigo-500 rounded-t-lg transition-all hover:scale-105"
                      style={{ height: `${h * 2}px` }}
                    ></div>
                    <span className="text-[10px] text-slate-400 font-medium">'2{i + 2}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-card p-12 rounded-[40px] text-center bg-indigo-900 border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to see your spine clearly?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of patients taking control of their spinal health with the most advanced AI screening tool available.
            </p>
            <Link
              href="/app/home"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all shadow-xl"
            >
              Upload Your X-Ray Now
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-12 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl">
            SpinalSense
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 SpinalSense AI. For educational use in PM classes.
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-600">
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
