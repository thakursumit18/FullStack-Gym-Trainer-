import { useEffect, useState } from 'react';
import api from '../api/axios';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const todayName = days[new Date().getDay()];
const todayDate = new Date().toISOString().split('T')[0];
const STORAGE_KEY = `workout_checks_${todayDate}`;

export default function Workout() {
  const [plan, setPlan] = useState([]);
  const [selected, setSelected] = useState(todayName);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  });

  useEffect(() => {
    api.get('/workout').then(r => { setPlan(r.data.plan); setLoading(false); });
    // Clear old day keys from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('workout_checks_') && key !== STORAGE_KEY)
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
  const currentChecks = current?.exercises.filter((_, i) => checked[`${selected}_${i}`]).length || 0;
  const total = current?.exercises.length || 0;

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading workout plan...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Weekly Workout Plan 🏋️</h1>
      <p className="text-slate-400 mb-6">Personalized based on your goal</p>

      {/* Day Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {plan.map(d => (
          <button key={d.day} onClick={() => setSelected(d.day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected === d.day ? 'bg-orange-500 text-white' : d.day === todayName ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
            {d.day.slice(0, 3)}
            {d.day === todayName && <span className="ml-1 text-xs">•</span>}
          </button>
        ))}
      </div>

      {current && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{current.day}</h2>
              <p className="text-orange-400 font-medium">{current.focus}</p>
            </div>
            <div className="flex items-center gap-3">
              {selected === todayName && current.focus !== 'Rest Day' && (
                <span className="text-sm text-slate-400">
                  <span className="text-orange-400 font-bold">{currentChecks}</span>/{total} done
                </span>
              )}
              {current.day === todayName && (
                <span className="bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/30">Today</span>
              )}
            </div>
          </div>

          {/* Progress bar for today */}
          {selected === todayName && current.focus !== 'Rest Day' && (
            <div className="mb-5">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${total ? (currentChecks / total) * 100 : 0}%` }}
                />
              </div>
              {currentChecks === total && total > 0 && (
                <p className="text-green-400 text-sm mt-2 font-medium">🎉 All exercises completed! Great work!</p>
              )}
            </div>
          )}

          {current.focus === 'Rest Day' ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">😴</div>
              <p className="text-slate-300 font-medium">Rest & Recover</p>
              <p className="text-slate-500 text-sm mt-1">Your muscles grow during rest. Take it easy today!</p>
              {current.exercises.map((ex, i) => (
                <p key={i} className="text-slate-400 text-sm mt-2">{ex.name}</p>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {current.exercises.map((ex, i) => {
                const isChecked = !!checked[`${selected}_${i}`];
                const isToday = selected === todayName;
                return (
                  <div key={i}
                    className={`flex items-center justify-between rounded-xl px-5 py-4 transition-all ${isChecked ? 'bg-green-500/10 border border-green-500/30' : 'bg-slate-700/50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500 font-bold text-sm w-6">{i + 1}</span>
                      <span className={`font-medium transition-all ${isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                        {ex.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">{ex.sets} sets</span>
                      <span className="text-orange-400 font-medium">{ex.reps} reps</span>
                      {isToday && (
                        <button
                          onClick={() => toggle(selected, i)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-green-500 border-green-500 text-white' : 'border-slate-500 hover:border-orange-400'}`}>
                          {isChecked && <span className="text-xs">✓</span>}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
