import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Admin() {
  const [plans, setPlans] = useState(null);
  const [activeGoal, setActiveGoal] = useState('lose_fat');

  useEffect(() => {
    api.get('/workout/all').then(r => setPlans(r.data));
  }, []);

  if (!plans) return <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Admin Panel 🛠️</h1>
      <p className="text-slate-400 mb-6">Manage workout plans</p>

      <div className="flex gap-3 mb-6">
        {Object.keys(plans).map(goal => (
          <button key={goal} onClick={() => setActiveGoal(goal)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeGoal === goal ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
            {goal.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {plans[activeGoal].map((day, di) => (
          <div key={di} className="bg-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">{day.day} — <span className="text-orange-400">{day.focus}</span></h3>
              <span className="text-slate-500 text-xs">{day.exercises.length} exercises</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {day.exercises.map((ex, ei) => (
                <div key={ei} className="bg-slate-700/50 rounded-lg px-3 py-2 text-sm">
                  <div className="text-slate-200">{ex.name}</div>
                  <div className="text-slate-500 text-xs">{ex.sets}×{ex.reps}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
