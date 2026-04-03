const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String, default: '' },
  age: Number, height: Number, weight: Number,
  goal:     { type: String, enum: ['lose_fat', 'gain_muscle', 'maintain'], default: 'maintain' },
  bodyType: { type: String, enum: ['ectomorph', 'mesomorph', 'endomorph'], default: 'mesomorph' },
  isAdmin:  { type: Boolean, default: false },
  // OTP fields
  resetOtp:        { type: String },
  resetOtpExpiry:  { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
