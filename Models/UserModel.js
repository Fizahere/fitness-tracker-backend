import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    length: 75,
    default: 'We Love Fitness Tracker.'
  },
  profileImage: {
    type: String,
    default: '../files/userImage.png'
  },
  backgroundImage: {
    type: String,
    default: '../files/mainImage.jpg'
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  // notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  currentStreak: { type: Number, default: 0 }, // Current streak of consecutive workout days
  highestStreak: { type: Number, default: 0 }, // Record of the longest streak
  lastWorkoutDate: { type: Date, default: null }, // Last recorded workout date
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;
