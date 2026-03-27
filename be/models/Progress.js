const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: Number,
  bodyFat: Number,
  chest: Number,
  waist: Number,
  hips: Number,
  workoutCompleted: { type: Boolean, default: false },
  mood: { type: String, enum: ['great', 'good', 'okay', 'tired', 'bad'], default: 'good' },
  notes: String,
  date: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
