import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { CROP_DISEASE_DATASET, APP_TRANSLATIONS } from '../data/pathologyData';

export default function LeafUploadZone({ 
  onImageSelected, 
  onSampleSelected, 
  onOpenCamera, 
  lang,
  isScanning 
}) {
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onImageSelected(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="w-full my-6">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AgriTech Vision Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {t.heroTitle}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {t.heroDesc}
        </p>
      </div>

      {/* Main Drag-and-Drop Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className={`relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center overflow-hidden ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/40 scale-[1.01] shadow-2xl shadow-emerald-500/20'
            : 'border-slate-700/80 hover:border-emerald-500/60 bg-slate-900/60 hover:bg-slate-900/90 shadow-xl'
        }`}
      >
        {/* Subtle background glow on hover */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all"></div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isScanning}
        />

        {/* Upload Icon Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform duration-300 mb-4">
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          {t.dropzoneTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
          {t.dropzoneSubtitle}
        </p>

        {/* Action Buttons inside dropzone */}
        <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Browse Leaf Image</span>
          </button>

          <button
            type="button"
            onClick={onOpenCamera}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-medium border border-slate-600 transition-all active:scale-95"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>{t.cameraBtn}</span>
          </button>

        </div>
      </div>

      {/* 3 Quick-Demo Sample Leaf Cards Zone */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{t.sampleSectionTitle}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {t.sampleSectionSubtitle}
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full w-fit">
            3 Ready-to-Test Clinical Samples
          </span>
        </div>

        {/* Sample Leaf Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {CROP_DISEASE_DATASET.slice(0, 3).map((sample) => {
            const isMildOrHealthy = sample.severity === 'none' || sample.severity === 'mild';
            const isSevere = sample.severity === 'severe';

            return (
              <div
                key={sample.id}
                onClick={() => onSampleSelected(sample.id, sample.sampleImage)}
                className="group relative cursor-pointer rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800/80">
                  <img
                    src={sample.sampleImage}
                    alt={sample.cropName[lang] || sample.cropName.en}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Severity Badge */}
                  <span
                    className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border shadow-md ${
                      isSevere
                        ? 'bg-red-950/90 text-red-400 border-red-700/80'
                        : sample.severity === 'moderate'
                        ? 'bg-amber-950/90 text-amber-400 border-amber-700/80'
                        : 'bg-emerald-950/90 text-emerald-400 border-emerald-700/80'
                    }`}
                  >
                    {t[sample.severity] || sample.severity}
                  </span>

                  {/* Crop Type Pill */}
                  <span className="absolute bottom-2.5 left-2.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-200 border border-slate-700">
                    {sample.cropName[lang] || sample.cropName.en}
                  </span>
                </div>

                {/* Card Content & Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                      {sample.diseaseName[lang] || sample.diseaseName.en}
                    </h4>
                    <p className="text-xs text-slate-400 italic mt-0.5">
                      {sample.scientificName}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {sample.symptoms[lang] ? sample.symptoms[lang][0] : sample.symptoms.en[0]}
                    </p>
                  </div>

                  {/* Instant Analyze Trigger */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-mono font-medium">
                      {sample.confidence}% Conf.
                    </span>
                    <button
                      type="button"
                      className="flex items-center gap-1 font-semibold text-emerald-400 group-hover:text-emerald-300"
                    >
                      <span>1-Click Test</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
