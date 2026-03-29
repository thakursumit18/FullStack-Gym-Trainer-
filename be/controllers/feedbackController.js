const Feedback = require('../models/Feedback');

const submitFeedback = async (req, res) => {
  const { rating, category, goalSatisfaction, whatWorked, improvement, wouldRecommend, usageFrequency } = req.body;
  try {
    const feedback = await Feedback.create({
      user: req.user._id,
      rating,
      category,
      goalSatisfaction,
      whatWorked,
      improvement,
      wouldRecommend,
      usageFrequency,
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name email goal')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitFeedback, getMyFeedback, getAllFeedback };
