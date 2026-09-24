import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';

export default function CameraModal({ isOpen, onClose, onCapture, lang }) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setIsInitializing(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser environment');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || t.cameraFallback);
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    onCapture(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-base">
            <Camera className="w-5 h-5" />
            <span>{t.cameraModalTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Body */}
        <div className="relative bg-black aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="flex flex-col items-center justify-center p-6 text-center max-w-md">
              <div className="p-3 bg-red-950/80 rounded-full border border-red-800/80 mb-3 text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-red-300 font-medium text-sm mb-2">{t.cameraFallback}</p>
              <p className="text-xs text-slate-400 mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-600 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera Permission</span>
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Targeting Overlays */}
              <div className="absolute inset-8 pointer-events-none border border-violet-500/40 rounded-xl">
                {/* Corner reticles */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-violet-400"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-violet-400"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-violet-400"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-violet-400"></div>
                
                {/* Center target mark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-12 h-12 border border-violet-400 rounded-full"></div>
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-slate-300 text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2 text-violet-400" />
                  Connecting camera sensor...
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info & trigger */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            {t.cameraNotice}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700"
            >
              {t.closeModal}
            </button>
            {!cameraError && (
              <button
                onClick={captureFrame}
                disabled={isInitializing}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>{t.captureSnapshot}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
