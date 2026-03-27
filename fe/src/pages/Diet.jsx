import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';

const mealIcons = { breakfast: '🌅', lunch: '☀️', snack: '🍎', dinner: '🌙' };

export default function Diet() {
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/diet').then(r => { setDiet(r.data); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <PageWrapper>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Daily Diet Plan 🥗</h1>
      <p className="text-slate-400 mb-6">Budget-friendly Indian meals tailored to your goal</p>

      {/* Macros Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-orange-400">{diet.calories}</div>
          <div className="text-slate-400 text-sm mt-1">Daily Calories</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-green-400">{diet.protein}g</div>
          <div className="text-slate-400 text-sm mt-1">Daily Protein</div>
        </div>
      </div>

      {/* Meals */}
      <div className="grid md:grid-cols-2 gap-5">
        {Object.entries(diet.meals).map(([key, meal], i) => (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }} className="bg-slate-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-black/20 transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{mealIcons[key]}</span>
                <div>
                  <h3 className="text-white font-semibold capitalize">{key}</h3>
                  <p className="text-slate-400 text-xs">{meal.name}</p>
                </div>
              </div>
              <span className="bg-slate-700 text-orange-400 text-xs px-3 py-1 rounded-full font-medium">{meal.calories} kcal</span>
            </div>
            <ul className="space-y-1.5">
              {meal.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-orange-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-400">
        💡 <strong className="text-slate-300">Tip:</strong> Drink 3–4 litres of water daily. Adjust portions based on hunger. Consistency beats perfection.
      </div>
    </div>
    </PageWrapper>
  );
}
