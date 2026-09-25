import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sprout, Plus, TrendingUp } from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MyPlants({ lang, session }) {
  const [plants, setPlants] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const t = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS.en;

  useEffect(() => {
    if (session) {
      fetchPlants();
    }
  }, [session]);

  const fetchPlants = async () => {
    const { data: plantsData, error: plantsError } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!plantsError && plantsData) {
      // Fetch scans for these plants
      const { data: scansData, error: scansError } = await supabase
        .from('scans')
        .select('*')
        .not('plant_id', 'is', null)
        .order('scanned_at', { ascending: true });
        
      if (!scansError && scansData) {
        // Group scans by plant
        const plantsWithScans = plantsData.map(plant => ({
          ...plant,
          scans: scansData.filter(s => s.plant_id === plant.id)
        }));
        setPlants(plantsWithScans);
      } else {
        setPlants(plantsData.map(p => ({ ...p, scans: [] })));
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const { data, error } = await supabase
      .from('plants')
      .insert([{ name, species, user_id: session.user.id }])
      .select();

    if (!error && data) {
      setPlants([data[0], ...plants]);
      setIsCreating(false);
      setName('');
      setSpecies('');
    }
  };

  if (!session) return null;

  return (
    <div className="w-full my-12 p-6 glass-panel border border-slate-800 rounded-2xl no-print">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <Sprout className="w-6 h-6 text-teal-400" />
          <span>{t.myPlants}</span>
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600/90 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.addPlant}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-8 p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4 max-w-md">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.plantName}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-teal-500 outline-none"
            required
          />
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder={t.plantSpecies}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:border-teal-500 outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {t.createPlant}
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {plants.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl">
          <p className="text-slate-400">{t.myPlantsEmpty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {plants.map(plant => {
            const chartData = (plant.scans || []).map(scan => ({
              date: new Date(scan.scanned_at).toLocaleDateString(),
              affectedArea: scan.diagnosis.affectedAreaPct || 0,
              confidence: scan.diagnosis.confidence || 0
            }));

            return (
              <div key={plant.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-white">{plant.name}</h4>
                    {plant.species && <span className="text-sm text-slate-400 italic">{plant.species}</span>}
                    <span className="text-xs text-slate-500 block mt-1">
                      Added {new Date(plant.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300">
                    <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                    {plant.scans?.length || 0} Scans
                  </div>
                </div>

                {chartData.length > 0 ? (
                  <div className="h-48 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                          labelStyle={{ color: '#94a3b8' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="affectedArea" name="Affected Area %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="confidence" name="Confidence %" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-center">
                    <p className="text-xs text-slate-500">No scans attached to this plant yet. (Attach scans from the Scan History Vault)</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
