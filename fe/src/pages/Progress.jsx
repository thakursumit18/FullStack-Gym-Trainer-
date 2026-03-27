import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import api from '../api/axios';

const today = new Date().toISOString().split('T')[0];
const moodEmoji = { great: '🔥', good: '😊', okay: '😐', tired: '😴', bad: '😞' };
const moodColor = { great: 'text-orange-400', good: 'text-green-400', okay: 'text-yellow-400', tired: 'text-blue-400', bad: 'text-red-400' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}{p.unit || ''}</p>
      ))}
    </div>
  );
};

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({ weight: '', bodyFat: '', chest: '', waist: '', hips: '', mood: 'good', notes: '', workoutCompleted: false, date: today });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/progress').then(r => {
      setEntries(r.data);
      const todayEntry = r.data.find(e => e.date === today);
      if (todayEntry) setForm(f => ({ ...f, weight: todayEntry.weight || '', bodyFat: todayEntry.bodyFat || '', chest: todayEntry.chest || '', waist: todayEntry.waist || '', hips: todayEntry.hips || '', mood: todayEntry.mood || 'good', notes: todayEntry.notes || '', workoutCompleted: todayEntry.workoutCompleted || false }));
      setLoading(false);
    });
  }, []);

  const chartData = entries.map(e => ({
    date: e.date?.slice(5),
    Weight: e.weight || null,
    'Body Fat': e.bodyFat || null,
    Chest: e.chest || null,
    Waist: e.waist || null,
    Hips: e.hips || null,
    workout: e.workoutCompleted ? 1 : 0,
  }));

  const weights = entries.filter(e => e.weight).map(e => e.weight);
  const latest = weights[weights.length - 1] || 0;
  const first = weights[0] || 0;
  const weightChange = latest && first ? (latest - first).toFixed(1) : null;
  const totalWorkouts = entries.filter(e => e.workoutCompleted).length;
  const streak = (() => {
    let s = 0;
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    for (const e of sorted) { if (e.workoutCompleted) s++; else break; }
    return s;
  })();
  const consistency = entries.length ? Math.round((totalWorkouts / entries.length) * 100) : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, weight: Number(form.weight) || undefined, bodyFat: Number(form.bodyFat) || undefined, chest: Number(form.chest) || undefined, waist: Number(form.waist) || undefined, hips: Number(form.hips) || undefined };
      const { data } = await api.post('/progress', payload);
      setEntries(prev => { const filtered = prev.filter(e => e.date !== today); return [...filtered, data].sort((a, b) => a.date.localeCompare(b.date)); });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-slate-400">Loading progress...</div>;

  const tabs = ['overview', 'body', 'workouts', 'log'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Progress Tracker 📈</h1>
        <p className="text-slate-400 mt-1">Track your fitness journey over time</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Current Weight', value: latest ? `${latest} kg` : '—', sub: weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange} kg total` : 'No data yet', color: 'orange', icon: '⚖️' },
          { label: 'Workouts Done', value: totalWorkouts, sub: `${consistency}% consistency`, color: 'green', icon: '🏋️' },
          { label: 'Current Streak', value: `${streak} days`, sub: streak > 0 ? 'Keep it up!' : 'Start today!', color: 'blue', icon: '🔥' },
          { label: 'Days Logged', value: entries.length, sub: 'Total entries', color: 'purple', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="bg-slate-800 rounded-2xl p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</div>
            <div className="text-slate-300 text-xs font-medium mt-0.5">{s.label}</div>
            <div className="text-slate-500 text-xs mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-800 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === t ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t === 'log' ? '+ Log Today' : t}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Weight Chart */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Weight Over Time</h2>
            <p className="text-slate-500 text-xs mb-5">kg — last 60 days</p>
            {weights.length < 2 ? (
              <div className="text-center py-10 text-slate-500">Log at least 2 weight entries to see the chart</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 11 }} unit=" kg" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Weight" stroke="#f97316" strokeWidth={2.5} fill="url(#wGrad)" dot={{ fill: '#f97316', r: 3 }} connectNulls unit=" kg" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Workout Consistency Bar Chart */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Workout Consistency</h2>
            <p className="text-slate-500 text-xs mb-5">1 = completed, 0 = skipped</p>
            {entries.length < 2 ? (
              <div className="text-center py-10 text-slate-500">Log workouts to see consistency chart</div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="workout" name="Workout" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* BODY TAB */}
      {activeTab === 'body' && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Body Measurements</h2>
            <p className="text-slate-500 text-xs mb-5">Chest, Waist, Hips in cm</p>
            {entries.filter(e => e.chest || e.waist || e.hips).length < 2 ? (
              <div className="text-center py-10 text-slate-500">Log body measurements to see this chart</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 11 }} unit=" cm" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                  <Line type="monotone" dataKey="Chest" stroke="#f97316" strokeWidth={2} dot={false} connectNulls unit=" cm" />
                  <Line type="monotone" dataKey="Waist" stroke="#3b82f6" strokeWidth={2} dot={false} connectNulls unit=" cm" />
                  <Line type="monotone" dataKey="Hips" stroke="#a855f7" strokeWidth={2} dot={false} connectNulls unit=" cm" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Body Fat %</h2>
            <p className="text-slate-500 text-xs mb-5">Estimated body fat percentage</p>
            {entries.filter(e => e.bodyFat).length < 2 ? (
              <div className="text-center py-10 text-slate-500">Log body fat % to see this chart</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Body Fat" stroke="#3b82f6" strokeWidth={2.5} fill="url(#bfGrad)" dot={{ fill: '#3b82f6', r: 3 }} connectNulls unit="%" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* WORKOUTS TAB */}
      {activeTab === 'workouts' && (
        <div className="space-y-6">
          {/* Mood breakdown */}
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(moodEmoji).map(([mood, emoji]) => {
              const count = entries.filter(e => e.mood === mood).length;
              return (
                <div key={mood} className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className={`text-lg font-bold ${moodColor[mood]}`}>{count}</div>
                  <div className="text-slate-500 text-xs capitalize">{mood}</div>
                </div>
              );
            })}
          </div>

          {/* Activity log table */}
          <div className="bg-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-white font-semibold">Activity Log</h2>
              <span className="text-slate-500 text-xs">{entries.length} entries</span>
            </div>
            {entries.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No logs yet. Use the Log tab to start!</div>
            ) : (
              <div className="divide-y divide-slate-700/50 max-h-96 overflow-y-auto">
                {[...entries].reverse().map((e, i) => (
                  <div key={i} className="grid grid-cols-5 px-6 py-3 text-sm items-center hover:bg-slate-700/30 transition-colors">
                    <span className="text-slate-400">{e.date}</span>
                    <span className="text-white">{e.weight ? `${e.weight} kg` : '—'}</span>
                    <span className="text-slate-300">{e.bodyFat ? `${e.bodyFat}%` : '—'}</span>
                    <span className={`${moodColor[e.mood] || 'text-slate-500'}`}>{moodEmoji[e.mood] || '—'} {e.mood || '—'}</span>
                    <span className={`text-xs px-2 py-1 rounded-full w-fit ${e.workoutCompleted ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                      {e.workoutCompleted ? '✅ Done' : '⏳ Skipped'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOG TAB */}
      {activeTab === 'log' && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Log Today's Data</h2>
          <p className="text-slate-500 text-xs mb-6">{today}</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left col */}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Weight (kg)</label>
                <input type="number" step="0.1" placeholder="e.g. 72.5" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Body Fat %</label>
                <input type="number" step="0.1" placeholder="e.g. 18.5" value={form.bodyFat} onChange={e => setForm(f => ({ ...f, bodyFat: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Chest (cm)</label>
                <input type="number" step="0.5" placeholder="e.g. 95" value={form.chest} onChange={e => setForm(f => ({ ...f, chest: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Waist (cm)</label>
                <input type="number" step="0.5" placeholder="e.g. 80" value={form.waist} onChange={e => setForm(f => ({ ...f, waist: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Hips (cm)</label>
                <input type="number" step="0.5" placeholder="e.g. 95" value={form.hips} onChange={e => setForm(f => ({ ...f, hips: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">How do you feel today?</label>
                <div className="flex gap-2">
                  {Object.entries(moodEmoji).map(([mood, emoji]) => (
                    <button key={mood} onClick={() => setForm(f => ({ ...f, mood }))}
                      className={`flex-1 py-2 rounded-lg text-lg transition-all ${form.mood === mood ? 'bg-orange-500/30 ring-2 ring-orange-500' : 'bg-slate-700 hover:bg-slate-600'}`}
                      title={mood}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="text-slate-400 text-xs mb-1 block">Notes (optional)</label>
            <textarea rows={2} placeholder="How was your workout? Any pain or achievements?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>

          {/* Workout toggle */}
          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input type="checkbox" checked={form.workoutCompleted} onChange={e => setForm(f => ({ ...f, workoutCompleted: e.target.checked }))}
              className="w-5 h-5 accent-orange-500 rounded" />
            <span className="text-slate-300 font-medium">Workout completed today</span>
          </label>

          <button onClick={handleSave} disabled={saving}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
            {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Today\'s Log'}
          </button>
        </div>
      )}
    </div>
  );
}
