const Progress = require('../models/Progress');

const logProgress = async (req, res) => {
  const { weight, bodyFat, chest, waist, hips, workoutCompleted, mood, notes, date } = req.body;
  try {
    const existing = await Progress.findOne({ user: req.user._id, date });
    if (existing) {
      if (weight !== undefined) existing.weight = weight;
      if (bodyFat !== undefined) existing.bodyFat = bodyFat;
      if (chest !== undefined) existing.chest = chest;
      if (waist !== undefined) existing.waist = waist;
      if (hips !== undefined) existing.hips = hips;
      if (workoutCompleted !== undefined) existing.workoutCompleted = workoutCompleted;
      if (mood !== undefined) existing.mood = mood;
      if (notes !== undefined) existing.notes = notes;
      await existing.save();
      return res.json(existing);
    }
    const entry = await Progress.create({ user: req.user._id, weight, bodyFat, chest, waist, hips, workoutCompleted, mood, notes, date });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const entries = await Progress.find({ user: req.user._id }).sort({ date: 1 }).limit(60);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { logProgress, getProgress };
