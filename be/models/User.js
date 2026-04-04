const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number, height: Number, weight: Number,
  goal:     { type: String, enum: ['lose_fat', 'gain_muscle', 'maintain'], default: 'maintain' },
  bodyType: { type: String, enum: ['ectomorph', 'mesomorph', 'endomorph'], default: 'mesomorph' },
  isAdmin:  { type: Boolean, default: false },
  // Profile fields
  username:   { type: String, default: '' },
  bio:        { type: String, default: '' },
  location:   { type: String, default: '' },
  avatar:     { type: String, default: '' },
  // Premium fields
  isPremium:       { type: Boolean, default: false },
  premiumPlan:     { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: null },
  premiumExpiry:   { type: Date, default: null },
  premiumOrderId:  { type: String, default: null },
  // Premium preferences
  dietType:        { type: String, enum: ['veg', 'non_veg'], default: 'non_veg' },
  fitnessLevel:    { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  workoutDays:     { type: Number, default: 5 },
  targetWeight:    { type: Number, default: null },
  injuries:        { type: String, default: '' },
  equipment:       { type: String, enum: ['full_gym', 'home', 'minimal'], default: 'full_gym' },
  // Mobile number
  phone:            { type: String, default: null },
  phoneVerified:    { type: Boolean, default: false },
  // Phone OTP login fields
  phoneOtp:         { type: String, default: null },
  phoneOtpExpiry:   { type: Date,   default: null },
  // OTP password reset fields
  resetOtp:         { type: String, default: null },
  resetOtpExpiry:   { type: Date,   default: null },
  resetToken:       { type: String, default: null },
  resetTokenExpiry: { type: Date,   default: null },
}, { timestamps: true });

// Unique index on phone only when phone is not null
userSchema.index({ phone: 1 }, { unique: true, sparse: true, partialFilterExpression: { phone: { $type: 'string' } } });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
