import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';

export default function CameraModal({ isOpen, onClose, onCapture, lang }) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [framingHint, setFramingHint] = useState('');
  const [hintColor, setHintColor] = useState('text-slate-300');
  const animationRef = useRef(null);

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

  useEffect(() => {
    let timeoutId;
    if (isOpen && videoRef.current && !isInitializing && !cameraError) {
      const analyzeFrame = () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          animationRef.current = requestAnimationFrame(analyzeFrame);
          return;
        }
        
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = 64; // low res for fast analysis
        canvas.height = 64;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let totalBrightness = 0;
        let totalGreen = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          totalBrightness += brightness;
          
          // Simple green dominance check
          if (g > r * 1.1 && g > b * 1.1) {
            totalGreen++;
          }
        }
        
        const pixels = canvas.width * canvas.height;
        const avgBrightness = totalBrightness / pixels;
        const greenRatio = totalGreen / pixels;
        
        if (avgBrightness < 40) {
          setFramingHint('Too dark. Move to a brighter area.');
          setHintColor('text-red-400');
        } else if (avgBrightness > 230) {
          setFramingHint('Too bright or glared.');
          setHintColor('text-amber-400');
        } else if (greenRatio < 0.05) {
          setFramingHint('No leaf detected. Frame the leaf.');
          setHintColor('text-amber-400');
        } else if (greenRatio < 0.15) {
          setFramingHint('Move closer to the leaf.');
          setHintColor('text-amber-400');
        } else {
          setFramingHint('Good framing. Ready to capture.');
          setHintColor('text-emerald-400');
        }
        
        timeoutId = setTimeout(() => {
          animationRef.current = requestAnimationFrame(analyzeFrame);
        }, 400); // ~2.5 fps
      };
      
      animationRef.current = requestAnimationFrame(analyzeFrame);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen, isInitializing, cameraError]);

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
            aria-label={t.closeModal}
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
              <div className={`absolute inset-8 pointer-events-none border-2 rounded-[30%] sm:rounded-full flex items-center justify-center transition-colors duration-500 ${hintColor.replace('text-', 'border-').replace('300', '500/50').replace('400', '500/80')}`}>
                {/* Center target mark */}
                <div className={`w-2 h-2 rounded-full opacity-50 ${hintColor.replace('text-', 'bg-')}`}></div>
              </div>

              {/* Live Hint Badge */}
              {framingHint && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-slate-700/50 text-xs font-semibold ${hintColor} shadow-lg transition-colors duration-300`}>
                  {framingHint}
                </div>
              )}

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
