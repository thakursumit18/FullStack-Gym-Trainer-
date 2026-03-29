const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Overall app rating
  rating: { type: Number, min: 1, max: 5, required: true },
  // Which feature they're rating
  category: {
    type: String,
    enum: ['workout_plan', 'diet_plan', 'progress_tracking', 'overall_app', 'ui_ux'],
    required: true,
  },
  // How satisfied with their goal progress
  goalSatisfaction: { type: Number, min: 1, max: 5 },
  // What's working well
  whatWorked: { type: String, maxlength: 500 },
  // What needs improvement
  improvement: { type: String, maxlength: 500 },
  // Would they recommend
  wouldRecommend: { type: Boolean },
  // How often they use the app
  usageFrequency: {
    type: String,
    enum: ['daily', 'few_times_week', 'weekly', 'rarely'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
