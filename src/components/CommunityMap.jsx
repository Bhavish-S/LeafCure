import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityMap() {
  const [outbreaks, setOutbreaks] = useState([]);

  useEffect(() => {
    // Mock localized outbreaks
    setOutbreaks([
      { id: 1, lat: 21.1, lng: 79.1, disease: 'Late Blight', severity: 'severe', crop: 'Tomato', dist: '2.4km', time: '2 hours ago' },
      { id: 2, lat: 21.2, lng: 79.0, disease: 'Leaf Rust', severity: 'moderate', crop: 'Wheat', dist: '5.1km', time: '5 hours ago' },
      { id: 3, lat: 21.0, lng: 79.3, disease: 'Healthy', severity: 'none', crop: 'Corn', dist: '1.2km', time: '1 hour ago' },
      { id: 4, lat: 21.3, lng: 79.2, disease: 'Powdery Mildew', severity: 'mild', crop: 'Grapes', dist: '8.0km', time: '1 day ago' },
    ]);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-500" />
              Community Outbreak Radar
            </h2>
            <p className="text-slate-400 text-sm mt-1">Live tracking of crop diseases reported in your region</p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1 bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">
              <div className="w-2 h-2 rounded-full bg-red-500" /> Severe
            </span>
            <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-1 rounded border border-amber-500/20">
              <div className="w-2 h-2 rounded-full bg-amber-500" /> Moderate
            </span>
            <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy
            </span>
          </div>
        </div>

        {/* Mock Map Area */}
        <div className="relative h-[400px] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
          
          {/* Radar sweep effect */}
          <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping opacity-10 w-[800px] h-[800px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '4s' }}></div>

          <div className="relative z-10 text-center">
            {outbreaks.map((ob, idx) => (
              <motion.div 
                key={ob.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                className="absolute"
                style={{
                   // Arbitrary positioning for the mock map based on array index to spread them out
                   left: `${(idx * 25) - 40}px`,
                   top: `${(idx % 2 === 0 ? -1 : 1) * (idx * 30)}px`
                }}
              >
                <div className={`relative group cursor-pointer ${
                  ob.severity === 'severe' ? 'text-red-500' : 
                  ob.severity === 'moderate' ? 'text-amber-500' :
                  ob.severity === 'mild' ? 'text-yellow-400' : 'text-emerald-500'
                }`}>
                  <MapPin className="w-8 h-8 drop-shadow-lg" />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-slate-200 text-xs rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-700">
                    <p className="font-bold text-sm mb-1">{ob.crop}: {ob.disease}</p>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{ob.dist}</span>
                      <span>{ob.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="text-emerald-500 mt-32 font-mono text-sm opacity-50 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Connected to AgriCure Global Network
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
