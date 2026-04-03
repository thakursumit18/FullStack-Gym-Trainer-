import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sun, Apple, Moon, Lightbulb, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';

const mealIcons = { breakfast: <Sunrise className="w-5 h-5 text-amber-400" />, lunch: <Sun className="w-5 h-5 text-yellow-400" />, snack: <Apple className="w-5 h-5 text-emerald-400" />, dinner: <Moon className="w-5 h-5 text-violet-400" /> };

export default function Diet() {
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDiet = () => {
    setLoading(true);
    setError('');
    api.get('/diet')
      .then(r => { setDiet(r.data); setLoading(false); })
      .catch(() => { setError('Failed to load diet plan. Please try again.'); setLoading(false); });
  };

  useEffect(() => { fetchDiet(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 bg-[#030712]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      <p className="text-slate-500 text-sm font-mono">Loading diet plan...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-4 bg-[#030712]">
      <AlertCircle className="w-12 h-12 text-slate-600" />
      <p className="text-white font-semibold">Could not load diet plan</p>
      <p className="text-slate-400 text-sm text-center">{error}</p>
      <AnimatedButton onClick={fetchDiet} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold">
        Try Again
      </AnimatedButton>
    </div>
  );

  return (
    <PageWrapper>
    <div className="min-h-screen bg-[#030712] relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.06] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 py-8">

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Daily Diet Plan</h1>
        <p className="text-slate-500 mb-6 font-mono text-sm">Budget-friendly Indian meals tailored to your goal</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-cyan-400">{diet.calories}</div>
          <div className="text-slate-500 text-sm mt-1 font-mono">Daily Calories</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-emerald-400">{diet.protein}g</div>
          <div className="text-slate-500 text-sm mt-1 font-mono">Daily Protein</div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {Object.entries(diet.meals).map(([key, meal], i) => (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
            whileHover={{ y: -3 }} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-cyan-500/5 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center">
                  {mealIcons[key]}
                </div>
                <div>
                  <h3 className="text-white font-semibold capitalize">{key}</h3>
                  <p className="text-slate-500 text-xs">{meal.name}</p>
                </div>
              </div>
              <span className="bg-slate-800 border border-slate-700/50 text-cyan-400 text-xs px-3 py-1 rounded-full font-mono">{meal.calories} kcal</span>
            </div>
            <ul className="space-y-1.5">
              {meal.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-500 mt-0.5">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-6 bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 text-sm text-slate-400 flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
        <span><strong className="text-slate-300">Tip:</strong> Drink 3-4 litres of water daily. Adjust portions based on hunger. Consistency beats perfection.</span>
      </motion.div>

      </div>
    </div>
    </PageWrapper>
  );
}
