import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import api from '../api/axios';

const today = new Date().toISOString().split('T')[0];
const moodEmoji = { great: 'PEAK', good: 'GOOD', okay: 'OKAY', tired: 'LOW', bad: 'DOWN' };
const moodColor = { great: 'text-cyan-400', good: 'text-emerald-400', okay: 'text-yellow-400', tired: 'text-blue-400', bad: 'text-red-400' };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1 font-mono text-xs">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}{p.unit || ''}</p>
      ))}
    </div>
  );
};

export default function Progress() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({ weight: '', bodyFat: '', chest: '', waist: '', hips: '', mood: 'good', notes: '', workoutCompleted: false, date: today });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    api.get('/progress')
      .then(r => {
        setEntries(r.data);
        const todayEntry = r.data.find(e => e.date === today);
        if (todayEntry) setForm(f => ({ ...f, weight: todayEntry.weight || '', bodyFat: todayEntry.bodyFat || '', chest: todayEntry.chest || '', waist: todayEntry.waist || '', hips: todayEntry.hips || '', mood: todayEntry.mood || 'good', notes: todayEntry.notes || '', workoutCompleted: todayEntry.workoutCompleted || false }));
        setLoading(false);
      })
      .catch(() => { setError('Failed to load progress data. Please try again.'); setLoading(false); });
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
    setSaveError('');
    try {
      const payload = { ...form, weight: Number(form.weight) || undefined, bodyFat: Number(form.bodyFat) || undefined, chest: Number(form.chest) || undefined, waist: Number(form.waist) || undefined, hips: Number(form.hips) || undefined };
      const { data } = await api.post('/progress', payload);
      setEntries(prev => { const filtered = prev.filter(e => e.date !== today); return [...filtered, data].sort((a, b) => a.date.localeCompare(b.date)); });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { setSaveError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 bg-[#030712]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      <p className="text-slate-500 text-sm font-mono">Loading your progress...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 px-4 bg-[#030712]">
      <p className="text-white font-semibold">Could not load progress</p>
      <p className="text-slate-400 text-sm text-center">{error}</p>
      <button onClick={() => window.location.reload()} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold">Try Again</button>
    </div>
  );

  const tabs = ['overview', 'body', 'workouts', 'log', 'feedback'];

  return (
    <div className="min-h-screen bg-[#030712] relative">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.06] pointer-events-none" />
    <div className="relative max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Progress Tracker</h1>
        <p className="text-slate-500 mt-1 font-mono text-sm">Track your fitness journey over time</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Current Weight', value: latest ? `${latest} kg` : '--', sub: weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange} kg total` : 'No data yet', colorCls: 'text-cyan-400' },
          { label: 'Workouts Done', value: totalWorkouts, sub: `${consistency}% consistency`, colorCls: 'text-emerald-400' },
          { label: 'Current Streak', value: `${streak} days`, sub: streak > 0 ? 'Keep it up' : 'Start today', colorCls: 'text-violet-400' },
          { label: 'Days Logged', value: entries.length, sub: 'Total entries', colorCls: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-5">
            <div className={`text-2xl font-bold ${s.colorCls}`}>{s.value}</div>
            <div className="text-slate-300 text-xs font-medium mt-1 font-mono uppercase tracking-wider">{s.label}</div>
            <div className="text-slate-600 text-xs mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-900/60 border border-slate-800/50 p-1 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors whitespace-nowrap ${activeTab === t ? 'bg-cyan-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'}`}>
            {t === 'log' ? '+ Log' : t === 'feedback' ? 'Feedback' : t}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Weight Chart */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
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
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
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

          {/* BMI Card */}
          <BmiCard user={user} entries={entries} />

          {/* Body Fat Card */}
          <BodyFatCard entries={entries} />

          {/* Body Measurements Chart */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-1">Body Measurements</h2>
            <p className="text-slate-500 text-xs mb-5">Chest, Waist, Hips in cm — log from the Log tab</p>
            {entries.filter(e => e.chest || e.waist || e.hips).length < 2 ? (
              <div className="text-center py-10">
                <div className="text-3xl mb-2">📏</div>
                <p className="text-slate-500 text-sm">Log chest, waist & hips in the Log tab to see this chart</p>
              </div>
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
        </div>
      )}

      {/* WORKOUTS TAB */}
      {activeTab === 'workouts' && (
        <div className="space-y-6">
          {/* Mood breakdown */}
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(moodEmoji).map(([mood, emoji]) => {
              const count = entries.filter(e => e.mood === mood).length;
              return (
                <div key={mood} className="bg-slate-800 rounded-xl p-2 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl mb-1">{emoji}</div>
                  <div className={`text-base sm:text-lg font-bold ${moodColor[mood]}`}>{count}</div>
                  <div className="text-slate-500 text-xs capitalize hidden sm:block">{mood}</div>
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
                  <div key={i} className="flex flex-col sm:grid sm:grid-cols-5 px-4 sm:px-6 py-3 text-sm gap-1 sm:gap-0 sm:items-center hover:bg-slate-700/30 transition-colors">
                    <span className="text-slate-400 text-xs sm:text-sm">{e.date}</span>
                    <span className="text-white text-xs sm:text-sm">{e.weight ? `${e.weight} kg` : '—'}</span>
                    <span className="text-slate-300 text-xs sm:text-sm hidden sm:block">{e.bodyFat ? `${e.bodyFat}%` : '—'}</span>
                    <span className={`text-xs sm:text-sm hidden sm:block ${moodColor[e.mood] || 'text-slate-500'}`}>{moodEmoji[e.mood] || '—'} {e.mood || '—'}</span>
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
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Log Today's Data</h2>
          <p className="text-slate-500 text-xs mb-6">{today}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left col */}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Weight (kg)</label>
                <input type="number" step="0.1" placeholder="e.g. 72.5" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Body Fat %</label>
                <input type="number" step="0.1" placeholder="e.g. 18.5" value={form.bodyFat} onChange={e => setForm(f => ({ ...f, bodyFat: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Chest (cm)</label>
                <input type="number" step="0.5" placeholder="e.g. 95" value={form.chest} onChange={e => setForm(f => ({ ...f, chest: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50" />
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Waist (cm)</label>
                <input type="number" step="0.5" placeholder="e.g. 80" value={form.waist} onChange={e => setForm(f => ({ ...f, waist: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Hips (cm)</label>
                <input type="number" step="0.5" placeholder="e.g. 95" value={form.hips} onChange={e => setForm(f => ({ ...f, hips: e.target.value }))}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50" />
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
              className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none" />
          </div>

          {/* Workout toggle */}
          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input type="checkbox" checked={form.workoutCompleted} onChange={e => setForm(f => ({ ...f, workoutCompleted: e.target.checked }))}
              className="w-5 h-5 accent-cyan-500 rounded" />
            <span className="text-slate-300 font-medium">Workout completed today</span>
          </label>

              {saveError && <p className="text-red-400 text-xs mt-3">{saveError}</p>}
          <button onClick={handleSave} disabled={saving}
            className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
            {saving ? 'Saving...' : saved ? '✅ Saved!' : "Save Today's Log"}
          </button>
        </div>
      )}

      {/* FEEDBACK TAB */}
      {activeTab === 'feedback' && <FeedbackForm />}

    </div>
    </div>
  );
}

function BmiCard({ user, entries }) {
  const weights = entries.filter(e => e.weight).map(e => e.weight);
  const currentWeight = weights[weights.length - 1] || user?.weight;
  const height = user?.height;

  if (!height || !currentWeight) return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-1">BMI Calculator</h2>
      <div className="text-center py-8">
        <div className="text-3xl mb-2">📊</div>
        <p className="text-slate-500 text-sm">Add your height & weight in your profile to see BMI</p>
      </div>
    </div>
  );

  const heightM = height / 100;
  const bmi = +(currentWeight / (heightM * heightM)).toFixed(1);

  const getCategory = (b) => {
    if (b < 18.5) return { label: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-500/20', bar: 'bg-blue-500' };
    if (b < 25)   return { label: 'Normal', color: 'text-green-400', bg: 'bg-green-500/20', bar: 'bg-green-500' };
    if (b < 30)   return { label: 'Overweight', color: 'text-yellow-400', bg: 'bg-yellow-500/20', bar: 'bg-yellow-500' };
    return { label: 'Obese', color: 'text-red-400', bg: 'bg-red-500/20', bar: 'bg-red-500' };
  };

  const cat = getCategory(bmi);
  // BMI scale: 10 to 40, clamp pointer position
  const pct = Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-semibold">BMI Calculator</h2>
          <p className="text-slate-500 text-xs mt-0.5">Body Mass Index — based on your current weight & height</p>
        </div>
        <div className={`${cat.bg} px-3 py-1.5 rounded-xl`}>
          <span className={`${cat.color} font-bold text-sm`}>{cat.label}</span>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-5">
        <div>
          <span className="text-5xl font-black text-white">{bmi}</span>
          <span className="text-slate-400 text-lg ml-1">BMI</span>
        </div>
        <div className="text-slate-500 text-xs pb-1">
          <p>{currentWeight} kg ÷ ({height} cm)²</p>
        </div>
      </div>

      {/* BMI scale bar */}
      <div className="relative mb-2">
        <div className="flex h-3 rounded-full overflow-hidden">
          <div className="flex-1 bg-blue-500" title="Underweight &lt;18.5" />
          <div className="flex-1 bg-green-500" title="Normal 18.5–24.9" />
          <div className="flex-1 bg-yellow-500" title="Overweight 25–29.9" />
          <div className="flex-1 bg-red-500" title="Obese ≥30" />
        </div>
        {/* pointer */}
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute -top-1 w-1 h-5 bg-white rounded-full shadow-lg"
          style={{ transform: 'translateX(-50%)' }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          { label: 'Height', value: `${height} cm` },
          { label: 'Weight', value: `${currentWeight} kg` },
          { label: 'Ideal BMI', value: '18.5 – 24.9' },
        ].map(s => (
          <div key={s.label} className="bg-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-white font-semibold text-sm">{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BodyFatCard({ entries }) {
  const bodyFatEntries = entries.filter(e => e.bodyFat);
  const latest = bodyFatEntries[bodyFatEntries.length - 1]?.bodyFat;
  const first = bodyFatEntries[0]?.bodyFat;
  const change = latest && first ? (latest - first).toFixed(1) : null;

  const getCategory = (bf) => {
    if (bf < 6)  return { label: 'Essential Fat', color: 'text-blue-400' };
    if (bf < 14) return { label: 'Athletic', color: 'text-green-400' };
    if (bf < 18) return { label: 'Fitness', color: 'text-emerald-400' };
    if (bf < 25) return { label: 'Average', color: 'text-yellow-400' };
    return { label: 'Above Average', color: 'text-red-400' };
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-semibold">Body Fat %</h2>
          <p className="text-slate-500 text-xs mt-0.5">Log manually from the Log tab each week</p>
        </div>
        {latest && (
          <div className="text-right">
            <p className="text-2xl font-black text-white">{latest}%</p>
            {change && (
              <p className={`text-xs font-medium ${Number(change) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Number(change) > 0 ? '+' : ''}{change}% since start
              </p>
            )}
          </div>
        )}
      </div>

      {latest && (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${getCategory(latest).color} bg-slate-700`}>
          <span>📌</span> {getCategory(latest).label}
        </div>
      )}

      {bodyFatEntries.length < 2 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-slate-500 text-sm">Log body fat % in the Log tab to track your trend</p>
          <p className="text-slate-600 text-xs mt-1">Tip: Measure weekly for best results</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={entries.map(e => ({ date: e.date?.slice(5), 'Body Fat': e.bodyFat || null }))}>
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
  );
}

function FeedbackForm() {
  const inputClass = 'w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm';
  const [form, setForm] = useState({
    rating: 0,
    category: 'overall_app',
    goalSatisfaction: 0,
    whatWorked: '',
    improvement: '',
    wouldRecommend: null,
    usageFrequency: 'daily',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.rating) { setError('Please give an overall rating.'); return; }
    setSaving(true); setError('');
    try {
      await api.post('/feedback', form);
      setSaved(true);
    } catch { setError('Failed to submit. Please try again.'); }
    finally { setSaving(false); }
  };

  const categories = [
    { value: 'overall_app', label: '📱 Overall App' },
    { value: 'workout_plan', label: '🏋️ Workout Plan' },
    { value: 'diet_plan', label: '🥗 Diet Plan' },
    { value: 'progress_tracking', label: '📊 Progress Tracking' },
    { value: 'ui_ux', label: '🎨 UI / UX' },
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'few_times_week', label: 'Few times/week' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'rarely', label: 'Rarely' },
  ];

  if (saved) return (
    <div className="bg-slate-800 rounded-2xl p-10 text-center">
      <div className="text-5xl mb-4">🙏</div>
      <h2 className="text-white text-xl font-bold mb-2">Thank you for your feedback!</h2>
      <p className="text-slate-400 text-sm">Your response helps us improve GymTrainer for everyone.</p>
    </div>
  );

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-white font-semibold text-lg">Share Your Feedback 💬</h2>
        <p className="text-slate-400 text-xs mt-1">Help us improve your experience</p>
      </div>

      {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">{error}</p>}

      {/* Overall Rating */}
      <div>
        <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">Overall Rating *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => set('rating', n)}
              className={`text-2xl transition-transform hover:scale-110 ${form.rating >= n ? 'opacity-100' : 'opacity-30'}`}>
              ⭐
            </button>
          ))}
          {form.rating > 0 && <span className="text-slate-400 text-sm ml-2 self-center">{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][form.rating]}</span>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">What are you rating?</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c.value} onClick={() => set('category', c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.category === c.value ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal Satisfaction */}
      <div>
        <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">How satisfied are you with your goal progress?</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => set('goalSatisfaction', n)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${form.goalSatisfaction === n ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
              {n}
            </button>
          ))}
          <span className="text-slate-500 text-xs self-center ml-1">1 = Not at all · 5 = Very satisfied</span>
        </div>
      </div>

      {/* What worked */}
      <div>
        <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">What's working well for you?</label>
        <textarea rows={2} placeholder="e.g. The workout plans are easy to follow..." value={form.whatWorked}
          onChange={e => set('whatWorked', e.target.value)}
          className={inputClass + ' resize-none'} />
      </div>

      {/* Improvement */}
      <div>
        <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">What could be improved?</label>
        <textarea rows={2} placeholder="e.g. I'd love more exercise variety..." value={form.improvement}
          onChange={e => set('improvement', e.target.value)}
          className={inputClass + ' resize-none'} />
      </div>

      {/* Usage frequency + Would recommend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">How often do you use the app?</label>
          <div className="flex flex-wrap gap-2">
            {frequencies.map(f => (
              <button key={f.value} onClick={() => set('usageFrequency', f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.usageFrequency === f.value ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-2 block uppercase tracking-wider">Would you recommend GymTrainer?</label>
          <div className="flex gap-3">
            {[{ v: true, l: '👍 Yes' }, { v: false, l: '👎 No' }].map(({ v, l }) => (
              <button key={String(v)} onClick={() => set('wouldRecommend', v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${form.wouldRecommend === v ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={saving}
        className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
        {saving ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}
