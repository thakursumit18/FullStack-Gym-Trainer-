import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import AnimatedButton from '../components/AnimatedButton';
import PageWrapper from '../components/PageWrapper';

const inputClass = 'w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-500';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpassword
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Step 1 — Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(`OTP sent to ${email}`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  // OTP input handler
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

  // Step 2 — Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { setError('Enter all 6 digits'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: otpStr });
      setResetToken(data.resetToken);
      setSuccess('OTP verified! Set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  // Step 3 — Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/reset-password', { resetToken, newPassword });
      setSuccess('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  const steps = ['Email', 'Verify OTP', 'New Password'];

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">

          <h1 className="text-2xl font-bold text-orange-500 mb-1">Reset Password 🔐</h1>
          <p className="text-slate-400 mb-6 text-sm">We'll send an OTP to your registered email</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${step === i + 1 ? 'text-orange-400' : 'text-slate-600'}`}>{s}</span>
                {i < 2 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-green-500' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg px-4 py-2 mb-4 text-sm">{error}</motion.div>
          )}
          {success && step !== 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-green-500/20 border border-green-500 text-green-400 rounded-lg px-4 py-2 mb-4 text-sm">{success}</motion.div>
          )}

          <AnimatePresence mode="wait">

            {/* STEP 1 — Email */}
            {step === 1 && (
              <motion.form key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={sendOtp} className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Registered Email Address</label>
                  <input className={inputClass} type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <AnimatedButton type="submit" disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Sending OTP...' : 'Send OTP →'}
                </AnimatedButton>
              </motion.form>
            )}

            {/* STEP 2 — OTP */}
            {step === 2 && (
              <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={verifyOtp} className="space-y-6">
                <div>
                  <label className="text-slate-400 text-xs mb-3 block text-center">Enter the 6-digit OTP sent to <span className="text-orange-400">{email}</span></label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, idx) => (
                      <input key={idx} id={`otp-${idx}`}
                        className="w-11 h-12 bg-slate-700 rounded-lg text-center text-white text-xl font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)} />
                    ))}
                  </div>
                </div>
                <AnimatedButton type="submit" disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify OTP →'}
                </AnimatedButton>
                <button type="button" onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); setSuccess(''); }}
                  className="w-full text-slate-500 text-sm hover:text-slate-300 transition-colors">
                  ← Change email
                </button>
              </motion.form>
            )}

            {/* STEP 3 — New Password */}
            {step === 3 && (
              <motion.form key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={resetPassword} className="space-y-4">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">New Password</label>
                  <input className={inputClass} type="password" placeholder="Min. 6 characters"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Confirm New Password</label>
                  <input className={inputClass} type="password" placeholder="Repeat password"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                {success && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-green-500/20 border border-green-500 text-green-400 rounded-lg px-4 py-2 text-sm text-center">
                    ✅ {success} Redirecting to login...
                  </motion.div>
                )}
                <AnimatedButton type="submit" disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Resetting...' : 'Reset Password 🔐'}
                </AnimatedButton>
              </motion.form>
            )}

          </AnimatePresence>

          <p className="text-slate-400 text-sm mt-6 text-center">
            Remember your password? <Link to="/login" className="text-orange-400 hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
