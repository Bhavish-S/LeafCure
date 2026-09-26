import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, UploadCloud, Leaf, Activity, Globe, Shield, ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl">
              <Leaf className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              FloraGuard
            </span>
          </div>
          <button 
            onClick={handleGetStarted}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition-colors text-sm"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Dual-Engine AI Diagnostic System</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
            Your AI Agronomist, <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              In Your Pocket.
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Instantly diagnose crop diseases using local pixel-heuristics and advanced deep learning. Get actionable treatment plans in English, Hindi, or Kannada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-lg font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
            >
              Start Scanning For Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Built for the Field</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Designed to work where you need it most, with or without a fast connection.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="w-6 h-6" />,
                title: 'Dual-Engine AI',
                desc: 'Combines blazing-fast local heuristics with deep pathological analysis via Google Gemini.'
              },
              {
                icon: <UploadCloud className="w-6 h-6" />,
                title: 'Offline-First PWA',
                desc: 'Install directly to your homescreen. The core app shell loads instantly even in low-bandwidth areas.'
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Hyper-Localized',
                desc: 'Full native support for English, Hindi, and Kannada, built specifically for regional farmers.'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Visual Explainability',
                desc: 'Grad-CAM style heatmaps show you exactly where the AI detected the chlorosis and necrosis.'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Treatment Marketplace',
                desc: 'Not just a diagnosis—get exact chemical and organic treatment plans mapped to clinical protocols.'
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Batch Analysis',
                desc: 'Upload up to 10 leaf photos from a single field walk to get an aggregate severity report instantly.'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 text-center text-slate-500">
        <p>© {new Date().getFullYear()} FloraGuard (AgriCure-AI). Built for global food security.</p>
      </footer>
    </div>
  );
}
