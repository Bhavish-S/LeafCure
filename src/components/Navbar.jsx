import React from 'react';
import { Sprout, Activity, Globe, History, RefreshCw } from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';

export default function Navbar({ lang, setLang, onNewScan, onScrollToHistory, historyCount }) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-lg shadow-black/20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewScan}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-teal-700 shadow-md shadow-violet-500/20 ring-1 ring-violet-400/40">
            <Sprout className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                FloraGuard <span className="text-violet-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Engine Status Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-medium tracking-wide">
          <Activity className="w-3.5 h-3.5 animate-pulse text-violet-400" />
          <span>{t.engineBadge}</span>
        </div>

        {/* Right Navigation & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* New Scan Action */}
          <button
            onClick={onNewScan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/90 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm shadow-violet-600/30 active:scale-95"
            title={t.navNewScan}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.navNewScan}</span>
          </button>

          {/* Saved History Anchor */}
          <button
            onClick={onScrollToHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 text-slate-200 text-xs sm:text-sm font-medium transition-all duration-200 border border-slate-700 active:scale-95"
            title={t.navSaved}
          >
            <History className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">{t.navSaved}</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-violet-500 text-slate-950">
                {historyCount}
              </span>
            )}
          </button>

          {/* Language Switcher Button */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-violet-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                lang === 'hi'
                  ? 'bg-violet-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
