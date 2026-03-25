import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const goalLabel = { lose_fat: '🔥 Lose Fat', gain_muscle: '💪 Gain Muscle', maintain: '⚖️ Maintain' };

export default function Dashboard() {
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [diet, setDiet] = useState(null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api.get('/workout').then(r => setWorkout(r.data.todayWorkout));
    api.get('/diet').then(r => setDiet(r.data));
    api.get('/progress').then(r => setProgress(r.data));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayLog = progress.find(p => p.date === today);
  const streak = progress.filter(p => p.workoutCompleted).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Hey, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mt-1">Goal: <span className="text-orange-400 font-medium">{goalLabel[user?.goal]}</span></p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Weight', value: user?.weight ? `${user.weight} kg` : 'Not set', icon: '⚖️' },
          { label: 'Workouts Done', value: streak, icon: '🏆' },
          { label: 'Today', value: todayLog?.workoutCompleted ? '✅ Done' : '⏳ Pending', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-slate-400 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Workout */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Today's Workout</h2>
            <Link to="/workout" className="text-orange-400 text-sm hover:underline">View all →</Link>
          </div>
          {workout ? (
            <>
              <div className="text-orange-400 font-medium mb-3">{workout.day} — {workout.focus}</div>
              <div className="space-y-2">
                {workout.exercises.slice(0, 4).map((ex, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-300">{ex.name}</span>
                    <span className="text-slate-500">{ex.sets}×{ex.reps}</span>
                  </div>
                ))}
                {workout.exercises.length > 4 && <p className="text-slate-500 text-xs">+{workout.exercises.length - 4} more</p>}
              </div>
            </>
          ) : <p className="text-slate-500 text-sm">Loading...</p>}
        </div>

        {/* Today's Diet */}
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Today's Diet</h2>
            <Link to="/diet" className="text-orange-400 text-sm hover:underline">View all →</Link>
          </div>
          {diet ? (
            <>
              <div className="flex gap-4 mb-3">
                <div className="text-center"><div className="text-orange-400 font-bold">{diet.calories}</div><div className="text-slate-500 text-xs">Calories</div></div>
                <div className="text-center"><div className="text-green-400 font-bold">{diet.protein}g</div><div className="text-slate-500 text-xs">Protein</div></div>
              </div>
              <div className="space-y-2">
                {Object.entries(diet.meals).map(([key, meal]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-slate-300 capitalize">{key}</span>
                    <span className="text-slate-500">{meal.calories} kcal</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-slate-500 text-sm">Loading...</p>}
        </div>
      </div>

      {/* Quick Log */}
      <div className="mt-6 bg-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Log — Today</h2>
        <QuickLog todayLog={todayLog} today={today} onUpdate={entry => setProgress(p => [entry, ...p.filter(x => x.date !== today)])} />
      </div>
    </div>
  );
}

function QuickLog({ todayLog, today, onUpdate }) {
  const [weight, setWeight] = useState(todayLog?.weight || '');
  const [done, setDone] = useState(todayLog?.workoutCompleted || false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const { data } = await api.post('/progress', { weight: Number(weight), workoutCompleted: done, date: today });
    onUpdate(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} className="bg-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500 w-40" />
      <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
        <input type="checkbox" checked={done} onChange={e => setDone(e.target.checked)} className="w-4 h-4 accent-orange-500" />
        Workout completed
      </label>
      <button onClick={save} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        {saved ? '✅ Saved!' : 'Save'}
      </button>
    </div>
  );
}
