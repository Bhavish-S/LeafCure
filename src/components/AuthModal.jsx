import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Mail, Globe } from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';

export default function AuthModal({ isOpen, onClose, lang }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;

  if (!isOpen) return null;

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{t.authTitle}</h2>
          <p className="text-slate-400 text-sm">{t.authSubtitle}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
          >
            <Globe className="w-5 h-5" />
            {t.googleLogin}
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase">OR</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              <Mail className="w-5 h-5" />
              {t.emailLogin}
            </button>
          </form>

          {status === 'success' && (
            <p className="text-green-400 text-sm text-center mt-4">{t.authSuccess}</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm text-center mt-4">{t.authError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
