import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';
import ExerciseModal from '../components/ExerciseModal';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const todayName = days[new Date().getDay()];
const todayDate = new Date().toISOString().split('T')[0];
const STORAGE_KEY = `premium_checks_${todayDate}`;

const levelColors = {
  beginner:     { bg: 'bg-green-500/20',  text: 'text-green-400',  border: 'border-green-500/30' },
  intermediate: { bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/30' },
  advanced:     { bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/30' },
};

const equipmentLabel = { full_gym: 'Full Gym', home: 'Home Gym', minimal: 'Minimal Equipment' };

export default function PremiumWorkout() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState([]);
  const [meta, setMeta] = useState(null);
  const [selected, setSelected] = useState(todayName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  });

  useEffect(() => {
    // Check premium status first
    api.get('/premium/status').then(r => {
      if (!r.data.isPremium) { navigate('/premium'); return; }
      // Fetch premium workout
      return api.get('/premium/workout');
    }).then(r => {
      if (!r) return;
      setPlan(r.data.plan);
      setMeta({ level: r.data.level, equipment: r.data.equipment, workoutDays: r.data.workoutDays });
      setLoading(false);
    }).catch(() => {
      setError('Failed to load your premium workout plan.');
      setLoading(false);
    });

    // Clean old localStorage keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('premium_checks_') && key !== STORAGE_KEY)
        localStorage.removeItem(key);
    });
  }, []);

  const toggle = (day, index) => {
    const key = `${day}_${index}`;
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const current = plan.find(d => d.day === selected);
  const currentChecks = current?.exercises?.filter((_, i) => checked[`${selected}_${i}`]).length || 0;
  const total = current?.exercises?.length || 0;
  const pct = total ? Math.round((currentChecks / total) * 100) : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      <p className="text-slate-500 text-sm">Loading your adaptive plan...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-4">
      <p className="text-white font-semibold">{error}</p>
      <AnimatedButton onClick={() => navigate('/premium')} className="bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm">
        Go to Premium
      </AnimatedButton>
    </div>
  );

  const lc = levelColors[meta?.level] || levelColors.beginner;

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Premium Plan</span>
          </div>
          <h1 className="text-3xl font-black text-white">Your Adaptive Workout</h1>
          <p className="text-slate-400 mt-1 text-sm">Personalized for your level, equipment and schedule</p>

          {/* Meta badges */}
          {meta && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${lc.bg} ${lc.text} ${lc.border} capitalize`}>
                {meta.level}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                {equipmentLabel[meta.equipment]}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-purple-500/20 text-purple-400 border-purple-500/30">
                {meta.workoutDays} days/week
              </span>
              <Link to="/premium/settings"
                className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-700 text-slate-300 border-slate-600 hover:border-orange-500/50 hover:text-orange-400 transition-colors">
                Edit Preferences →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Day Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {plan.map((d, i) => (
            <motion.button key={d.day}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(d.day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selected === d.day
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : d.isRest
                  ? 'bg-slate-800 text-slate-600 border border-slate-700'
                  : d.day === todayName
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}>
              {d.day.slice(0, 3)}
              {d.day === todayName && !d.isRest && <span className="ml-1 text-[10px]">•</span>}
            </motion.button>
          ))}
        </div>

        {/* Workout Card */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div key={selected}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-800 rounded-2xl p-6">

              {/* Card Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">{current.day}</h2>
                  <p className={`font-medium text-sm mt-0.5 ${current.isRest ? 'text-slate-500' : 'text-orange-400'}`}>
                    {current.focus}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!current.isRest && selected === todayName && (
                    <span className="text-sm text-slate-400">
                      <span className="text-orange-400 font-bold">{currentChecks}</span>/{total}
                    </span>
                  )}
                  {current.day === todayName && (
                    <span className="bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/30">Today</span>
                  )}
                </div>
              </div>

              {/* Progress bar — today only */}
              {!current.isRest && selected === todayName && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }} />
                  </div>
                  <AnimatePresence>
                    {currentChecks === total && total > 0 && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-green-400 text-sm mt-2 font-semibold">
                        All exercises completed! Outstanding work.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Rest Day */}
              {current.isRest ? (
                <div className="text-center py-12">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}
                    className="text-6xl mb-4 select-none">
                    —
                  </motion.div>
                  <p className="text-slate-300 font-semibold text-lg">Rest & Recover</p>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                    Muscle growth happens during rest. Light stretching or a walk is encouraged.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {current.exercises.map((ex, i) => {
                    const isChecked = !!checked[`${selected}_${i}`];
                    const isToday = selected === todayName;
                    return (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        whileHover={{ x: 3 }}
                        onClick={() => setSelectedExercise(ex)}
                        className={`flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer transition-all ${isChecked ? 'bg-green-500/10 border border-green-500/25' : 'bg-slate-700/50 hover:bg-slate-700'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-orange-500 font-bold text-sm w-6 flex-shrink-0">{i + 1}</span>
                          <div>
                            <span className={`font-medium text-sm transition-all ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                              {ex.name}
                            </span>
                            <p className="text-slate-600 text-xs mt-0.5">Tap for form tips</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm flex-shrink-0">
                          <span className="text-slate-400 hidden sm:block">{ex.sets} sets</span>
                          <span className="text-orange-400 font-semibold">{ex.reps} reps</span>
                          {isToday && (
                            <motion.button whileTap={{ scale: 0.85 }}
                              onClick={e => { e.stopPropagation(); toggle(selected, i); }}
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-green-500 border-green-500 text-white' : 'border-slate-500 hover:border-orange-400'}`}>
                              <AnimatePresence mode="wait">
                                {isChecked && (
                                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-xs font-bold">✓</motion.span>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Adaptive note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-5 bg-slate-800/40 border border-slate-700/50 rounded-xl px-5 py-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-orange-400 text-xs font-bold">i</span>
          </div>
          <p className="text-slate-400 text-sm">
            This plan is <span className="text-orange-400 font-semibold">adaptive</span> — it adjusts sets, reps, and exercises based on your fitness level and equipment.
            Update your <Link to="/premium/settings" className="text-orange-400 hover:underline">preferences</Link> anytime to regenerate.
          </p>
        </motion.div>

        <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      </div>
    </PageWrapper>
  );
}
