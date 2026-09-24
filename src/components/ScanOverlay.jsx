import React from 'react';
import { Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';

export default function ScanOverlay({ logs, currentProgress, imagePreview, lang }) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel-glow p-4 sm:p-6 border border-emerald-500/40 my-6 animate-fadeIn">
      
      {/* Title & Live Status Indicator */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
          <Cpu className="w-5 h-5 animate-pulse" />
          <span>{t.scanningTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-emerald-400 tracking-wider">
            PROCESSING {currentProgress}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Visual Scanning Frame with Laser Line */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-slate-950 shadow-2xl flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Scanning leaf"
                className="w-full h-full object-cover filter contrast-105"
              />
            ) : (
              <div className="text-slate-500 text-xs font-mono">Loading matrix...</div>
            )}

            {/* Glowing Laser Scan-Line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-laser pointer-events-none"></div>

            {/* Futuristic Corner Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400 pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400 pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400 pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400 pointer-events-none"></div>

            {/* Center Grid Matrix Simulation */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
          </div>
        </div>

        {/* Real-time Telemetry Terminal Logs */}
        <div className="lg:col-span-7 flex flex-col h-full justify-between">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs shadow-inner min-h-[220px] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] uppercase tracking-wider text-slate-300">Neural Pathology Telemetry Stream</span>
            </div>

            {/* Log Lines */}
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 animate-fadeIn">
                  <span className="text-emerald-500 select-none">›</span>
                  <span className={index === logs.length - 1 ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                    {log.text}
                  </span>
                </div>
              ))}
              {logs.length < 5 && (
                <div className="flex items-center gap-2 text-slate-600 animate-pulse">
                  <span className="text-emerald-600 select-none">›</span>
                  <span>Executing pipeline step {logs.length + 1}...</span>
                </div>
              )}
            </div>

            {/* Mini Progress Status Bar */}
            <div className="mt-4 pt-3 border-t border-slate-900">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
