import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Check your connection.');
    } finally { setLoading(false); }
  };

  return (
    <PageWrapper>
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 pointer-events-none" />
      <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-cyan-600/15 rounded-[100%] blur-[120px] pointer-events-none" />
      <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 7, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-[400px] h-[350px] bg-violet-600/15 rounded-[100%] blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-[0_0_60px_rgba(8,145,178,0.08)]">
        
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Access Terminal</h1>
        </div>
        <p className="text-slate-500 mb-6 text-sm font-mono">Authenticate to continue your session</p>

        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2.5 mb-4 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-black/40 border border-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all font-mono text-sm" type="email" placeholder="email@domain.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full bg-black/40 border border-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all font-mono text-sm" type="password" placeholder="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <AnimatedButton type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Login'}
          </AnimatedButton>
        </form>
        <p className="text-slate-500 text-sm mt-5 text-center">No account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">Register</Link></p>
      </motion.div>
    </div>
    </PageWrapper>
  );
}
