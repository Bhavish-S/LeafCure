import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sprout, Plus } from 'lucide-react';
import { APP_TRANSLATIONS } from '../data/pathologyData';

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
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setPlants(data);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {plants.map(plant => (
            <div key={plant.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-1">
              <h4 className="text-lg font-bold text-white">{plant.name}</h4>
              {plant.species && <span className="text-sm text-slate-400 italic">{plant.species}</span>}
              <span className="text-xs text-slate-500 mt-2">
                Added {new Date(plant.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
