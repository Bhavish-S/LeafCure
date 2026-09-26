import React, { useState } from 'react';
import { 
  Leaf, 
  FlaskConical, 
  ShieldCheck, 
  Printer, 
  Clock, 
  Scale, 
  Info, 
  AlertCircle,
  CalendarCheck2,
  CheckCircle2,
  Droplets,
  ShoppingCart
} from 'lucide-react';
import { APP_TRANSLATIONS, CLINICAL_CHEMICAL_TREATMENTS, HEALTHY_MAINTENANCE_TREATMENTS, CROP_DISEASE_DATASET } from '../data/pathologyData';

export default function TreatmentTabs({ result, lang = 'en', onPrintReport }) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState('organic'); // 'organic' | 'chemical' | 'preventive'

  const activeResult = result || CROP_DISEASE_DATASET[0];
  const isHealthyCrop = activeResult.severity === 'none' || activeResult.isHealthy;

  // For healthy crops: show general plant maintenance & foliar nutrition instead of chemical fungicides
  // For infected crops: show the 3 clinical remedy cards (Mancozeb, Copper Oxychloride, Azoxystrobin)
  const chemicalList = isHealthyCrop
    ? (activeResult.chemicalTreatments || activeResult.chemicalInterventions || HEALTHY_MAINTENANCE_TREATMENTS)
    : (activeResult.chemicalTreatments || activeResult.chemicalInterventions || CLINICAL_CHEMICAL_TREATMENTS);

  return (
    <div className="w-full my-8 space-y-6">
      
      {/* Tab Navigation Header & Print Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        
        {/* Tabs switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('organic')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'organic'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Leaf className="w-4 h-4 text-violet-300" />
            <span>{t.tabOrganic}</span>
          </button>

          <button
            onClick={() => setActiveTab('chemical')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'chemical'
                ? (isHealthyCrop ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' : 'bg-amber-600 text-white shadow-md shadow-amber-600/30')
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FlaskConical className={`w-4 h-4 ${isHealthyCrop ? 'text-violet-300' : 'text-amber-300'}`} />
            <span>{isHealthyCrop ? (lang === 'hi' ? 'पोषक तत्व एवं रखरखाव' : 'Foliar Nutrition & Care') : t.tabChemical}</span>
          </button>

          <button
            onClick={() => setActiveTab('preventive')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'preventive'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>{t.tabPreventive}</span>
          </button>
        </div>

        {/* Action Button: Print / Save Web Diagnostic Report */}
        <button
          onClick={onPrintReport}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-violet-400 hover:text-violet-300 text-xs sm:text-sm font-bold border border-violet-500/40 shadow-lg shadow-violet-950/40 transition-all active:scale-95 shrink-0"
        >
          <Printer className="w-4 h-4 text-violet-400" />
          <span>{t.btnPrintReport}</span>
        </button>

      </div>

      {/* Tab 1: Organic & Bio-Remedies */}
      {activeTab === 'organic' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {activeResult.organicRemedies?.map((remedy, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 p-5 flex flex-col justify-between transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-violet-950 border border-violet-700/50 flex items-center justify-center text-violet-400 font-bold text-xs">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-900/60 text-violet-300 border border-violet-700/50 uppercase tracking-wider">
                    Bio-Agent
                  </span>
                </div>

                <h4 className="font-bold text-white text-base mb-2">
                  {remedy.title[lang] || remedy.title.en}
                </h4>

                <div className="space-y-2 text-xs pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1 mb-1">
                      <Droplets className="w-3 h-3 text-violet-400" />
                      Dosage & Dilution:
                    </span>
                    <p className="text-slate-200 font-medium">
                      {remedy.dosage[lang] || remedy.dosage.en}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1 mb-1">
                      <CalendarCheck2 className="w-3 h-3 text-teal-400" />
                      Application Schedule:
                    </span>
                    <p className="text-slate-200">
                      {remedy.schedule[lang] || remedy.schedule.en}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 italic">
                {remedy.mechanism[lang] || remedy.mechanism.en}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Chemical Interventions / Foliar Nutrition */}
      {activeTab === 'chemical' && (
        <div className="space-y-6 animate-fadeIn">
          {isHealthyCrop ? (
            <div className="p-4 rounded-xl bg-violet-950/50 border border-violet-500/50 text-violet-300 text-xs flex items-center gap-2.5 shadow-md">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-violet-400" />
              <span className="leading-relaxed font-medium">
                {t.healthyFungicideNotice || 'Status: Foliage is completely healthy. Chemical fungicides are NOT recommended or required. Displaying preventive micronutrient and foliar maintenance guidelines.'}
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs flex items-center gap-2.5 shadow-md">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="leading-relaxed">
                <strong>Clinical Protocol:</strong> Always adhere to recommended mixing dosages, wear rubber gloves and protective eyewear, and avoid foliar spraying during intense mid-day heat.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chemicalList.map((chem, idx) => (
              <div
                key={idx}
                className={`rounded-2xl bg-slate-900/90 border p-5 flex flex-col justify-between transition-all duration-300 shadow-xl group ${
                  isHealthyCrop
                    ? 'border-slate-800 hover:border-violet-500/50 hover:shadow-violet-500/10'
                    : 'border-slate-800 hover:border-amber-500/50 hover:shadow-amber-500/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shadow-inner ${
                      isHealthyCrop
                        ? 'bg-violet-950 border-violet-700/50 text-violet-400'
                        : 'bg-amber-950 border-amber-700/50 text-amber-400'
                    }`}>
                      0{idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      isHealthyCrop
                        ? 'bg-violet-950/80 text-violet-300 border-violet-700/60'
                        : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                    }`}>
                      {chem.category?.[lang] || chem.category?.en || (isHealthyCrop ? 'Foliar Care' : 'Clinical Fungicide')}
                    </span>
                  </div>

                  <h4 className={`font-extrabold text-white text-base mb-1 transition-colors ${
                    isHealthyCrop ? 'group-hover:text-violet-300' : 'group-hover:text-amber-300'
                  }`}>
                    {chem.salt}
                  </h4>
                  {chem.tradeName && (
                    <p className={`text-xs font-mono mb-2 ${
                      isHealthyCrop ? 'text-violet-400/90' : 'text-amber-400/90'
                    }`}>
                      Trade: {chem.tradeName}
                    </p>
                  )}

                  <div className="space-y-2 text-xs pt-2">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1 mb-1">
                        <Scale className={`w-3 h-3 ${isHealthyCrop ? 'text-violet-400' : 'text-amber-400'}`} />
                        Recommended Dosage:
                      </span>
                      <p className="text-slate-100 font-bold">
                        {chem.dosage?.[lang] || chem.dosage?.en || chem.dosage}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1 mb-1">
                        <CalendarCheck2 className="w-3 h-3 text-teal-400" />
                        Application Schedule:
                      </span>
                      <p className="text-slate-200">
                        {chem.schedule?.[lang] || chem.schedule?.en || chem.timing?.[lang] || chem.timing?.en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    {chem.timing?.[lang] || chem.timing?.en || chem.mechanism?.[lang] || chem.mechanism?.en}
                  </span>
                  {chem.safetyWaitingPeriod && (
                    <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ml-2 shrink-0 ${
                      isHealthyCrop
                        ? 'text-violet-400 bg-violet-950/60 border-violet-700/40'
                        : 'text-amber-400 bg-amber-950/60 border-amber-700/40'
                    }`}>
                      PHI: {chem.safetyWaitingPeriod?.[lang] || chem.safetyWaitingPeriod?.en || chem.safetyWaitingPeriod}
                    </span>
                  )}
                </div>

                {/* Marketplace Integration */}
                <a 
                  href={`https://www.amazon.in/s?k=${encodeURIComponent((chem.tradeName || chem.salt) + ' agricultural fungicide fertilizer')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all duration-200 border shadow-sm ${
                    isHealthyCrop 
                      ? 'bg-violet-950/40 text-violet-300 border-violet-800/50 hover:bg-violet-900/60 hover:border-violet-600/50 hover:shadow-violet-900/50' 
                      : 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/60 hover:border-amber-600/50 hover:shadow-amber-900/50'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {lang === 'hi' ? 'अमेज़न पर खोजें' : (lang === 'kn' ? 'ಅಮೆಜಾನ್ ನಲ್ಲಿ ಹುಡುಕಿ' : 'Find on Amazon')}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Cultural & Preventive Advisory */}
      {activeTab === 'preventive' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {activeResult.preventiveAdvisory?.map((adv, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 p-5 flex flex-col justify-between transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-700/50 flex items-center justify-center text-teal-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-teal-300 text-sm sm:text-base">
                    {adv.category[lang] || adv.category.en}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-2">
                  {adv.action[lang] || adv.action.en}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Long-term cultural prophylaxis practice
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
