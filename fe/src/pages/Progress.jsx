import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress').then(r => { setEntries(r.data); setLoading(false); });
  }, []);

  const completed = entries.filter(e => e.workoutCompleted).length;
  const weights = entries.filter(e => e.weight).map(e => e.weight);
  const minW = weights.length ? Math.min(...weights) : 0;
  const maxW = weights.length ? Math.max(...weights) : 0;
  const latest = weights[0] || 0;

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading progress...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Your Progress 📈</h1>
      <p className="text-slate-400 mb-6">Last 30 days tracking</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Current Weight', value: latest ? `${latest} kg` : '—', color: 'text-orange-400' },
          { label: 'Workouts Done', value: completed, color: 'text-green-400' },
          { label: 'Weight Range', value: weights.length > 1 ? `${minW}–${maxW} kg` : '—', color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-800 rounded-xl p-5 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-slate-400 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Weight Chart (simple bar) */}
      {weights.length > 1 && (
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Weight Trend</h2>
          <div className="flex items-end gap-1 h-24">
            {[...entries].reverse().filter(e => e.weight).slice(-14).map((e, i) => {
              const range = maxW - minW || 1;
              const h = ((e.weight - minW) / range) * 80 + 10;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="bg-orange-500 rounded-t w-full transition-all" style={{ height: `${h}%` }} title={`${e.weight} kg`} />
                  <span className="text-slate-600 text-xs">{e.date?.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Log Table */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-white font-semibold">Activity Log</h2>
        </div>
        {entries.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No logs yet. Start logging from the Dashboard!</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {entries.map((e, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3">
                <span className="text-slate-400 text-sm">{e.date}</span>
                <span className="text-white text-sm">{e.weight ? `${e.weight} kg` : '—'}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${e.workoutCompleted ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                  {e.workoutCompleted ? '✅ Workout Done' : '⏳ Skipped'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
