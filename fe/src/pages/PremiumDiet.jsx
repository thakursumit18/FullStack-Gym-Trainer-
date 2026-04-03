import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';

const mealIcons = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' };
const mealColors = {
  breakfast: { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400' },
  lunch:     { bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20',  text: 'text-yellow-400' },
  snack:     { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  dinner:    { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400' },
};

const goalLabel = { lose_fat: 'Fat Loss', gain_muscle: 'Muscle Gain', maintain: 'Maintenance' };
const levelLabel = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

export default function PremiumDiet() {
  const navigate = useNavigate();
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [switching, setSwitching] = useState(false);
  const [currentDietType, setCurrentDietType] = useState(null);

  const fetchDiet = () => {
    setLoading(true); setError('');
    api.get('/premium/status').then(r => {
      if (!r.data.isPremium) { navigate('/premium'); return; }
      setCurrentDietType(r.data.preferences?.dietType || 'non_veg');
      return api.get('/premium/diet');
    }).then(r => {
      if (!r) return;
      setDiet(r.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load your premium diet plan.');
      setLoading(false);
    });
  };

  useEffect(() => { fetchDiet(); }, []);

  const switchDietType = async (type) => {
    if (type === currentDietType || switching) return;
    setSwitching(true);
    try {
      await api.put('/premium/preferences', { dietType: type });
      setCurrentDietType(type);
      const r = await api.get('/premium/diet');
      setDiet(r.data);
    } catch {
      alert('Failed to switch diet type. Try again.');
    } finally { setSwitching(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      <p className="text-slate-500 text-sm">Loading your personalized diet...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-4">
      <p className="text-white font-semibold">{error}</p>
      <AnimatedButton onClick={fetchDiet} className="bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm">
        Try Again
      </AnimatedButton>
    </div>
  );

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Premium Diet</span>
          </div>
          <h1 className="text-3xl font-black text-white">Your Custom Diet Plan</h1>
          <p className="text-slate-400 mt-1 text-sm">Personalized macros and meals based on your goal, body and food preference</p>

          {/* Meta badges */}
          {diet && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-orange-500/20 text-orange-400 border-orange-500/30">
                {goalLabel[diet.goal] || diet.goal}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                {levelLabel[diet.fitnessLevel] || diet.fitnessLevel}
              </span>
              <Link to="/premium/settings"
                className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-700 text-slate-300 border-slate-600 hover:border-orange-500/50 hover:text-orange-400 transition-colors">
                Edit Preferences →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Veg / Non-Veg Toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 bg-slate-800 p-1 rounded-xl w-fit">
          {[
            { key: 'veg', label: 'Vegetarian', dot: 'bg-green-500' },
            { key: 'non_veg', label: 'Non-Vegetarian', dot: 'bg-red-500' },
          ].map(t => (
            <button key={t.key} onClick={() => switchDietType(t.key)} disabled={switching}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 ${currentDietType === t.key ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'}`}>
              <span className={`w-2 h-2 rounded-full ${t.dot}`} />
              {t.label}
              {switching && currentDietType !== t.key && (
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-3 h-3 border border-current border-t-transparent rounded-full inline-block" />
              )}
            </button>
          ))}
        </motion.div>

        {/* Macro Summary */}
        <AnimatePresence mode="wait">
          {diet && (
            <motion.div key={diet.dietType}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>

              <div className="grid grid-cols-3 gap-4 mb-7">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-black text-orange-400">{diet.calories}</div>
                  <div className="text-slate-400 text-xs mt-1 font-medium">Daily Calories</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-black text-green-400">{diet.protein}g</div>
                  <div className="text-slate-400 text-xs mt-1 font-medium">Daily Protein</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-black text-blue-400 capitalize">{diet.dietType === 'veg' ? 'Veg' : 'Non-Veg'}</div>
                  <div className="text-slate-400 text-xs mt-1 font-medium">Diet Type</div>
                </div>
              </div>

              {/* Meal Cards */}
              <div className="grid md:grid-cols-2 gap-5 mb-6">
                {Object.entries(diet.meals).map(([key, meal], i) => {
                  const mc = mealColors[key] || mealColors.breakfast;
                  return (
                    <motion.div key={key}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -3 }}
                      className={`${mc.bg} border ${mc.border} rounded-2xl p-6 hover:shadow-xl hover:shadow-black/20 transition-all`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${mc.bg} border ${mc.border} flex items-center justify-center text-xl`}>
                            {mealIcons[key]}
                          </div>
                          <div>
                            <h3 className="text-white font-bold capitalize">{key}</h3>
                            <p className="text-slate-400 text-xs">{meal.name}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-800 ${mc.text}`}>
                          {meal.calories} kcal
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {meal.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className={`${mc.text} mt-0.5 font-bold flex-shrink-0`}>—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>

              {/* Calorie breakdown bar */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="bg-slate-800 rounded-2xl p-5 mb-5">
                <h3 className="text-white font-semibold text-sm mb-3">Daily Calorie Distribution</h3>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
                  {Object.entries(diet.meals).map(([key, meal]) => {
                    const pct = Math.round((meal.calories / diet.calories) * 100);
                    const colors = { breakfast: 'bg-amber-500', lunch: 'bg-yellow-500', snack: 'bg-emerald-500', dinner: 'bg-violet-500' };
                    return (
                      <motion.div key={key} initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                        className={`${colors[key]} h-full`} title={`${key}: ${meal.calories} kcal`} />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(diet.meals).map(([key, meal]) => {
                    const dotColors = { breakfast: 'bg-amber-500', lunch: 'bg-yellow-500', snack: 'bg-emerald-500', dinner: 'bg-violet-500' };
                    return (
                      <div key={key} className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${dotColors[key]}`} />
                        <span className="text-slate-400 text-xs capitalize">{key}: {meal.calories} kcal</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Tip */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-5 py-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-400 text-xs font-bold">i</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Your calories are calculated as <span className="text-orange-400 font-semibold">{diet.calories} kcal/day</span> based on your weight, goal and fitness level.
                  Switch between <span className="text-green-400 font-semibold">Veg</span> and <span className="text-red-400 font-semibold">Non-Veg</span> anytime — your macros stay the same, only the meals change.
                  Drink 3–4 litres of water daily.
                </p>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
