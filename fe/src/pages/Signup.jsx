import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const goals = [{ value: 'lose_fat', label: '🔥 Lose Fat' }, { value: 'gain_muscle', label: '💪 Gain Muscle' }, { value: 'maintain', label: '⚖️ Maintain' }];
const bodyTypes = [{ value: 'ectomorph', label: 'Ectomorph (Slim)' }, { value: 'mesomorph', label: 'Mesomorph (Athletic)' }, { value: 'endomorph', label: 'Endomorph (Stocky)' }];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', height: '', weight: '', goal: 'maintain', bodyType: 'mesomorph' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const input = (key, placeholder, type = 'text') => (
    <input className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500" type={type} placeholder={placeholder} value={form[key]} onChange={e => set(key, e.target.value)} required={['name','email','password'].includes(key)} />
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-orange-500 mb-1">Create Account 🏋️</h1>
        <p className="text-slate-400 mb-6 text-sm">Start your fitness journey today</p>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg px-4 py-2 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {input('name', 'Full Name')}
          {input('email', 'Email', 'email')}
          {input('password', 'Password', 'password')}
          <div className="grid grid-cols-3 gap-3">
            {input('age', 'Age', 'number')}
            {input('height', 'Height (cm)', 'number')}
            {input('weight', 'Weight (kg)', 'number')}
          </div>
          <select className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-orange-500" value={form.goal} onChange={e => set('goal', e.target.value)}>
            {goals.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
          <select className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-orange-500" value={form.bodyType} onChange={e => set('bodyType', e.target.value)}>
            {bodyTypes.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-slate-400 text-sm mt-4 text-center">Already have an account? <Link to="/login" className="text-orange-400 hover:underline">Login</Link></p>
      </div>
    </div>
  );
}
