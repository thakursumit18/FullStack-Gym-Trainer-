import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';

const inputClass = 'w-full bg-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500 text-sm';

const LEVELS = [
  { key: 'beginner', label: 'Beginner', desc: 'Less than 1 year of training' },
  { key: 'intermediate', label: 'Intermediate', desc: '1–3 years of training' },
  { key: 'advanced', label: 'Advanced', desc: '3+ years of training' },
];

const EQUIPMENT = [
  { key: 'full_gym', label: 'Full Gym', desc: 'Access to all machines & free weights' },
  { key: 'home', label: 'Home Gym', desc: 'Dumbbells, pull-up bar, bodyweight' },
  { key: 'minimal', label: 'Minimal', desc: 'Resistance bands or bodyweight only' },
];

const DIET_TYPES = [
  { key: 'veg', label: 'Vegetarian', desc: 'Paneer, dal, rajma, plant protein' },
  { key: 'non_veg', label: 'Non-Vegetarian', desc: 'Chicken, eggs, fish, whey protein' },
];

export default function PremiumSettings() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    fitnessLevel: 'beginner',
    equipment: 'full_gym',
    dietType: 'non_veg',
    workoutDays: 5,
    targetWeight: '',
    injuries: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    api.get('/premium/status').then(r => {
      if (!r.data.isPremium) { navigate('/premium'); return; }
      setIsPremium(true);
      if (r.data.preferences) {
        setPrefs(p => ({
          ...p,
          ...r.data.preferences,
          targetWeight: r.data.preferences.targetWeight || '',
          injuries: r.data.preferences.injuries || '',
        }));
      }
      setLoading(false);
    }).catch(() => navigate('/premium'));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/premium/preferences', {
        ...prefs,
        targetWeight: Number(prefs.targetWeight) || null,
        workoutDays: Number(prefs.workoutDays),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Failed to save. Try again.');
    } finally { setSaving(false); }
  };

  const set = (k, v) => setPrefs(p => ({ ...p, [k]: v }));

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">P</div>
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Premium</span>
          </div>
          <h1 className="text-3xl font-black text-white">Your Preferences</h1>
          <p className="text-slate-400 mt-1 text-sm">Customize your plan — changes apply instantly to your workout and diet plans.</p>
        </motion.div>

        <div className="space-y-6">

          {/* Fitness Level */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Fitness Level</h2>
            <p className="text-slate-500 text-xs mb-4">Your plan intensity and volume adapts to this</p>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map(l => (
                <button key={l.key} onClick={() => set('fitnessLevel', l.key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${prefs.fitnessLevel === l.key ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                  <p className={`font-semibold text-sm ${prefs.fitnessLevel === l.key ? 'text-orange-400' : 'text-white'}`}>{l.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{l.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Equipment */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Available Equipment</h2>
            <p className="text-slate-500 text-xs mb-4">Exercises are selected based on what you have access to</p>
            <div className="grid grid-cols-3 gap-3">
              {EQUIPMENT.map(e => (
                <button key={e.key} onClick={() => set('equipment', e.key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${prefs.equipment === e.key ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                  <p className={`font-semibold text-sm ${prefs.equipment === e.key ? 'text-orange-400' : 'text-white'}`}>{e.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{e.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Diet Type */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Diet Preference</h2>
            <p className="text-slate-500 text-xs mb-4">Your meal plan will be built around your food preference</p>
            <div className="grid grid-cols-2 gap-3">
              {DIET_TYPES.map(d => (
                <button key={d.key} onClick={() => set('dietType', d.key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${prefs.dietType === d.key ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                  <p className={`font-semibold text-sm ${prefs.dietType === d.key ? 'text-orange-400' : 'text-white'}`}>{d.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{d.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Workout Days + Target Weight */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Goals & Schedule</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">Workout Days Per Week</label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6].map(d => (
                    <button key={d} onClick={() => set('workoutDays', d)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${prefs.workoutDays === d ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                      {d}
                    </button>
                  ))}
                </div>
                <p className="text-slate-600 text-xs mt-1.5">days/week — rest days auto-assigned</p>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">Target Weight (kg)</label>
                <input type="number" step="0.5" placeholder="e.g. 70" value={prefs.targetWeight}
                  onChange={e => set('targetWeight', e.target.value)} className={inputClass} />
                <p className="text-slate-600 text-xs mt-1.5">Used to calculate your goal progress</p>
              </div>
            </div>
          </motion.div>

          {/* Injuries / Notes */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Injuries or Limitations</h2>
            <p className="text-slate-500 text-xs mb-3">Optional — helps avoid exercises that may aggravate existing conditions</p>
            <textarea rows={3} placeholder="e.g. Lower back pain, knee injury, shoulder impingement..."
              value={prefs.injuries} onChange={e => set('injuries', e.target.value)}
              className={inputClass + ' resize-none'} />
          </motion.div>

          {/* Save Button */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <AnimatedButton onClick={save} disabled={saving}
              className="w-full py-4 rounded-2xl font-bold text-white text-base disabled:opacity-50 transition-all"
              style={{ background: saved ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#f97316,#dc2626)' }}>
              {saved ? 'Preferences Saved!' : saving ? 'Saving...' : 'Save & Regenerate Plans'}
            </AnimatedButton>
            <p className="text-slate-600 text-xs text-center mt-2">Your workout and diet plans will update immediately after saving</p>
          </motion.div>

        </div>
      </div>
    </PageWrapper>
  );
}
