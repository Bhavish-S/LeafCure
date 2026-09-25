import React, { useRef, useEffect, useState } from 'react';
import { Layers, Eye, EyeOff, Target, Sparkles, ZoomIn, RefreshCw, CheckCircle2 } from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';
import { detectLesionsFromImage, generateFallbackLesions } from '../utils/lesionDetector.js';

export default function LeafCanvasInspector({ 
  imageUrl, 
  lesions = [], 
  diseaseName,
  severity,
  lang 
}) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [showBoxes, setShowBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [detectedLesions, setDetectedLesions] = useState([]);

  // Determine active lesions: prop lesions > detected lesions from image buffer
  const activeLesions = (lesions && lesions.length > 0)
    ? lesions
    : detectedLesions;

  // Redraw canvas whenever toggles, image, or lesions change
  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    let isMounted = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Only set crossOrigin for remote http(s) URLs, never on base64 data: or blob:
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }

    const render = () => {
      if (!isMounted || !canvas) return;

      try {
        const nw = img.naturalWidth || 500;
        const nh = img.naturalHeight || 500;
        const naturalAspect = nh / nw;

        // Synchronize drawing buffer dimensions with intrinsic aspect ratio
        const containerWidth = containerRef.current?.clientWidth || 500;
        let width = Math.max(280, Math.min(containerWidth - 24, 600));
        let height = Math.round(width * naturalAspect);

        // Max height bound so portrait photos don't overflow the viewport
        const maxHeight = 520;
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(height / naturalAspect);
        }

        // Handle high DPI retina screens without cumulative transform drift
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Draw base image onto canvas buffer starting at exact (0, 0)
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Determine lesions to draw for this frame
        let currentLesions = (lesions && lesions.length > 0) ? lesions : detectedLesions;
        let isHealthyScan = (severity === 'none');
        let contourToDraw = null;

        if ((!currentLesions || currentLesions.length === 0) && severity !== 'none') {
          const scanResult = detectLesionsFromImage(img);
          if (scanResult.isHealthy) {
            isHealthyScan = true;
            currentLesions = [];
            contourToDraw = scanResult.leafContour;
            if (isMounted) setDetectedLesions([]);
          } else {
            currentLesions = scanResult.lesions;
            contourToDraw = scanResult.leafContour;
            if (isMounted) setDetectedLesions(scanResult.lesions);
          }
        }

        // Draw subtle glowing green contour for healthy foliage (no pathogen lesions)
        if (isHealthyScan || severity === 'none' || (currentLesions && currentLesions.length === 0)) {
          ctx.save();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
          ctx.shadowColor = 'rgba(16, 185, 129, 0.85)';
          ctx.shadowBlur = 12;
          ctx.setLineDash([8, 6]);
          if (contourToDraw) {
            const bx = Math.round(contourToDraw.minX * width);
            const by = Math.round(contourToDraw.minY * height);
            const bw = Math.round((contourToDraw.maxX - contourToDraw.minX) * width);
            const bh = Math.round((contourToDraw.maxY - contourToDraw.minY) * height);
            ctx.strokeRect(bx, by, bw, bh);
          } else {
            const bx = Math.round(width * 0.12);
            const by = Math.round(height * 0.12);
            const bw = Math.round(width * 0.76);
            const bh = Math.round(height * 0.76);
            ctx.strokeRect(bx, by, bw, bh);
          }
          ctx.restore();
        }

        // 1. Draw Heatmap Overlay if enabled
        if (showHeatmap && currentLesions && currentLesions.length > 0) {
          ctx.save();
          currentLesions.forEach((lesion) => {
            const lx = typeof lesion.x === 'number' ? lesion.x : 0.25;
            const ly = typeof lesion.y === 'number' ? lesion.y : 0.25;
            const lw = typeof lesion.w === 'number' ? lesion.w : 0.18;
            const lh = typeof lesion.h === 'number' ? lesion.h : 0.18;

            const cx = (lx + lw / 2) * width;
            const cy = (ly + lh / 2) * height;
            const boxPxW = lw * width;
            const boxPxH = lh * height;
            const radius = Math.max(boxPxW, boxPxH) * 0.85;

            const heatGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);

            if (lesion.type === 'necrotic' || lesion.color === '#dc2626' || severity === 'severe') {
              heatGrad.addColorStop(0, 'rgba(220, 38, 38, 0.70)'); // deep necrotic red
              heatGrad.addColorStop(0.40, 'rgba(239, 68, 68, 0.45)');
              heatGrad.addColorStop(0.75, 'rgba(245, 158, 11, 0.20)');
              heatGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
            } else if (lesion.type === 'chlorotic' || lesion.color === '#eab308') {
              heatGrad.addColorStop(0, 'rgba(234, 179, 8, 0.70)'); // yellow chlorotic halo
              heatGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.40)');
              heatGrad.addColorStop(0.80, 'rgba(234, 179, 8, 0.15)');
              heatGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
            } else if (lesion.type === 'margin' || lesion.color === '#ea580c') {
              heatGrad.addColorStop(0, 'rgba(234, 88, 12, 0.70)'); // margin blight orange
              heatGrad.addColorStop(0.45, 'rgba(249, 115, 22, 0.40)');
              heatGrad.addColorStop(0.80, 'rgba(234, 179, 8, 0.15)');
              heatGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
            } else {
              heatGrad.addColorStop(0, 'rgba(245, 158, 11, 0.70)'); // foliar active amber
              heatGrad.addColorStop(0.45, 'rgba(249, 115, 22, 0.40)');
              heatGrad.addColorStop(0.80, 'rgba(234, 179, 8, 0.15)');
              heatGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
            }

            ctx.fillStyle = heatGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        }

        // 2. Draw Bounding Boxes with Reticle Corners and Centroid Crosshairs
        if (showBoxes && currentLesions && currentLesions.length > 0) {
          currentLesions.forEach((lesion, idx) => {
            const lx = typeof lesion.x === 'number' ? lesion.x : 0.25;
            const ly = typeof lesion.y === 'number' ? lesion.y : 0.25;
            const lw = typeof lesion.w === 'number' ? lesion.w : 0.18;
            const lh = typeof lesion.h === 'number' ? lesion.h : 0.18;

            const bx = Math.round(lx * width);
            const by = Math.round(ly * height);
            const bw = Math.round(lw * width);
            const bh = Math.round(lh * height);

            ctx.save();
            ctx.lineWidth = 2.5;
            const strokeColor = lesion.color || (severity === 'severe' ? '#ef4444' : severity === 'moderate' ? '#f59e0b' : '#10b981');
            ctx.strokeStyle = strokeColor;
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 8;

            // Box outline
            ctx.strokeRect(bx, by, bw, bh);

            // Corner bracket accents
            const cornerLength = Math.min(bw * 0.25, bh * 0.25, 12);
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            // Top-left
            ctx.moveTo(bx, by + cornerLength);
            ctx.lineTo(bx, by);
            ctx.lineTo(bx + cornerLength, by);
            // Top-right
            ctx.moveTo(bx + bw - cornerLength, by);
            ctx.lineTo(bx + bw, by);
            ctx.lineTo(bx + bw, by + cornerLength);
            // Bottom-left
            ctx.moveTo(bx, by + bh - cornerLength);
            ctx.lineTo(bx, by + bh);
            ctx.lineTo(bx + cornerLength, by + bh);
            // Bottom-right
            ctx.moveTo(bx + bw - cornerLength, by + bh);
            ctx.lineTo(bx + bw, by + bh);
            ctx.lineTo(bx + bw, by + bh - cornerLength);
            ctx.stroke();

            // Center target crosshair on lesion centroid
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.moveTo(bx + bw / 2 - 5, by + bh / 2);
            ctx.lineTo(bx + bw / 2 + 5, by + bh / 2);
            ctx.moveTo(bx + bw / 2, by + bh / 2 - 5);
            ctx.lineTo(bx + bw / 2, by + bh / 2 + 5);
            ctx.stroke();

            // Label Pill
            if (showLabels) {
              const rawLabel = lesion.label || 'Lesion';
              const labelText = rawLabel.startsWith('#') ? rawLabel : `#${idx + 1} ${rawLabel}`;
              ctx.font = 'bold 11px monospace';
              const textWidth = ctx.measureText(labelText).width;
              const pillHeight = 20;
              const pillWidth = textWidth + 20;

              const pillY = by > pillHeight + 6 ? by - pillHeight - 4 : by + bh + 4;
              const textY = by > pillHeight + 6 ? by - 9 : by + bh + 14;

              // Pill background
              ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
              ctx.beginPath();
              ctx.roundRect(bx, pillY, pillWidth, pillHeight, 5);
              ctx.fill();

              // Pill border
              ctx.lineWidth = 1.2;
              ctx.strokeStyle = strokeColor;
              ctx.stroke();

              // Status dot matching lesion color
              ctx.fillStyle = strokeColor;
              ctx.beginPath();
              ctx.arc(bx + 8, textY - 3.5, 3, 0, Math.PI * 2);
              ctx.fill();

              // Text
              ctx.fillStyle = '#f8fafc';
              ctx.fillText(labelText, bx + 16, textY);
            }

            ctx.restore();
          });
        }
      } catch (err) {
        console.warn('LeafCanvasInspector render error:', err);
      }
    };

    img.onload = () => {
      if (isMounted) render();
    };
    img.onerror = () => {
      console.warn('LeafCanvasInspector failed to load leaf image buffer');
    };
    img.src = imageUrl;
    if (img.complete && img.naturalWidth > 0) {
      render();
    }

    const handleResize = () => {
      if (isMounted) render();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [imageUrl, lesions, detectedLesions, showBoxes, showHeatmap, showLabels, severity]);

  return (
    <div className="rounded-2xl glass-panel p-4 sm:p-6 border border-slate-800 shadow-xl" ref={containerRef}>
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-400" />
            <span>{t.visualInspectorTitle}</span>
          </h3>
          <p className="text-xs text-slate-400">
            Pathology bounding boxes & heat-map synthesized over client canvas buffer
          </p>
        </div>

        {/* Active Lesions Identified Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
            {t.activeLesionsCount}: <strong className={activeLesions.length === 0 ? "text-violet-400 font-bold" : "text-amber-400 font-bold"}>
              {activeLesions.length === 0 ? (lang === 'hi' ? '0 (स्वस्थ)' : '0 (Healthy)') : activeLesions.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full flex items-center justify-center bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800 p-2 sm:p-4 min-h-[300px]">
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-2xl max-w-full h-auto object-contain transition-all"
        />

        {(severity === 'none' || activeLesions.length === 0) && (
          <div className="absolute top-4 right-4 bg-violet-950/95 border border-violet-500/60 text-violet-300 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xl backdrop-blur-md animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
            <span className="font-semibold tracking-wide">
              {t.foliageHealthyStatus || 'Status: Foliage Healthy (No Active Pathogens Detected)'}
            </span>
          </div>
        )}
      </div>

      {/* Layer Toggle Toolbar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Bounding Box Toggle */}
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
              showBoxes
                ? 'bg-violet-950/80 text-violet-300 border-violet-500/50 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {showBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{t.showBoundingBoxes}</span>
          </button>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
              showHeatmap
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Show AI focus areas</span>
          </button>

          {/* Labels Toggle */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
              showLabels
                ? 'bg-slate-700 text-white border-slate-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <span>{t.toggleLabels}</span>
          </button>

        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          Canvas 2D Retinal Buffer
        </span>
      </div>

    </div>
  );
}
