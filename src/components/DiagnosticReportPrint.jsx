import React from 'react';
import { APP_TRANSLATIONS } from '../data/pathologyData';

export default function DiagnosticReportPrint({ result, lang }) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;

  if (!result) return null;

  return (
    <div className="print-only p-8 bg-white text-slate-900 font-sans max-w-4xl mx-auto">
      
      {/* Official Certificate Header */}
      <div className="border-b-2 border-violet-700 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-violet-900 uppercase tracking-tight">
            FloraGuard AI – Crop Pathology Diagnostic Certificate
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Automated Agricultural Vision & Field Pathology Advisory Protocol
          </p>
        </div>
        <div className="text-right text-xs font-mono">
          <p className="font-bold text-slate-900">CERT ID: {result.scanId || 'FLORA-SCAN-001'}</p>
          <p className="text-slate-600">{new Date(result.scannedAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Primary Diagnosis Summary Box */}
      <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded-lg p-4 mb-6 bg-slate-50">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Host Crop Species</span>
          <p className="text-base font-extrabold text-slate-900">
            {result.cropName.en} / {result.cropName.hi}
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Pathological Diagnosis</span>
          <p className="text-base font-extrabold text-violet-800">
            {result.diseaseName.en} ({result.scientificName})
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Severity Classification</span>
          <p className="text-sm font-bold uppercase text-slate-800">
            {result.severity.toUpperCase()} ({result.affectedAreaPct}% affected foliar surface)
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Neural Inference Confidence</span>
          <p className="text-sm font-mono font-bold text-violet-700">
            {result.confidence}% Match
          </p>
        </div>
      </div>

      {/* Symptoms & Pathogen Classification */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-2">
          Diagnostic Observations & Pathology
        </h3>
        <p className="text-xs text-slate-700 mb-2">
          <strong>Pathogen Class:</strong> {result.pathogenType.en} ({result.pathogenType.hi})
        </p>
        <p className="text-xs text-slate-700 mb-2">
          <strong>Prognosis:</strong> {result.prognosis.en}
        </p>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
          {result.symptoms.en.map((symp, i) => (
            <li key={i}>{symp}</li>
          ))}
        </ul>
      </div>

      {/* Organic & Biological Treatment Plan Table */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-800 border-b border-violet-200 pb-1 mb-2">
          Tier 1: Recommended Organic & Biological Interventions
        </h3>
        <table className="w-full text-xs text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-300 p-2 font-bold">Bio-Agent / Remedy</th>
              <th className="border border-slate-300 p-2 font-bold">Dosage & Dilution</th>
              <th className="border border-slate-300 p-2 font-bold">Application Schedule</th>
            </tr>
          </thead>
          <tbody>
            {result.organicRemedies?.map((rem, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="border border-slate-300 p-2 font-semibold">{rem.title.en}</td>
                <td className="border border-slate-300 p-2">{rem.dosage.en}</td>
                <td className="border border-slate-300 p-2">{rem.schedule.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chemical Interventions Table */}
      <div className="mb-6">
        <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 ${
          result.severity === 'none' ? 'text-violet-800 border-violet-200' : 'text-amber-800 border-amber-200'
        }`}>
          {result.severity === 'none'
            ? 'Tier 2: Recommended Foliar Micronutrient & Plant Maintenance Care'
            : 'Tier 2: Recommended Chemical Fungicides & Dosage'}
        </h3>
        <table className="w-full text-xs text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-300 p-2 font-bold">Active Chemical Salt</th>
              <th className="border border-slate-300 p-2 font-bold">Trade Formulations</th>
              <th className="border border-slate-300 p-2 font-bold">Dosage / Acre</th>
              <th className="border border-slate-300 p-2 font-bold">Pre-Harvest Interval (PHI)</th>
            </tr>
          </thead>
          <tbody>
            {(result.chemicalTreatments || result.chemicalInterventions || []).map((chem, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="border border-slate-300 p-2 font-semibold">{chem.salt}</td>
                <td className="border border-slate-300 p-2 font-mono">{chem.tradeName || 'Standard Formulation'}</td>
                <td className="border border-slate-300 p-2">{chem.dosage?.en || chem.dosage}</td>
                <td className="border border-slate-300 p-2 font-medium text-red-700">{chem.safetyWaitingPeriod?.en || chem.safetyWaitingPeriod || '7 days'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preventive Guidelines */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-200 pb-1 mb-2">
          Tier 3: Cultural & Soil Preventive Management
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
          {result.preventiveAdvisory?.map((adv, i) => (
            <div key={i} className="border border-slate-200 rounded p-2 bg-slate-50">
              <span className="font-bold block text-slate-900 mb-0.5">{adv.category.en}:</span>
              <span>{adv.action.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer & Signature Line */}
      <div className="border-t-2 border-slate-300 pt-4 mt-8 flex justify-between items-end text-[10px] text-slate-500">
        <div>
          <p>Verified through FloraGuard AI Client Vision Pathology Engine v2.4.</p>
          <p className="mt-1">{t.disclaimer}</p>
        </div>
        <div className="text-center w-48 border-t border-slate-400 pt-1">
          <p className="font-bold text-slate-800">Agricultural Extension Officer</p>
          <p className="text-[9px]">Official Field Stamp</p>
        </div>
      </div>

    </div>
  );
}
