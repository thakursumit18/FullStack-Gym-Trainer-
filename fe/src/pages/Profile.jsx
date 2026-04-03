import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Pencil, Flame, Target, Weight, X, Check, ChevronRight } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';

const GOAL_LABEL = { lose_fat: 'Lose Fat 🔥', gain_muscle: 'Gain Muscle 💪', maintain: 'Maintain ⚖️' };
const GOAL_COLOR = { lose_fat: 'text-orange-400', gain_muscle: 'text-emerald-400', maintain: 'text-blue-400' };
const GOAL_BG   = { lose_fat: 'from-orange-500/20 to-red-500/10 border-orange-500/30',
                    gain_muscle: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30',
                    maintain: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30' };

const AVATAR_COLORS = ['#06b6d4','#8b5cf6','#f97316','#10b981','#ec4899'];
function getAvatarColor(name = '') {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function getHandle(name = '') {
  const prefixes = ['Iron', 'Alpha', 'Beast', 'Titan', 'Elite'];
  const prefix = prefixes[name.charCodeAt(0) % prefixes.length];
  return `${prefix}${name.split(' ')[0]}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="text-cyan-400 font-bold">{payload[0].value} kg</p>
    </div>
  );
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [form, setForm] = useState({
    name: '', age: '', height: '', weight: '', goal: 'maintain', bodyType: 'mesomorph',
  });

  useEffect(() => {
    if (user) setForm({ name: user.name || '', age: user.age || '', height: user.height || '',
      weight: user.weight || '', goal: user.goal || 'maintain', bodyType: user.bodyType || 'mesomorph' });
  }, [user]);

  useEffect(() => {
    api.get('/progress').then(r => setProgress(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const chartData = progress
    .filter(e => e.weight)
    .slice(-10)
    .map(e => ({ date: e.date.slice(5), weight: e.weight }));

  const totalWorkouts = progress.filter(p => p.workoutCompleted).length;

  // streak
  const sorted = [...progress].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const hasRecent = sorted[0]?.date === today || sorted[0]?.date === yesterday;
  if (hasRecent) for (const e of sorted) { if (e.workoutCompleted) streak++; else break; }

  const currentWeight = progress.filter(e => e.weight).slice(-1)[0]?.weight || user?.weight;

  const handleSave = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name, age: Number(form.age), height: Number(form.height),
        weight: Number(form.weight), goal: form.goal, bodyType: form.bodyType,
      });
      updateUser(data);
      setSaveMsg('Saved!');
      setTimeout(() => { setSaveMsg(''); setEditing(false); }, 1200);
    } catch { setSaveMsg('Failed to save.'); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  const avatarColor = getAvatarColor(user.name);
  const handle = getHandle(user.name);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#030712] relative">
        {/* subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.06] pointer-events-none" />

        <div className="relative max-w-md mx-auto px-4 py-8 pb-24">

          {/* ── Header ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-white tracking-tight">My Profile</h1>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-sm px-4 py-2 rounded-xl transition-colors">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </motion.button>
          </motion.div>

          {/* ── Profile Card ────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
            className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 mb-5 overflow-hidden">
            {/* glow blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: avatarColor }} />

            <div className="flex items-center gap-5">
              {/* avatar */}
              <div className="relative flex-shrink-0">
                <motion.div whileHover={{ scale: 1.04 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${avatarColor}cc, ${avatarColor}55)`, border: `2px solid ${avatarColor}66` }}>
                  {getInitials(user.name)}
                </motion.div>
                <button onClick={() => setEditing(true)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg flex items-center justify-center transition-colors">
                  <Camera className="w-3 h-3 text-slate-300" />
                </button>
              </div>

              {/* name + bio */}
              <div className="min-w-0">
                <h2 className="text-xl font-black text-white truncate">{user.name}</h2>
                <p className="text-sm font-semibold mt-0.5" style={{ color: avatarColor }}>@{handle}</p>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  {user.goal === 'lose_fat' && 'Burning fat, building discipline. 🔥'}
                  {user.goal === 'gain_muscle' && 'Every rep counts. Building the physique. 💪'}
                  {user.goal === 'maintain' && 'Consistency is the real superpower. ⚡'}
                </p>
              </div>
            </div>

            {/* divider */}
            <div className="border-t border-slate-700/50 mt-5 pt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Age', value: user.age ? `${user.age}y` : '--' },
                { label: 'Height', value: user.height ? `${user.height} cm` : '--' },
                { label: 'Body Type', value: user.bodyType ? user.bodyType.charAt(0).toUpperCase() + user.bodyType.slice(1) : '--' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-white font-bold text-sm">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Stats Row ───────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                icon: <Weight className="w-4 h-4" />,
                value: currentWeight ? `${currentWeight} kg` : '--',
                label: 'Weight',
                color: 'text-cyan-400',
                bg: 'from-cyan-500/15 to-cyan-500/5 border-cyan-500/25',
              },
              {
                icon: <Target className="w-4 h-4" />,
                value: GOAL_LABEL[user.goal]?.split(' ')[0] || '--',
                label: 'Goal',
                color: GOAL_COLOR[user.goal],
                bg: GOAL_BG[user.goal],
              },
              {
                icon: <Flame className="w-4 h-4" />,
                value: `${streak}d`,
                label: 'Streak',
                color: 'text-orange-400',
                bg: 'from-orange-500/15 to-red-500/5 border-orange-500/25',
              },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                whileHover={{ y: -3 }}
                className={`bg-gradient-to-br ${s.bg} border rounded-2xl p-4 text-center`}>
                <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Weight Chart ─────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-sm">Weight Progress</h3>
                <p className="text-slate-500 text-xs mt-0.5">Last {chartData.length} entries</p>
              </div>
              {chartData.length >= 2 && (() => {
                const diff = (chartData.at(-1).weight - chartData[0].weight).toFixed(1);
                const up = diff > 0;
                return (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-orange-500/15 text-orange-400'}`}>
                    {up ? '+' : ''}{diff} kg
                  </span>
                );
              })()}
            </div>

            {chartData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false}
                    domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={2}
                    fill="url(#wGrad)" dot={{ fill: '#06b6d4', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#06b6d4', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[140px] flex flex-col items-center justify-center gap-2">
                <p className="text-slate-600 text-sm">No weight data yet</p>
                <p className="text-slate-700 text-xs">Log your weight in Progress to see the chart</p>
              </div>
            )}
          </motion.div>

          {/* ── Activity Summary ─────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.4 }}
            className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-5 mb-5">
            <h3 className="text-white font-semibold text-sm mb-4">Activity</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Workouts', value: totalWorkouts, color: 'text-emerald-400' },
                { label: 'Progress Entries', value: progress.length, color: 'text-violet-400' },
                { label: 'Longest Streak', value: (() => {
                  let best = 0, tmp = 0;
                  for (const e of sorted) { if (e.workoutCompleted) { tmp++; best = Math.max(best, tmp); } else tmp = 0; }
                  return `${best}d`;
                })(), color: 'text-orange-400' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{row.label}</span>
                  <span className={`font-bold text-sm ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Edit Profile CTA ─────────────────────────────────── */}
          <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44, duration: 0.35 }}
            whileTap={{ scale: 0.97 }} onClick={() => setEditing(true)}
            className="w-full flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-violet-500/10 hover:from-cyan-500/20 hover:to-violet-500/20 border border-cyan-500/25 rounded-2xl px-5 py-4 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Edit Profile</p>
                <p className="text-slate-500 text-xs">Update your stats & goal</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </motion.button>

        </div>
      </div>

      {/* ── Edit Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={e => e.target === e.currentTarget && setEditing(false)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-3xl p-6 shadow-2xl">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Edit Profile</h2>
                <button onClick={() => setEditing(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                  { key: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 22' },
                  { key: 'height', label: 'Height (cm)', type: 'number', placeholder: 'e.g. 175' },
                  { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'e.g. 70' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-slate-400 text-xs mb-1 block">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 outline-none focus:ring-2 focus:ring-cyan-500/40 transition" />
                  </div>
                ))}

                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Goal</label>
                  <select value={form.goal} onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 transition">
                    <option value="lose_fat">Lose Fat</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="maintain">Maintain</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Body Type</label>
                  <select value={form.bodyType} onChange={e => setForm(p => ({ ...p, bodyType: e.target.value }))}
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 transition">
                    <option value="ectomorph">Ectomorph</option>
                    <option value="mesomorph">Mesomorph</option>
                    <option value="endomorph">Endomorph</option>
                  </select>
                </div>
              </div>

              {saveMsg && (
                <p className={`text-xs mt-3 text-center ${saveMsg === 'Saved!' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {saveMsg}
                </p>
              )}

              <div className="flex gap-3 mt-5">
                <button onClick={() => setEditing(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 py-3 rounded-xl text-sm font-medium transition-colors">
                  Cancel
                </button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleSave} disabled={saving}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-900 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  {saving ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full" />
                  ) : (
                    <><Check className="w-4 h-4" /> Save Changes</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
