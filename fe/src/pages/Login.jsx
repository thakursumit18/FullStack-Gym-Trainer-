import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-orange-500 mb-1">Welcome Back 💪</h1>
        <p className="text-slate-400 mb-6 text-sm">Login to your GymTrainer account</p>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg px-4 py-2 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-slate-400 text-sm mt-4 text-center">Don't have an account? <Link to="/signup" className="text-orange-400 hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
}
