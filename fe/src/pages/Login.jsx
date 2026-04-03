import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Shield, AlertTriangle, KeyRound, Smartphone, Mail, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import AnimatedButton from '../components/AnimatedButton';

const isWrongPassword = (msg = '') =>
  /invalid credentials|wrong password|incorrect password|password/i.test(msg);

const inputCls = 'w-full bg-black/40 border border-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all font-mono text-sm';

// ── Password input with show/hide toggle ─────────────────────
function PasswordInput({ value, onChange, placeholder = 'password', className = '', ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${className} pr-11`}
      />
      <button type="button" onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ── OTP digit boxes (shared) ──────────────────────────────────
function OtpBoxes({ otp, setOtp, prefix = 'ph' }) {
  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`${prefix}-${idx + 1}`)?.focus();
  };
  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      document.getElementById(`${prefix}-${idx - 1}`)?.focus();
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); document.getElementById(`${prefix}-5`)?.focus(); }
  };
  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {otp.map((d, i) => (
        <input key={i} id={`${prefix}-${i}`}
          className="w-11 h-12 bg-black/40 border border-slate-700/60 rounded-lg text-center text-white text-xl font-bold outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/40 transition-all font-mono"
          type="text" inputMode="numeric" maxLength={1}
          value={d} onChange={e => handleChange(e.target.value, i)} onKeyDown={e => handleKeyDown(e, i)} />
      ))}
    </div>
  );
}

// ── Email + Password tab ──────────────────────────────────────
function EmailTab() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setWrongPass(false);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.';
      setError(msg);
      setWrongPass(isWrongPassword(msg));
    } finally { setLoading(false); }
  };

  return (
    <motion.div key="email-tab" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.22 }}>
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2.5 mb-4 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className={inputCls} type="email" placeholder="email@domain.com"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

        <div className="space-y-1">
          <PasswordInput
            className={`w-full bg-black/40 border rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 transition-all font-mono text-sm ${wrongPass ? 'border-red-500/60 focus:ring-red-500/40' : 'border-slate-800/60 focus:ring-cyan-500/50 focus:border-cyan-500/30'}`}
            placeholder="password"
            value={form.password}
            onChange={e => { setForm({ ...form, password: e.target.value }); if (wrongPass) { setWrongPass(false); setError(''); } }}
            required />
          <div className="flex justify-end pt-0.5">
            <AnimatePresence mode="wait">
              {wrongPass ? (
                <motion.div key="glow" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Link to="/forgot-password" state={{ email: form.email }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 animate-pulse">
                    <KeyRound className="w-3 h-3" /> Forgot password? Reset via OTP
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="plain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Link to="/forgot-password" state={{ email: form.email }}
                    className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                    Forgot password?
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatedButton type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
          <LogIn className="w-4 h-4" />
          {loading ? 'Authenticating...' : 'Login'}
        </AnimatedButton>
      </form>
    </motion.div>
  );
}

// ── Mobile OTP tab ────────────────────────────────────────────
function MobileTab() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1 = enter phone, 2 = enter otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e?.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError('Enter a valid 10-digit Indian mobile number.'); return;
    }
    setLoading(true); setError('');
    try {
      await api.post('/auth/phone-otp', { phone: phone.trim() });
      setSent(true);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { setError('Enter all 6 digits.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/phone-verify', { phone: phone.trim(), otp: otpStr });
      localStorage.setItem('token', data.token);
      updateUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally { setLoading(false); }
  };

  return (
    <motion.div key="mobile-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2.5 mb-4 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* Step 1 — Phone number */}
        {step === 1 && (
          <motion.form key="phone-step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }} onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block font-mono">Mobile Number</label>
              <div className="flex gap-2">
                <div className="flex items-center bg-black/40 border border-slate-800/60 rounded-lg px-3 text-slate-400 text-sm font-mono shrink-0 select-none">
                  🇮🇳 +91
                </div>
                <input className={inputCls} type="tel" inputMode="numeric" placeholder="9876543210" maxLength={10}
                  value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }} required />
              </div>
              <p className="text-slate-600 text-xs mt-1.5 font-mono">OTP will be sent to this number</p>
            </div>
            <AnimatedButton type="submit" disabled={loading || phone.length !== 10}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
              <Smartphone className="w-4 h-4" />
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </AnimatedButton>
          </motion.form>
        )}

        {/* Step 2 — OTP verification */}
        {step === 2 && (
          <motion.form key="phone-step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }} onSubmit={verifyOtp} className="space-y-5">

            {sent && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                OTP sent to +91 {phone}
              </motion.div>
            )}

            <div>
              <p className="text-slate-400 text-xs mb-3 text-center font-mono">
                Enter the 6-digit OTP sent to <span className="text-cyan-400">+91 {phone}</span>
              </p>
              <OtpBoxes otp={otp} setOtp={setOtp} prefix="ph" />
            </div>

            <AnimatedButton type="submit" disabled={loading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
              <CheckCircle className="w-4 h-4" />
              {loading ? 'Verifying...' : 'Verify & Login'}
            </AnimatedButton>

            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); setSent(false); }}
                className="text-slate-500 hover:text-slate-300 transition-colors">
                ← Change number
              </button>
              <button type="button" disabled={loading} onClick={sendOtp}
                className="text-cyan-500 hover:text-cyan-400 transition-colors disabled:opacity-40">
                Resend OTP
              </button>
            </div>
          </motion.form>
        )}

      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Login page ───────────────────────────────────────────
export default function Login() {
  const [tab, setTab] = useState('email'); // 'email' | 'mobile'

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 pointer-events-none" />
        <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-cyan-600/15 rounded-[100%] blur-[120px] pointer-events-none" />
        <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[350px] bg-violet-600/15 rounded-[100%] blur-[100px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-[0_0_60px_rgba(8,145,178,0.08)]">

          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Terminal</h1>
          </div>
          <p className="text-slate-500 mb-6 text-sm font-mono">Authenticate to continue your session</p>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-slate-800/60 border border-slate-700/40 rounded-xl p-1 mb-6">
            {[
              { key: 'email', label: 'Email', icon: Mail },
              { key: 'mobile', label: 'Mobile OTP', icon: Smartphone },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" onClick={() => setTab(key)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab === key && (
                  <motion.div layoutId="loginTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {tab === 'email' ? <EmailTab key="email" /> : <MobileTab key="mobile" />}
          </AnimatePresence>

          <p className="text-slate-500 text-sm mt-5 text-center">
            No account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">Register</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
