import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flame, Dumbbell, ArrowLeft, AlertCircle, Zap, Swords, Shield, CircleDot } from 'lucide-react';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import ExerciseModal from '../components/ExerciseModal';
import AnimatedButton from '../components/AnimatedButton';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const todayName = days[new Date().getDay()];
const todayDate = new Date().toISOString().split('T')[0];
const STORAGE_KEY = `workout_checks_${todayDate}`;

const MUSCLE_GROUPS = [
  { key: 'abs',   label: 'Abs',         icon: <Flame className="w-6 h-6" />, color: 'from-orange-500 to-red-500',    desc: 'Core & Midsection' },
  { key: 'chest', label: 'Chest',       icon: <Shield className="w-6 h-6" />, color: 'from-cyan-500 to-blue-500',   desc: 'Pectorals' },
  { key: 'legs',  label: 'Legs',        icon: <Zap className="w-6 h-6" />, color: 'from-emerald-500 to-green-500', desc: 'Quads, Hamstrings & Calves' },
  { key: 'arms',  label: 'Full Arms',   icon: <Dumbbell className="w-6 h-6" />, color: 'from-violet-500 to-purple-500', desc: 'Shoulders, Biceps & Triceps' },
  { key: 'back',  label: 'Wider Back',  icon: <Swords className="w-6 h-6" />, color: 'from-amber-500 to-orange-500', desc: 'Lats, Traps & Rhomboids' },
];

// XP bar component
function XpBar({ completed, total, label = 'SESSION XP' }) {
  const xpPerExercise = 50;
  const currentXp = completed * xpPerExercise;
  const maxXp = total * xpPerExercise;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const level = Math.floor(currentXp / 100) + 1;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-mono font-bold text-sm">{currentXp}/{maxXp} XP</span>
          <span className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded">LVL {level}</span>
        </div>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-slate-600 text-xs font-mono">{completed}/{total} exercises</span>
        <span className="text-slate-600 text-xs font-mono">{pct}%</span>
      </div>
    </motion.div>
  );
}

