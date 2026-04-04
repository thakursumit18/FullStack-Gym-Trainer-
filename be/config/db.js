const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Drop old bad sparse index on phone if it exists
    try {
      await conn.connection.collection('users').dropIndex('phone_1');
      console.log('[GymTrainer] Dropped old phone index ✅');
    } catch {
      // Index doesn't exist — that's fine
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
