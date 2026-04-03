const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/email');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── SIGNUP ────────────────────────────────────────────────────
const signup = async (req, res) => {
  const { name, email, password, phone, age, height, weight, goal, bodyType } = req.body;
  try {
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
      return res.status(400).json({ message: 'Email already exists' });
    if (phone && await User.findOne({ phone: phone.trim() }))
      return res.status(400).json({ message: 'Phone number already registered' });
    const user = await User.create({
      name: name.trim(), email: email.toLowerCase().trim(),
      password, phone: phone?.trim() || '', age, height, weight, goal, bodyType,
    });
    res.status(201).json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, goal: user.goal, isAdmin: user.isAdmin } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── LOGIN WITH EMAIL ──────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email?.trim() || !password)
      return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, goal: user.goal, isAdmin: user.isAdmin } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── LOGIN WITH PHONE ──────────────────────────────────────────
const loginWithPhone = async (req, res) => {
  const { phone, password } = req.body;
  try {
    if (!phone?.trim() || !password)
      return res.status(400).json({ message: 'Phone and password are required' });
    const user = await User.findOne({ phone: phone.trim() });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid phone number or password' });
    res.json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, goal: user.goal, isAdmin: user.isAdmin } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── FORGOT PASSWORD — send OTP ────────────────────────────────
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email?.trim()) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendOtpEmail(user.email, otp, user.name);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP. Try again.' });
  }
};

// ── VERIFY OTP ────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email?.trim() || !otp?.trim())
      return res.status(400).json({ message: 'Email and OTP are required' });

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetOtp: hashedOtp,
      resetOtpExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Issue a short-lived reset token
    const resetToken = jwt.sign({ id: user._id, purpose: 'reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ message: 'OTP verified', resetToken });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── RESET PASSWORD ────────────────────────────────────────────
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    if (!resetToken || !newPassword)
      return res.status(400).json({ message: 'Reset token and new password are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.purpose !== 'reset')
      return res.status(400).json({ message: 'Invalid reset token' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(400).json({ message: 'Reset session expired. Request a new OTP.' });
    res.status(500).json({ message: err.message });
  }
};

// ── PROFILE ───────────────────────────────────────────────────
const getProfile = async (req, res) => res.json(req.user);

const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password -resetOtp -resetOtpExpiry');
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { signup, login, loginWithPhone, forgotPassword, verifyOtp, resetPassword, getProfile, updateProfile };