export default function Workout() {
  const [mode, setMode] = useState('weekly');
  const [plan, setPlan] = useState([]);
  const [selected, setSelected] = useState(todayName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  });
  const [selectedExercise, setSelectedExercise] = useState(null);

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

  const muscleCheckedCount = Object.values(muscleChecked).filter(Boolean).length;
  const muscleTotal = muscleData?.exercises?.length || 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 bg-[#030712]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      <p className="text-slate-500 text-sm font-mono">Loading workout plan...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-4 bg-[#030712]">
      <AlertCircle className="w-12 h-12 text-slate-600" />
      <p className="text-white font-semibold">Could not load workout plan</p>
      <p className="text-slate-400 text-sm text-center">{error}</p>
      <AnimatedButton onClick={fetchPlan} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold">
        Try Again
      </AnimatedButton>
    </div>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#030712] relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.06] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 py-8">

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-7 h-7 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Workout Plans</h1>
          </div>
          <p className="text-slate-500 mt-1 font-mono text-sm">Choose your weekly plan or train a specific muscle group</p>
        </motion.div>

        {/* Mode Switcher */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 bg-slate-900/60 border border-slate-800/50 p-1 rounded-xl w-fit">
          {[
            { key: 'weekly', label: 'Weekly Plan', icon: <CircleDot className="w-4 h-4" /> },
            { key: 'muscle', label: 'Muscle Focus', icon: <Target className="w-4 h-4" /> },
          ].map(m => (
            <button key={m.key} onClick={() => setMode(m.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${mode === m.key ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}>
              {m.icon} {m.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === 'weekly' && (
            <motion.div key="weekly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              <div className="flex gap-2 flex-wrap mb-6">
                {plan.map((d, i) => (
                  <motion.button key={d.day}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelected(d.day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected === d.day ? 'bg-cyan-500 text-slate-900 font-bold' : d.day === todayName ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-slate-900/60 border border-slate-800/50 text-slate-300 hover:bg-slate-800'}`}>
                    {d.day.slice(0, 3)}
                    {d.day === todayName && <span className="ml-1 text-xs">*</span>}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {current && (
                  <motion.div key={selected}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">

                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-white">{current.day}</h2>
                        <p className="text-cyan-400 font-medium">{current.focus}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {selected === todayName && current.focus !== 'Rest Day' && (
                          <span className="text-sm text-slate-400 font-mono">
                            <span className="text-cyan-400 font-bold">{currentChecks}</span>/{total}
                          </span>
                        )}
                        {current.day === todayName && (
                          <span className="bg-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-500/30 font-mono">Today</span>
                        )}
                      </div>
                    </div>

                    {/* XP BAR for today */}
                    {selected === todayName && current.focus !== 'Rest Day' && (
                      <XpBar completed={currentChecks} total={total} label="TODAY'S SESSION XP" />
                    )}

                    {current.focus === 'Rest Day' ? (
                      <div className="text-center py-10">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                          <Shield className="w-14 h-14 text-slate-600 mx-auto mb-3" />
                        </motion.div>
                        <p className="text-slate-300 font-medium text-lg">Rest & Recover</p>
                        <p className="text-slate-500 text-sm mt-1">Your muscles grow during rest. Take it easy today.</p>
                      </div>
                    ) : (
                      <ExerciseList exercises={current.exercises} storageKey={selected}
                        checked={checked} onToggle={(i) => toggle(selected, i)}
                        showCheckbox={selected === todayName}
                        onExerciseClick={setSelectedExercise} />
                    )}

                    <AnimatePresence>
                      {selected === todayName && currentChecks === total && total > 0 && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 text-sm font-medium text-center">
                          All exercises completed. Incredible work.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {mode === 'muscle' && (
            <motion.div key="muscle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              {!selectedMuscle ? (
                <div>
                  <p className="text-slate-500 text-sm mb-5 font-mono">Select a muscle group to get a dedicated workout plan:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MUSCLE_GROUPS.map((mg, i) => (
                      <motion.button key={mg.key}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => selectMuscle(mg.key)}
                        className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 text-left transition-all hover:border-cyan-500/40 group">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mg.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                          {mg.icon}
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors">{mg.label}</h3>
                        <p className="text-slate-400 text-sm">{mg.desc}</p>
                        <div className="mt-4 flex items-center gap-1 text-cyan-400 text-xs font-mono">
                          <span>Start Training</span>
                          <span>&gt;</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <button onClick={() => { setSelectedMuscle(null); setMuscleData(null); setMuscleChecked({}); }}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Muscle Groups
                  </button>

                  {muscleLoading ? (
                    <div className="flex items-center justify-center h-48 gap-3">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full" />
                      <p className="text-slate-500 text-sm font-mono">Loading workout...</p>
                    </div>
                  ) : muscleData && (
                    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${MUSCLE_GROUPS.find(m => m.key === selectedMuscle)?.color} flex items-center justify-center text-white`}>
                              {MUSCLE_GROUPS.find(m => m.key === selectedMuscle)?.icon}
                            </div>
                            <h2 className="text-xl font-bold text-white">{muscleData.label} Workout</h2>
                          </div>
                          <p className="text-slate-400 text-sm">{muscleData.description}</p>
                        </div>
                        <span className="text-slate-400 text-sm font-mono">
                          <span className="text-cyan-400 font-bold">{muscleCheckedCount}</span>/{muscleTotal}
                        </span>
                      </div>

                      {/* XP BAR for muscle focus */}
                      <XpBar completed={muscleCheckedCount} total={muscleTotal} label={`${muscleData.label?.toUpperCase()} XP`} />

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

                      <AnimatePresence>
                        {muscleCheckedCount === muscleTotal && muscleTotal > 0 && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 text-sm font-medium text-center">
                            {muscleData.label} workout complete. Beast mode activated.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      </div>
      </div>
    </PageWrapper>
  );
}

function ExerciseList({ exercises, storageKey, checked, onToggle, showCheckbox, onExerciseClick, muscleMode = false, muscleChecked = {} }) {
  return (
    <div className="space-y-3">
      {exercises.map((ex, i) => {
        const isChecked = muscleMode ? !!muscleChecked[i] : !!checked[`${storageKey}_${i}`];
        return (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ x: 3 }}
            className={`flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer transition-all ${isChecked ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-black/30 border border-slate-800/40 hover:bg-slate-800/40'}`}
            onClick={() => onExerciseClick(ex)}>
            <div className="flex items-center gap-3">
              <span className="text-cyan-500 font-bold text-sm w-6 font-mono">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <span className={`font-medium transition-all ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                  {ex.name}
                </span>
                <p className="text-slate-600 text-xs mt-0.5">Tap for details & tips</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-500 hidden sm:block font-mono">{ex.sets} sets</span>
              <span className="text-cyan-400 font-medium font-mono">{ex.reps} reps</span>
              {showCheckbox && (
                <motion.button whileTap={{ scale: 0.85 }}
                  onClick={e => { e.stopPropagation(); onToggle(i); }}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 hover:border-cyan-400'}`}>
                  <AnimatePresence mode="wait">
                    {isChecked && (
                      <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-xs font-bold">&#10003;</motion.span>
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
