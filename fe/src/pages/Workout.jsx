import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import ExerciseModal from '../components/ExerciseModal';
import AnimatedButton from '../components/AnimatedButton';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const todayName = days[new Date().getDay()];
const todayDate = new Date().toISOString().split('T')[0];
const STORAGE_KEY = `workout_checks_${todayDate}`;

const MUSCLE_GROUPS = [
  { key: 'abs',   label: 'Abs',         icon: '🔥', color: 'from-orange-500 to-red-500',    desc: 'Core & Midsection' },
  { key: 'chest', label: 'Chest',       icon: '💪', color: 'from-blue-500 to-indigo-500',   desc: 'Pectorals' },
  { key: 'legs',  label: 'Legs',        icon: '🦵', color: 'from-green-500 to-emerald-500', desc: 'Quads, Hamstrings & Calves' },
  { key: 'arms',  label: 'Full Arms',   icon: '💪', color: 'from-purple-500 to-violet-500', desc: 'Shoulders, Biceps & Triceps' },
  { key: 'back',  label: 'Wider Back',  icon: '🏋️', color: 'from-yellow-500 to-orange-500', desc: 'Lats, Traps & Rhomboids' },
];

export default function Workout() {
  const [mode, setMode] = useState('weekly'); // 'weekly' | 'muscle'
  const [plan, setPlan] = useState([]);
  const [selected, setSelected] = useState(todayName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  });
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Muscle focus state
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [muscleData, setMuscleData] = useState(null);
  const [muscleLoading, setMuscleLoading] = useState(false);
  const [muscleChecked, setMuscleChecked] = useState({});

  const fetchPlan = () => {
    setLoading(true); setError('');
    api.get('/workout')
      .then(r => { setPlan(r.data.plan); setLoading(false); })
      .catch(() => { setError('Failed to load workout plan. Please try again.'); setLoading(false); });
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('workout_checks_') && key !== STORAGE_KEY)
        localStorage.removeItem(key);
    });
  };

  useEffect(() => { fetchPlan(); }, []);

  const selectMuscle = (key) => {
    setSelectedMuscle(key);
    setMuscleData(null);
    setMuscleChecked({});
    setMuscleLoading(true);
    api.get(`/workout/muscles/${key}`)
      .then(r => { setMuscleData(r.data); setMuscleLoading(false); })
      .catch(() => setMuscleLoading(false));
  };

  const toggleMuscle = (index) => {
    setMuscleChecked(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggle = (day, index) => {
    const key = `${day}_${index}`;
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const current = plan.find(d => d.day === selected);
  const currentChecks = current?.exercises.filter((_, i) => checked[`${selected}_${i}`]).length || 0;
  const total = current?.exercises.length || 0;
  const pct = total ? Math.round((currentChecks / total) * 100) : 0;

  const muscleCheckedCount = Object.values(muscleChecked).filter(Boolean).length;
  const muscleTotal = muscleData?.exercises?.length || 0;
  const musclePct = muscleTotal ? Math.round((muscleCheckedCount / muscleTotal) * 100) : 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      <p className="text-slate-500 text-sm">Loading your workout plan...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-4">
      <div className="text-5xl">😕</div>
      <p className="text-white font-semibold">Could not load workout plan</p>
      <p className="text-slate-400 text-sm text-center">{error}</p>
      <AnimatedButton onClick={fetchPlan} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium">
        Try Again
      </AnimatedButton>
    </div>
  );

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-white">Workout Plans 🏋️</h1>
          <p className="text-slate-400 mt-1">Choose your weekly plan or train a specific muscle group</p>
        </motion.div>

        {/* Mode Switcher */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 bg-slate-800 p-1 rounded-xl w-fit">
          {[
            { key: 'weekly', label: '📅 Weekly Plan' },
            { key: 'muscle', label: '🎯 Muscle Focus' },
          ].map(m => (
            <button key={m.key} onClick={() => setMode(m.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === m.key ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'}`}>
              {m.label}
            </button>
          ))}
        </motion.div>

        {/* ── WEEKLY PLAN MODE ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          {mode === 'weekly' && (
            <motion.div key="weekly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              {/* Day Tabs */}
              <div className="flex gap-2 flex-wrap mb-6">
                {plan.map((d, i) => (
                  <motion.button key={d.day}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelected(d.day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected === d.day ? 'bg-orange-500 text-white' : d.day === todayName ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {d.day.slice(0, 3)}
                    {d.day === todayName && <span className="ml-1 text-xs">•</span>}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {current && (
                  <motion.div key={selected}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-800 rounded-2xl p-6">

                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-white">{current.day}</h2>
                        <p className="text-orange-400 font-medium">{current.focus}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {selected === todayName && current.focus !== 'Rest Day' && (
                          <span className="text-sm text-slate-400">
                            <span className="text-orange-400 font-bold">{currentChecks}</span>/{total}
                          </span>
                        )}
                        {current.day === todayName && (
                          <span className="bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/30">Today</span>
                        )}
                      </div>
                    </div>

                    {selected === todayName && current.focus !== 'Rest Day' && (
                      <div className="mb-5">
                        <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                          <motion.div className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }} />
                        </div>
                        <AnimatePresence>
                          {currentChecks === total && total > 0 && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="text-green-400 text-sm mt-2 font-medium">
                              🎉 All exercises completed! Incredible work!
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {current.focus === 'Rest Day' ? (
                      <div className="text-center py-10">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl mb-3">😴</motion.div>
                        <p className="text-slate-300 font-medium text-lg">Rest & Recover</p>
                        <p className="text-slate-500 text-sm mt-1">Your muscles grow during rest. Take it easy today!</p>
                      </div>
                    ) : (
                      <ExerciseList exercises={current.exercises} storageKey={selected}
                        checked={checked} onToggle={(i) => toggle(selected, i)}
                        showCheckbox={selected === todayName}
                        onExerciseClick={setSelectedExercise} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── MUSCLE FOCUS MODE ──────────────────────────── */}
          {mode === 'muscle' && (
            <motion.div key="muscle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              {!selectedMuscle ? (
                // Muscle group selector cards
                <div>
                  <p className="text-slate-400 text-sm mb-5">Select a muscle group to get a dedicated workout plan:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MUSCLE_GROUPS.map((mg, i) => (
                      <motion.button key={mg.key}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => selectMuscle(mg.key)}
                        className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-left transition-all hover:border-orange-500/40 group">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mg.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                          {mg.icon}
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-orange-400 transition-colors">{mg.label}</h3>
                        <p className="text-slate-400 text-sm">{mg.desc}</p>
                        <div className="mt-4 flex items-center gap-1 text-orange-400 text-xs font-medium">
                          <span>Start Training</span>
                          <span>→</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                // Muscle workout detail
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  {/* Back button */}
                  <button onClick={() => { setSelectedMuscle(null); setMuscleData(null); setMuscleChecked({}); }}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Muscle Groups
                  </button>

                  {muscleLoading ? (
                    <div className="flex items-center justify-center h-48 gap-3">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full" />
                      <p className="text-slate-500 text-sm">Loading workout...</p>
                    </div>
                  ) : muscleData && (
                    <div className="bg-slate-800 rounded-2xl p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${MUSCLE_GROUPS.find(m => m.key === selectedMuscle)?.color} flex items-center justify-center text-xl`}>
                              {MUSCLE_GROUPS.find(m => m.key === selectedMuscle)?.icon}
                            </div>
                            <h2 className="text-xl font-bold text-white">{muscleData.label} Workout</h2>
                          </div>
                          <p className="text-slate-400 text-sm">{muscleData.description}</p>
                        </div>
                        <span className="text-slate-400 text-sm">
                          <span className="text-orange-400 font-bold">{muscleCheckedCount}</span>/{muscleTotal}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-5">
                        <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                          <motion.div className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                            initial={{ width: 0 }} animate={{ width: `${musclePct}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }} />
                        </div>
                        <AnimatePresence>
                          {muscleCheckedCount === muscleTotal && muscleTotal > 0 && (
                            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="text-green-400 text-sm mt-2 font-medium">
                              🎉 {muscleData.label} workout complete! Beast mode activated! 🔥
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Exercise list */}
                      <ExerciseList
                        exercises={muscleData.exercises}
                        storageKey={`muscle_${selectedMuscle}`}
                        checked={Object.fromEntries(Object.entries(muscleChecked).map(([k, v]) => [`muscle_${selectedMuscle}_${k}`, v]))}
                        onToggle={toggleMuscle}
                        showCheckbox={true}
                        onExerciseClick={setSelectedExercise}
                        muscleMode={true}
                        muscleChecked={muscleChecked}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      </div>
    </PageWrapper>
  );
}

// ── Shared exercise list component ───────────────────────────
function ExerciseList({ exercises, storageKey, checked, onToggle, showCheckbox, onExerciseClick, muscleMode = false, muscleChecked = {} }) {
  return (
    <div className="space-y-3">
      {exercises.map((ex, i) => {
        const isChecked = muscleMode ? !!muscleChecked[i] : !!checked[`${storageKey}_${i}`];
        return (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ x: 3 }}
            className={`flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer transition-all ${isChecked ? 'bg-green-500/10 border border-green-500/30' : 'bg-slate-700/50 hover:bg-slate-700'}`}
            onClick={() => onExerciseClick(ex)}>
            <div className="flex items-center gap-3">
              <span className="text-orange-500 font-bold text-sm w-6">{i + 1}</span>
              <div>
                <span className={`font-medium transition-all ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                  {ex.name}
                </span>
                <p className="text-slate-500 text-xs mt-0.5">Tap for details & tips</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-400 hidden sm:block">{ex.sets} sets</span>
              <span className="text-orange-400 font-medium">{ex.reps} reps</span>
              {showCheckbox && (
                <motion.button whileTap={{ scale: 0.85 }}
                  onClick={e => { e.stopPropagation(); onToggle(i); }}
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
  );
}
