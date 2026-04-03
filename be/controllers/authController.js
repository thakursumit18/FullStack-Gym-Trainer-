const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const signup = async (req, res) => {
  const { name, email, password, age, height, weight, goal, bodyType } = req.body;
  try {
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
      return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, age, height, weight, goal, bodyType
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

module.exports = { signup, login, getProfile, updateProfile };
