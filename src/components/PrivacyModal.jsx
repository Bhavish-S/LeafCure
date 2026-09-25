import React from 'react';
import { Shield, X, AlertTriangle, Lock } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 text-slate-300 text-sm">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Shield className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Privacy Policy & Terms of Use</h2>
          </div>

          <div className="space-y-4">
            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Medical & Agronomic Disclaimer
              </h3>
              <p>
                FloraGuard AI is an experimental AI-assisted diagnostic tool designed for educational and preliminary agricultural analysis. 
                <strong> It is NOT a substitute for professional agronomic advice, certified crop advisors, or laboratory testing.</strong> 
                The AI may produce inaccurate, incomplete, or misleading results (hallucinations). Always verify chemical treatment dosages 
                and safety guidelines with local agricultural authorities before application.
              </p>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-200 mb-2">
                <Lock className="w-4 h-4 text-teal-400" />
                Data Collection & Privacy
              </h3>
              <p className="mb-2">We respect your privacy and strive to collect only what is necessary for the app to function:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Anonymous Users:</strong> All scan history is stored locally on your device (in localStorage). Images are processed ephemerally via secure API calls and are not stored on our servers.</li>
                <li><strong>Registered Users:</strong> If you choose to log in, we store your email address for authentication. Your scan history and plant profiles are securely stored in our Supabase database to provide cloud synchronization across your devices.</li>
                <li><strong>AI Processing:</strong> Images and symptom descriptions you provide are sent to Google's Gemini API for inference. Please do not upload images containing personally identifiable information.</li>
              </ul>
            </section>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <button 
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
