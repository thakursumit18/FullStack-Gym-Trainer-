import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, ShieldCheck, Lock, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import AnimatedButton from '../components/AnimatedButton';
import PageWrapper from '../components/PageWrapper';

const inputClass =
  'w-full bg-black/40 border border-slate-800/60 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all font-mono text-sm';

const STEPS = [
  { label: 'Email', icon: Mail },
  { label: 'Verify OTP', icon: ShieldCheck },
  { label: 'New Password', icon: Lock },
];

export default function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Step 1 — Send OTP ──────────────────────────────────────
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(`OTP sent to ${email}`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally { setLoading(false); }
  };

  // ── OTP input helpers ──────────────────────────────────────
  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      document.getElementById(`otp-${idx - 1}`)?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      document.getElementById('otp-5')?.focus();
    }
  };

  // ── Step 2 — Verify OTP ────────────────────────────────────
  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { setError('Enter all 6 digits.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: otpStr });
      setResetToken(data.resetToken);
      setSuccess('OTP verified! Set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Try again.');
    } finally { setLoading(false); }
  };

  // ── Step 3 — Reset Password ────────────────────────────────
  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/reset-password', { resetToken, newPassword });
      setSuccess('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally { setLoading(false); }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4 relative overflow-hidden">
        {/* Background effects — same as Login */}
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
              <KeyRound className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
          </div>
          <p className="text-slate-500 mb-6 text-sm font-mono">Verify your identity via OTP to set a new password</p>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-7">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > i + 1;
              const active = step === i + 1;
              return (
                <div key={s.label} className="flex items-center gap-1 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    done ? 'bg-emerald-500/20 border border-emerald-500/40' :
                    active ? 'bg-cyan-500/20 border border-cyan-500/40' :
                    'bg-slate-800/60 border border-slate-700/40'
                  }`}>
                    {done
                      ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                      : <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-600'}`} />
                    }
                  </div>
                  <span className={`text-xs hidden sm:block truncate ${active ? 'text-cyan-400' : done ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {s.label}
                  </span>
                  {i < 2 && (
                    <div className={`flex-1 h-px mx-1 transition-all duration-500 ${done ? 'bg-emerald-500/50' : 'bg-slate-700/50'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2.5 mb-4 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success (steps 1 & 2 only) */}
          <AnimatePresence>
            {success && step !== 3 && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg px-4 py-2.5 mb-4 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" /> {success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ── STEP 1 — Email ─────────────────────────────── */}
            {step === 1 && (
              <motion.form key="step1"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                onSubmit={sendOtp} className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block font-mono">Registered Email Address</label>
                  <input className={inputClass} type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <AnimatedButton type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Mail className="w-4 h-4" />
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </AnimatedButton>
              </motion.form>
            )}

            {/* ── STEP 2 — OTP ───────────────────────────────── */}
            {step === 2 && (
              <motion.form key="step2"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                onSubmit={verifyOtp} className="space-y-5">
                <div>
                  <p className="text-slate-400 text-xs mb-4 text-center font-mono">
                    6-digit OTP sent to <span className="text-cyan-400">{email}</span>
                  </p>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input key={idx} id={`otp-${idx}`}
                        className="w-11 h-12 bg-black/40 border border-slate-700/60 rounded-lg text-center text-white text-xl font-bold outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/40 transition-all font-mono"
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)} />
                    ))}
                  </div>
                </div>
                <AnimatedButton type="submit" disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </AnimatedButton>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); setSuccess(''); }}
                    className="text-slate-500 hover:text-slate-300 transition-colors">
                    ← Change email
                  </button>
                  <button type="button" disabled={loading} onClick={sendOtp}
                    className="text-cyan-500 hover:text-cyan-400 transition-colors disabled:opacity-40">
                    Resend OTP
                  </button>
                </div>
              </motion.form>
            )}

            {/* ── STEP 3 — New Password ──────────────────────── */}
            {step === 3 && (
              <motion.form key="step3"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                onSubmit={resetPassword} className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block font-mono">New Password</label>
                  <div className="relative">
                    <input className={`${inputClass} pr-11`} type={showNew ? 'text' : 'password'} placeholder="Min. 6 characters"
                      value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowNew(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block font-mono">Confirm New Password</label>
                  <div className="relative">
                    <input className={`${inputClass} pr-11`} type={showConfirm ? 'text' : 'password'} placeholder="Repeat password"
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowConfirm(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      {success} Redirecting to login...
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatedButton type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Lock className="w-4 h-4" />
                  {loading ? 'Resetting...' : 'Reset Password'}
                </AnimatedButton>
              </motion.form>
            )}

          </AnimatePresence>

          <p className="text-slate-500 text-sm mt-6 text-center">
            Remember your password?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Login</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
