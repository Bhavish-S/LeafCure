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
import AuthModal from './components/AuthModal';
import MyPlants from './components/MyPlants';
import PrivacyModal from './components/PrivacyModal';
import { supabase } from './lib/supabase';
import { runPathologyInference } from './services/inferenceEngine';
import { APP_TRANSLATIONS, CROP_DISEASE_DATASET, CLINICAL_CHEMICAL_TREATMENTS } from './data/pathologyData';
import { Target, UploadCloud, History, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'plantcure_ai_diagnoses_v2';

function App() {
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [activeTab, setActiveTab] = useState('diagnosis'); // 'diagnosis' | 'upload' | 'history'
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [currentImage, setCurrentImage] = useState(() => CROP_DISEASE_DATASET[0]?.sampleImage || null);
  const [activeDiagnosis, setActiveDiagnosis] = useState(() => {
    const initial = CROP_DISEASE_DATASET[0];
    return {
      ...initial,
      imageUrl: initial.sampleImage,
      chemicalTreatments: CLINICAL_CHEMICAL_TREATMENTS,
      chemicalInterventions: CLINICAL_CHEMICAL_TREATMENTS,
      scannedAt: new Date().toISOString(),
      scanId: 'FLORA-INIT-001'
    };
  });
  const [history, setHistory] = useState([]);
  const [session, setSession] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const dashboardRef = useRef(null);
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load persistent scan history from localStorage or Supabase
  useEffect(() => {
    if (session) {
      // Load from Supabase
      const fetchScans = async () => {
        const { data, error } = await supabase
          .from('scans')
          .select('*')
          .order('scanned_at', { ascending: false });
        
        if (!error && data) {
          const formattedHistory = data.map(scan => ({
            ...scan.diagnosis,
            imageUrl: scan.image_url,
            scanId: scan.id,
            scannedAt: scan.scanned_at,
            plantId: scan.plant_id
          }));
          setHistory(formattedHistory);
        }
      };
      fetchScans();
    } else {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setHistory(parsed);
          }
        } else {
          setHistory([]);
        }
      } catch (e) {
        console.warn('Failed to load history from localStorage', e);
      }
    }
  }, [session]);

  // Save history to cloud or localStorage
  const saveToHistory = async (newRecord) => {
    const isUpdate = history.some(h => h.scanId === newRecord.scanId);
    
    if (session) {
      if (isUpdate) {
        await supabase.from('scans').update({ diagnosis: newRecord }).eq('id', newRecord.scanId);
        setHistory(prev => prev.map(h => h.scanId === newRecord.scanId ? newRecord : h));
      } else {
        const { data, error } = await supabase.from('scans').insert([{
          user_id: session.user.id,
          image_url: newRecord.imageUrl || newRecord.sampleImage,
          diagnosis: newRecord
        }]).select();
        
        if (!error && data) {
          newRecord.scanId = data[0].id;
          newRecord.plantId = null;
          setHistory(prev => [newRecord, ...prev]);
        }
      }
    } else {
      try {
        const updated = [newRecord, ...history.filter(h => h.scanId !== newRecord.scanId)].slice(0, 20);
        setHistory(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist history to localStorage', e);
      }
    }
  };

  const handleLinkPlant = async (scanId, plantId) => {
    if (!session) return;
    const { error } = await supabase.from('scans').update({ plant_id: plantId }).eq('id', scanId);
    if (!error) {
      setHistory(prev => prev.map(h => h.scanId === scanId ? { ...h, plantId } : h));
    }
  };

  const handleImageUpload = async (imageDataUrl, additionalInfo) => {
    setCurrentImage(imageDataUrl);
    setActiveTab('diagnosis');
    startDiagnosisPipeline(imageDataUrl, null, additionalInfo);
  };

  const handleSampleSelected = async (sampleId, sampleImage, additionalInfo) => {
    setCurrentImage(sampleImage);
    setActiveTab('diagnosis');
    startDiagnosisPipeline(sampleImage, sampleId, additionalInfo);
  };

  const handleCameraCapture = (capturedDataUrl, additionalInfo) => {
    setIsCameraOpen(false);
    setCurrentImage(capturedDataUrl);
    setActiveTab('diagnosis');
    startDiagnosisPipeline(capturedDataUrl, null, additionalInfo);
  };

  // Core Diagnosis Pipeline Orchestrator
  const startDiagnosisPipeline = async (imageSrc, predefinedId, additionalInfo = '') => {
    setIsScanning(true);
    setScanProgress(10);
    setTelemetryLogs([]);

    try {
      const { localResult, aiPromise } = await runPathologyInference(
        imageSrc,
        predefinedId,
        ({ step, text, progress }) => {
          setScanProgress(progress);
          setTelemetryLogs(prev => [...prev, { step, text }]);
        },
        additionalInfo
      );

      setActiveDiagnosis(localResult);
      saveToHistory(localResult);

      // Trigger celebration confetti if crop is completely healthy!
      if (localResult.severity === 'none') {
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

      if (aiPromise) {
        setIsAiAnalyzing(true);
        aiPromise.then((aiResult) => {
          if (aiResult) {
            setActiveDiagnosis(aiResult);
            saveToHistory(aiResult);
          }
        }).catch(err => {
          console.error(err);
        }).finally(() => {
          setIsAiAnalyzing(false);
        });
      }

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-slate-950">
      
      {/* Top Navigation Bar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onNewScan={handleNewScan}
        onScrollToHistory={handleScrollToHistory}
        history={history}
        session={session}
        onLogin={() => setIsAuthModalOpen(true)}
        onShowMyPlants={() => setActiveTab('myPlants')}
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
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-1 ring-violet-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-violet-300" />
              <span>Main Diagnosis Portal</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('upload');
                document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-1 ring-violet-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-violet-300" />
              <span>New Scan & Samples</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                document.getElementById('scan-history')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-1 ring-violet-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-3.5 h-3.5 text-violet-300" />
              <span>Scan Vault ({history.length})</span>
            </button>
          </div>

          {activeDiagnosis && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
              <span className="text-slate-400">Active Specimen:</span>
              <strong className="text-violet-400 font-semibold">{activeDiagnosis.cropName[lang] || activeDiagnosis.cropName.en}</strong>
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
          {isAiAnalyzing && (
            <div className="bg-violet-900/40 border border-violet-500/50 p-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg animate-pulse">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span className="text-violet-200 text-sm font-medium">
                {t.aiAnalyzing}
              </span>
            </div>
          )}
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

        {/* My Plants Module */}
        {activeTab === 'myPlants' && (
          <div id="my-plants">
            <MyPlants lang={lang} session={session} />
          </div>
        )}

        {/* Module 4: Saved Diagnostic History Vault */}
        <div id="scan-history">
          <ScanHistory
            history={history}
            onSelectScan={handleInspectPastScan}
            onDeleteScan={handleDeleteHistoryItem}
            onClearHistory={handleClearAllHistory}
            lang={lang}
            isCloudSynced={!!session}
            onLinkPlant={handleLinkPlant}
          />
        </div>

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
      />

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
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/50 backdrop-blur-md py-8 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400">
            © {new Date().getFullYear()} PlantCure AI – Precision Agronomy & Plant Pathology. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400 flex-wrap justify-center">
            <button 
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-violet-400 hover:text-violet-300 hover:underline transition-colors font-medium"
            >
              Privacy Policy & Disclaimer
            </button>
            <span className="hidden sm:inline">•</span>
            <span>Client-Side Neural Inference Engine</span>
            <span className="hidden sm:inline">•</span>
            <span>HTML5 Canvas Retinal Layer</span>
            <span className="hidden sm:inline">•</span>
            <span>Zero Server Setup</span>
          </div>
        </div>
      </footer>

      <PrivacyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

    </div>
  );
}

export default App;
