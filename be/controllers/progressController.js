const Progress = require('../models/Progress');

const logProgress = async (req, res) => {
  const { weight, workoutCompleted, date } = req.body;
  try {
    const existing = await Progress.findOne({ user: req.user._id, date });
    if (existing) {
      existing.weight = weight ?? existing.weight;
      existing.workoutCompleted = workoutCompleted ?? existing.workoutCompleted;
      await existing.save();
      return res.json(existing);
    }
    const entry = await Progress.create({ user: req.user._id, weight, workoutCompleted, date });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const entries = await Progress.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { logProgress, getProgress };
