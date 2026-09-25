import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, CheckCircle2, ChevronRight, Zap, Mic, MicOff, MapPin } from 'lucide-react';
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
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [regionSeason, setRegionSeason] = useState('');

  useEffect(() => {
    const savedRegion = localStorage.getItem('floraguard_region');
    if (savedRegion) {
      setRegionSeason(savedRegion);
    }
  }, []);

  const handleRegionChange = (e) => {
    const val = e.target.value;
    setRegionSeason(val);
    localStorage.setItem('floraguard_region', val);
  };

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasSpeechSupport = !!SpeechRecognition;

  const toggleListen = () => {
    if (!hasSpeechSupport) return;
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAdditionalInfo((prev) => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please upload valid image files (PNG, JPG, WebP).');
      return;
    }
    
    const combinedInfo = `${regionSeason ? `Region/Season: ${regionSeason}. ` : ''}${additionalInfo}`;
    
    if (imageFiles.length === 1) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageSelected([event.target.result], combinedInfo);
      };
      reader.readAsDataURL(imageFiles[0]);
    } else {
      const readers = imageFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(dataUrls => {
        onImageSelected(dataUrls, combinedInfo);
      });
    }
  };

  return (
    <section className="w-full my-6">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-3">
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
            ? 'border-violet-400 bg-violet-950/40 scale-[1.01] shadow-2xl shadow-violet-500/20'
            : 'border-slate-700/80 hover:border-violet-500/60 bg-slate-900/60 hover:bg-slate-900/90 shadow-xl'
        }`}
      >
        {/* Subtle background glow on hover */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-500/20 transition-all"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all"></div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isScanning}
        />

        {/* Upload Icon Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 group-hover:scale-110 transition-transform duration-300 mb-4">
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          {t.dropzoneTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
          {t.dropzoneSubtitle}
        </p>

        {/* Symptoms & Region Context Area */}
        <div className="w-full max-w-md mb-6 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select 
              value={regionSeason}
              onChange={handleRegionChange}
              className="bg-slate-800/80 text-white text-xs rounded-lg p-2 border border-slate-700 outline-none focus:border-violet-500 w-full"
            >
              <option value="">Select Region & Season (Optional)</option>
              <option value="North India, Summer">North India, Summer</option>
              <option value="North India, Monsoon">North India, Monsoon</option>
              <option value="North India, Winter">North India, Winter</option>
              <option value="South India, Summer">South India, Summer</option>
              <option value="South India, Monsoon">South India, Monsoon</option>
              <option value="South India, Winter">South India, Winter</option>
              <option value="Central India, Monsoon">Central India, Monsoon</option>
              <option value="East India, Monsoon">East India, Monsoon</option>
              <option value="West India, Arid/Summer">West India, Arid/Summer</option>
            </select>
          </div>

          <label className="block text-xs font-semibold text-slate-300 mb-2 text-left">
            Describe symptoms (Optional)
          </label>
          <div className="relative">
            <textarea 
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="e.g. Started turning yellow 3 days ago..."
              className="w-full bg-slate-800/80 text-white text-sm rounded-xl p-3 pr-12 border border-slate-700 outline-none focus:border-violet-500 transition-colors resize-none h-20"
            />
            {hasSpeechSupport && (
              <button 
                type="button"
                onClick={toggleListen}
                className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${
                  isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons inside dropzone */}
        <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={isScanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-violet-600/30 transition-all active:scale-95"
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
            <Camera className="w-4 h-4 text-violet-400" />
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
          <span className="text-[11px] font-mono text-violet-400 bg-violet-950/60 border border-violet-500/30 px-2.5 py-1 rounded-full w-fit">
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
                onClick={() => {
                  const combinedInfo = `${regionSeason ? `Region/Season: ${regionSeason}. ` : ''}${additionalInfo}`;
                  onSampleSelected(sample.id, sample.sampleImage, combinedInfo);
                }}
                className="group relative cursor-pointer rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/60 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1 flex flex-col justify-between"
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
                        : 'bg-violet-950/90 text-violet-400 border-violet-700/80'
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
                    <h4 className="font-bold text-white text-base group-hover:text-violet-400 transition-colors">
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
                    <span className="text-violet-400 font-mono font-medium">
                      {sample.confidence}% Conf.
                    </span>
                    <button
                      type="button"
                      className="flex items-center gap-1 font-semibold text-violet-400 group-hover:text-violet-300"
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
