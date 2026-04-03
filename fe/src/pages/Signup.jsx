import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';

const goals = [{ value: 'lose_fat', label: 'Lose Fat' }, { value: 'gain_muscle', label: 'Gain Muscle' }, { value: 'maintain', label: 'Maintain' }];
const bodyTypes = [{ value: 'ectomorph', label: 'Ectomorph (Slim)' }, { value: 'mesomorph', label: 'Mesomorph (Athletic)' }, { value: 'endomorph', label: 'Endomorph (Stocky)' }];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', height: '', weight: '', goal: 'maintain', bodyType: 'mesomorph', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-black/40 border border-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all text-sm";
  const input = (key, placeholder, type = 'text') => (
    <input className={inputCls} type={type} placeholder={placeholder} value={form[key]} onChange={e => set(key, e.target.value)} required={['name','email','password'].includes(key)} />
  );

  return (
    <PageWrapper>
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 pointer-events-none" />
      <motion.div animate={{ opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-violet-600/15 rounded-[100%] blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-[0_0_60px_rgba(8,145,178,0.08)]">
        
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
        </div>
        <p className="text-slate-500 mb-6 text-sm font-mono">Initialize your fitness profile</p>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {input('name', 'Full Name')}
          {input('email', 'Email', 'email')}
          {input('password', 'Password (min. 6 chars)', 'password')}
          <div className="flex gap-2">
            <div className="flex items-center bg-black/40 border border-slate-800/60 rounded-lg px-3 text-slate-400 text-sm font-mono shrink-0 select-none">
              🇮🇳 +91
            </div>
            <input className={inputCls} type="tel" inputMode="numeric" placeholder="Mobile (optional)" maxLength={10}
              value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {input('age', 'Age', 'number')}
            {input('height', 'Height cm', 'number')}
            {input('weight', 'Weight kg', 'number')}
          </div>
          <select className={inputCls} value={form.goal} onChange={e => set('goal', e.target.value)}>
            {goals.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
          <select className={inputCls} value={form.bodyType} onChange={e => set('bodyType', e.target.value)}>
            {bodyTypes.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
          <AnimatedButton type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20">
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating account...' : 'Create Account'}
          </AnimatedButton>
        </form>
        <p className="text-slate-500 text-sm mt-5 text-center">Already registered? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Login</Link></p>
      </motion.div>
    </div>
    </PageWrapper>
  );
}
