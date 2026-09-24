import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import LeafUploadZone from './components/LeafUploadZone';
import ScanOverlay from './components/ScanOverlay';
import DiagnosticDashboard from './components/DiagnosticDashboard';
import TreatmentTabs from './components/TreatmentTabs';
import ScanHistory from './components/ScanHistory';
import CameraModal from './components/CameraModal';
import DiagnosticReportPrint from './components/DiagnosticReportPrint';
import { runPathologyInference } from './services/inferenceEngine';
import { APP_TRANSLATIONS, CROP_DISEASE_DATASET, CLINICAL_CHEMICAL_TREATMENTS } from './data/pathologyData';
import { Target, UploadCloud, History } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'agricure_ai_diagnoses_v2';

function App() {
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [activeTab, setActiveTab] = useState('diagnosis'); // 'diagnosis' | 'upload' | 'history'
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [currentImage, setCurrentImage] = useState(() => CROP_DISEASE_DATASET[0]?.sampleImage || null);
  const [activeDiagnosis, setActiveDiagnosis] = useState(() => {
    const initial = CROP_DISEASE_DATASET[0];
    return {
      ...initial,
      imageUrl: initial.sampleImage,
      chemicalTreatments: CLINICAL_CHEMICAL_TREATMENTS,
      chemicalInterventions: CLINICAL_CHEMICAL_TREATMENTS,
      scannedAt: new Date().toISOString(),
      scanId: 'AGRI-INIT-001'
    };
  });
  const [history, setHistory] = useState([]);

  const dashboardRef = useRef(null);
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;

  // Load persistent scan history from localStorage on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newRecord) => {
    try {
      const updated = [newRecord, ...history.filter(h => h.scanId !== newRecord.scanId)].slice(0, 20);
      setHistory(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist history to localStorage', e);
    }
  };

  // Triggered when user selects a local file or dropzone
  const handleImageUpload = async (imageDataUrl) => {
    setCurrentImage(imageDataUrl);
    setActiveTab('diagnosis');
    startDiagnosisPipeline(imageDataUrl, null);
  };

  // Triggered when user clicks a Quick-Demo sample leaf card
  const handleSampleSelected = async (sampleId, sampleImage) => {
    setCurrentImage(sampleImage);
    setActiveTab('diagnosis');
    startDiagnosisPipeline(sampleImage, sampleId);
  };

  // Triggered when user captures snapshot via Camera Modal
  const handleCameraCapture = (capturedDataUrl) => {
    setIsCameraOpen(false);
    setCurrentImage(capturedDataUrl);
    setActiveTab('diagnosis');
    startDiagnosisPipeline(capturedDataUrl, null);
  };

  // Core Diagnosis Pipeline Orchestrator
  const startDiagnosisPipeline = async (imageSrc, predefinedId) => {
    setIsScanning(true);
    setScanProgress(10);
    setTelemetryLogs([]);

    try {
      const result = await runPathologyInference(
        imageSrc,
        predefinedId,
        ({ step, text, progress }) => {
          setScanProgress(progress);
          setTelemetryLogs(prev => [...prev, { step, text }]);
        }
      );

      setActiveDiagnosis(result);
      saveToHistory(result);

      // Trigger celebration confetti if crop is completely healthy!
      if (result.severity === 'none') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#4ade80', '#86efac']
        });
      }

      // Smooth scroll to diagnosis results
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (error) {
      console.error('Inference pipeline failure:', error);
      alert('Error analyzing leaf pathology. Please try another image.');
    } finally {
      setIsScanning(false);
    }
  };

  // Delete single history item
  const handleDeleteHistoryItem = (scanId) => {
    const updated = history.filter(h => (h.scanId || h.scannedAt) !== scanId);
    setHistory(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Clear all history records
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all previous scan diagnoses?')) {
      setHistory([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Re-inspect a past scan from history
  const handleInspectPastScan = (record) => {
    setActiveDiagnosis(record);
    setCurrentImage(record.imageUrl || record.sampleImage);
    setActiveTab('diagnosis');
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Reset to new scan
  const handleNewScan = () => {
    setActiveTab('upload');
    setTelemetryLogs([]);
    const el = document.getElementById('upload-zone');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Print diagnostic report
  const handlePrintReport = () => {
    window.print();
  };

  // Scroll to saved scan history vault
  const handleScrollToHistory = () => {
    setActiveTab('history');
    setTimeout(() => {
      const el = document.getElementById('scan-history');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Primary immediate render - no conditional returns on outer App wrapper
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navigation Bar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onNewScan={handleNewScan}
        onScrollToHistory={handleScrollToHistory}
        historyCount={history.length}
      />

      {/* Main Content Area: Renders all modules immediately in their working layout positions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print space-y-8">
        
        {/* Navigation & Section Jump Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            <button
              onClick={() => {
                setActiveTab('diagnosis');
                dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'diagnosis'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-300" />
              <span>Main Diagnosis Portal</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('upload');
                document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-300" />
              <span>New Scan & Samples</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                document.getElementById('scan-history')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-3.5 h-3.5 text-emerald-300" />
              <span>Scan Vault ({history.length})</span>
            </button>
          </div>

          {activeDiagnosis && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Active Specimen:</span>
              <strong className="text-emerald-400 font-semibold">{activeDiagnosis.cropName[lang] || activeDiagnosis.cropName.en}</strong>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{activeDiagnosis.diseaseName[lang] || activeDiagnosis.diseaseName.en}</span>
            </div>
          )}
        </div>

        {/* Module 1: Interactive Leaf Upload & Web-Camera Zone */}
        <div id="upload-zone">
          <LeafUploadZone
            onImageSelected={handleImageUpload}
            onSampleSelected={handleSampleSelected}
            onOpenCamera={() => setIsCameraOpen(true)}
            lang={lang}
            isScanning={isScanning}
          />
        </div>

        {/* Real-Time Scanning Overlay with Laser Animation & Telemetry Logs */}
        {isScanning && (
          <ScanOverlay
            logs={telemetryLogs}
            currentProgress={scanProgress}
            imagePreview={currentImage}
            lang={lang}
          />
        )}

        {/* Module 2: Main Diagnosis Card & Visual Leaf Canvas Inspector */}
        <div ref={dashboardRef} id="diagnosis-portal" className="space-y-8">
          <DiagnosticDashboard
            result={activeDiagnosis || CROP_DISEASE_DATASET[0]}
            lang={lang}
            onPrintReport={handlePrintReport}
          />

          {/* Module 3: Treatment & Remedy Center (Organic, Chemical with 3 clinical cards, Preventive) */}
          <TreatmentTabs
            result={activeDiagnosis || CROP_DISEASE_DATASET[0]}
            lang={lang}
            onPrintReport={handlePrintReport}
          />
        </div>

        {/* Module 4: Saved Diagnostic History Vault */}
        <div id="scan-history">
          <ScanHistory
            history={history}
            onSelectScan={handleInspectPastScan}
            onDeleteScan={handleDeleteHistoryItem}
            onClearHistory={handleClearAllHistory}
            lang={lang}
          />
        </div>

      </main>

      {/* Live Web Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        lang={lang}
      />

      {/* Dedicated Clean White Print-Only Report Layout */}
      <DiagnosticReportPrint
        result={activeDiagnosis || CROP_DISEASE_DATASET[0]}
        lang={lang}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400">
            © {new Date().getFullYear()} AgriCure AI – Precision Agronomy & Plant Pathology. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-Side Neural Inference Engine</span>
            <span>•</span>
            <span>HTML5 Canvas Retinal Layer</span>
            <span>•</span>
            <span>Zero Server Setup</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
