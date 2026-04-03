import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';
import api from '../api/axios';

export default function Login() {
  const [mode, setMode] = useState('email'); // 'email' | 'phone'
  const [form, setForm] = useState({ email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const inputClass = 'w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (mode === 'email') {
        await login(form.email, form.password);
      } else {
        const { data } = await api.post('/auth/login/phone', { phone: form.phone, password: form.password });
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Check your connection.');
    } finally { setLoading(false); }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">

          <h1 className="text-3xl font-bold text-orange-500 mb-1">Welcome Back 💪</h1>
          <p className="text-slate-400 mb-6 text-sm">Login to your GymTrainer account</p>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6 bg-slate-700 p-1 rounded-xl">
            {[{ key: 'email', label: '📧 Email' }, { key: 'phone', label: '📱 Phone' }].map(m => (
              <button key={m.key} type="button" onClick={() => { setMode(m.key); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m.key ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                {m.label}
              </button>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg px-4 py-2 mb-4 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'email' ? (
                <motion.input key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className={inputClass} type="email" placeholder="Email address"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              ) : (
                <motion.div key="phone" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="flex gap-2">
                  <span className="bg-slate-700 rounded-lg px-3 py-3 text-slate-300 text-sm flex items-center">+91</span>
                  <input className={inputClass} type="tel" placeholder="Mobile number"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    maxLength={10} required />
                </motion.div>
              )}
            </AnimatePresence>

            <input className={inputClass} type="password" placeholder="Password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-orange-400 text-xs hover:underline">
                Forgot password?
              </Link>
            </div>

            <AnimatedButton type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </AnimatedButton>
          </form>

          <p className="text-slate-400 text-sm mt-4 text-center">
            Don't have an account? <Link to="/signup" className="text-orange-400 hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
