import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Dna, 
  Activity, 
  Percent, 
  HeartPulse, 
  Share2, 
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';
import LeafCanvasInspector from './LeafCanvasInspector';
import { APP_TRANSLATIONS, CROP_DISEASE_DATASET } from '../data/pathologyData';

export default function DiagnosticDashboard({ 
  result, 
  lang = 'en', 
  onPrintReport 
}) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;
  const activeResult = result || CROP_DISEASE_DATASET[0];

  const isHealthy = activeResult.severity === 'none';
  const isSevere = activeResult.severity === 'severe';
  const isModerate = activeResult.severity === 'moderate';

  const severityColorClass = isSevere
    ? 'bg-red-950/80 text-red-400 border-red-700/80'
    : isModerate
    ? 'bg-amber-950/80 text-amber-400 border-amber-700/80'
    : 'bg-violet-950/80 text-violet-400 border-violet-700/80';

  const severityDotClass = isSevere
    ? 'bg-red-500'
    : isModerate
    ? 'bg-amber-500'
    : 'bg-violet-500';

  const confidenceScore = activeResult.confidence || 95.0;

  return (
    <div className="w-full my-8 space-y-6 animate-fadeIn">
      
      {/* Top Main Diagnosis Card */}
      <div className="relative rounded-3xl glass-panel-glow p-6 sm:p-8 border border-violet-500/30 overflow-hidden shadow-2xl">
        
        {/* Background accent ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Top Tag Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700">
                {activeResult.cropName[lang] || activeResult.cropName.en}
              </span>

              {/* Severity Level Badge */}
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md ${severityColorClass}`}>
                <span className={`w-2 h-2 rounded-full ${severityDotClass} animate-pulse`}></span>
                <span>{t.severityLabel}: {t[activeResult.severity] || activeResult.severity}</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-mono bg-violet-950/60 text-violet-400 border border-violet-500/30">
                ID: {activeResult.scanId || 'FLORA-SCAN'}
              </span>
            </div>

            {/* Disease Heading */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {activeResult.diseaseName[lang] || activeResult.diseaseName.en}
              </h2>
              <p className="text-sm sm:text-base text-violet-400/90 italic font-mono mt-1">
                {activeResult.scientificName}
              </p>
            </div>

            {/* Pathogen and Prognosis Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-start gap-3">
                <Dna className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                    {t.pathogenTypeLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {activeResult.pathogenType[lang] || activeResult.pathogenType.en}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 flex items-start gap-3">
                <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                    {t.affectedAreaLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {activeResult.affectedAreaPct}% of foliar surface
                  </span>
                </div>
              </div>
            </div>

            {/* Prognosis Alert Banner */}
            <div className="rounded-xl bg-slate-950/70 border border-slate-800/90 p-4 flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-200 block mb-0.5">
                  {t.prognosisLabel}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeResult.prognosis[lang] || activeResult.prognosis.en}
                </p>
              </div>
            </div>

          </div>

          {/* Right column: Dynamic Confidence Gauge Meter */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner">
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Circular SVG Gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(51, 65, 85, 0.4)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={isSevere ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981'}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * confidenceScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {confidenceScore}%
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                  Confidence
                </span>
              </div>
            </div>

            <div className="text-center mt-3">
              <span className="text-xs font-semibold text-violet-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deep Pathology Heuristic Match</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Multi-spectral leaf geometry calibrated
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Visual Leaf Inspector Canvas Engine */}
      <LeafCanvasInspector
        imageUrl={activeResult.imageUrl || activeResult.sampleImage}
        lesions={activeResult.lesions || []}
        diseaseName={activeResult.diseaseName[lang] || activeResult.diseaseName.en}
        severity={activeResult.severity}
        lang={lang}
      />

    </div>
  );
}
