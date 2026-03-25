const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: Number,
  workoutCompleted: { type: Boolean, default: false },
  date: { type: String, required: true }, // YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
