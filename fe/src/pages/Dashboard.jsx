import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Trophy, CalendarCheck, Zap, Flame, AlertCircle, Dumbbell, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import StreakCard from '../components/StreakCard';
import GoalProgress from '../components/GoalProgress';
import SmartMessage from '../components/SmartMessage';
import AnimatedButton from '../components/AnimatedButton';

const goalLabel = { lose_fat: 'Lose Fat', gain_muscle: 'Gain Muscle', maintain: 'Maintain' };

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' } }),
};

function Spinner() {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [diet, setDiet] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const fetchData = () => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/workout'),
      api.get('/diet'),
      api.get('/progress'),
    ]).then(([w, d, p]) => {
      setWorkout(w.data.todayWorkout);
      setDiet(d.data);
      setProgress(p.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load dashboard. Please check your connection.');
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const todayLog = progress.find(p => p.date === today);
  const totalWorkouts = progress.filter(p => p.workoutCompleted).length;
  const isNewUser = progress.length === 0;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 bg-[#030712]">
      <Spinner />
      <p className="text-slate-500 text-sm font-mono">Loading dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-4 bg-[#030712]">
      <AlertCircle className="w-12 h-12 text-slate-600" />
      <p className="text-white font-semibold text-lg">Something went wrong</p>
      <p className="text-slate-400 text-sm text-center">{error}</p>
      <AnimatedButton onClick={fetchData} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold">
        Try Again
      </AnimatedButton>
    </div>
  );

  const statIcons = [
    <Scale className="w-5 h-5 text-cyan-400" />,
    <Trophy className="w-5 h-5 text-emerald-400" />,
    <CalendarCheck className="w-5 h-5 text-violet-400" />,
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#030712] relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.06] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 py-8">

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Hey, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1 font-mono text-sm">Goal: <span className="text-cyan-400 font-medium">{goalLabel[user?.goal]}</span></p>
        </motion.div>

        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="mb-5">
          <SmartMessage entries={progress} user={user} />
        </motion.div>

        {isNewUser && (
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
            className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 mb-6 text-center">
            <Zap className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
            <h2 className="text-white font-semibold mb-1">System Initialized</h2>
            <p className="text-slate-400 text-sm mb-4">Start your first workout and log your progress to unlock charts and streaks.</p>
            <div className="flex justify-center gap-3">
              <Link to="/workout">
                <AnimatedButton className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> Start Workout
                </AnimatedButton>
              </Link>
              <Link to="/progress">
                <AnimatedButton className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
                  Log Progress
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        )}

        {!isNewUser && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <StreakCard entries={progress} />
            </motion.div>
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
              <GoalProgress entries={progress} />
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Current Weight', value: todayLog?.weight ? `${todayLog.weight} kg` : user?.weight ? `${user.weight} kg` : '--', icon: statIcons[0], color: 'text-cyan-400' },
            { label: 'Workouts Done', value: totalWorkouts, icon: statIcons[1], color: 'text-emerald-400' },
            { label: 'Today', value: todayLog?.workoutCompleted ? 'Complete' : 'Pending', icon: statIcons[2], color: todayLog?.workoutCompleted ? 'text-emerald-400' : 'text-slate-400' },
          ].map((s, i) => (
            <motion.div key={s.label} custom={i + 3} variants={cardVariants} initial="hidden" animate="visible"
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
              className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4 text-center cursor-default transition-shadow">
              <div className="mb-2 flex justify-center">{s.icon}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-500 text-xs mt-1 font-mono uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible"
            whileHover={{ y: -2 }} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 transition-shadow hover:shadow-xl hover:shadow-cyan-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Today's Workout</h2>
              </div>
              <Link to="/workout" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">View all</Link>
            </div>
            {workout ? (
              <>
                <div className="text-cyan-400 font-medium mb-3">{workout.day} -- {workout.focus}</div>
                {workout.focus === 'Rest Day' ? (
                  <p className="text-slate-400 text-sm">Rest day -- recover and come back stronger.</p>
                ) : (
                  <div className="space-y-2">
                    {workout.exercises.slice(0, 4).map((ex, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-300">{ex.name}</span>
                        <span className="text-slate-500 font-mono">{ex.sets}x{ex.reps}</span>
                      </div>
                    ))}
                    {workout.exercises.length > 4 && <p className="text-slate-600 text-xs">+{workout.exercises.length - 4} more exercises</p>}
                  </div>
                )}
                <Link to="/workout">
                  <AnimatedButton className="mt-4 w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2 rounded-lg text-sm font-medium transition-colors">
                    Start Workout
                  </AnimatedButton>
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm">Workout plan unavailable.</p>
                <Link to="/workout" className="text-cyan-400 text-xs hover:underline mt-1 block">Go to Workout page</Link>
              </div>
            )}
          </motion.div>

          <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible"
            whileHover={{ y: -2 }} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 transition-shadow hover:shadow-xl hover:shadow-violet-500/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-semibold text-white">Today's Diet</h2>
              </div>
              <Link to="/diet" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">View all</Link>
            </div>
            {diet ? (
              <>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2.5 text-center">
                    <div className="text-cyan-400 font-bold text-lg">{diet.calories}</div>
                    <div className="text-slate-500 text-xs font-mono">Calories</div>
                  </div>
                  <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                    <div className="text-emerald-400 font-bold text-lg">{diet.protein}g</div>
                    <div className="text-slate-500 text-xs font-mono">Protein</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(diet.meals).map(([key, meal]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-300 capitalize">{key}</span>
                      <span className="text-slate-500 font-mono">{meal.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm">Diet plan unavailable.</p>
                <Link to="/diet" className="text-cyan-400 text-xs hover:underline mt-1 block">Go to Diet page</Link>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible" className="mt-6 bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Quick Log -- Today</h2>
            <Link to="/progress" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">Full tracker</Link>
          </div>
          <QuickLog
            todayLog={todayLog}
            today={today}
            onUpdate={entry => setProgress(p => [...p.filter(x => x.date !== today), entry])}
          />
        </motion.div>

      </div>
      </div>
    </PageWrapper>
  );
}

function QuickLog({ todayLog, today, onUpdate }) {
  const [weight, setWeight] = useState(todayLog?.weight || '');
  const [done, setDone] = useState(todayLog?.workoutCompleted || false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const save = async () => {
    setSaving(true); setSaveError('');
    try {
      const { data } = await api.post('/progress', { weight: Number(weight) || undefined, workoutCompleted: done, date: today });
      onUpdate(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { setSaveError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <input type="number" step="0.1" placeholder="Weight (kg)" value={weight}
          onChange={e => setWeight(e.target.value)}
          className="bg-black/40 border border-slate-800/60 rounded-lg px-4 py-2 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 w-40 text-sm" />
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
          <input type="checkbox" checked={done} onChange={e => setDone(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
          Workout completed
        </label>
        <AnimatedButton onClick={save} disabled={saving}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 px-5 py-2 rounded-lg text-sm font-bold transition-colors">
          {saved ? 'Saved' : saving ? 'Saving...' : 'Save'}
        </AnimatedButton>
      </div>
      {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
    </div>
  );
}
