const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/email');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const signup = async (req, res) => {
  const { name, email, password, age, height, weight, goal, bodyType, phone } = req.body;
  try {
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
      return res.status(400).json({ message: 'Email already exists' });
    if (phone && !/^[6-9]\d{9}$/.test(phone.trim()))
      return res.status(400).json({ message: 'Enter a valid 10-digit Indian mobile number.' });
    if (phone && await User.findOne({ phone: phone.trim() }))
      return res.status(400).json({ message: 'Mobile number already registered.' });
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, age, height, weight, goal, bodyType,
      phone: phone?.trim() || null,
    });
    res.status(201).json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, goal: user.goal, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email?.trim() || !password)
      return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, goal: user.goal, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── FORGOT PASSWORD — send OTP ────────────────────────────────
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email?.toLowerCase().trim() });
    // Always respond OK to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, an OTP has been sent.' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    await sendOtpEmail(user.email, otp, user.name);
    res.json({ message: 'OTP sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── VERIFY OTP — return reset token ──────────────────────────
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email: email?.toLowerCase().trim() });
    if (!user || !user.resetOtp) return res.status(400).json({ message: 'OTP not requested or already used.' });
    if (new Date() > user.resetOtpExpiry) return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    if (user.resetOtp !== otp) return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();
    res.json({ resetToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── RESET PASSWORD — set new password ────────────────────────
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Reset token is invalid or expired.' });
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── SEND PHONE OTP — for mobile login ────────────────────────
const sendPhoneOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^[6-9]\d{9}$/.test(phone.trim()))
    return res.status(400).json({ message: 'Enter a valid 10-digit Indian mobile number.' });
  try {
    const user = await User.findOne({ phone: phone.trim() });
    if (!user) return res.status(404).json({ message: 'No account found with this mobile number.' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.phoneOtp = otp;
    user.phoneOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    // ── In production replace this with an SMS gateway (Twilio / MSG91) ──
    console.log(`[GymTrainer] Phone OTP for ${phone}: ${otp}`);
    // ─────────────────────────────────────────────────────────────────────
    res.json({ message: 'OTP sent to your mobile number.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── VERIFY PHONE OTP — login user ────────────────────────────
const verifyPhoneOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone: phone?.trim() });
    if (!user || !user.phoneOtp)
      return res.status(400).json({ message: 'OTP not requested or already used.' });
    if (new Date() > user.phoneOtpExpiry)
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    if (user.phoneOtp !== otp)
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    user.phoneOtp = null;
    user.phoneOtpExpiry = null;
    user.phoneVerified = true;
    await user.save();
    res.json({ token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, goal: user.goal, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── LOGIN WITH PHONE (alias — sends OTP) ─────────────────────
const loginWithPhone = sendPhoneOtp;

module.exports = { signup, login, getProfile, updateProfile, forgotPassword, verifyOtp, resetPassword, sendPhoneOtp, verifyPhoneOtp, loginWithPhone };
