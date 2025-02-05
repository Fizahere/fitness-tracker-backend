import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    maxlength: 75, 
    default: 'We Love Fitness Tracker.'
  },
  location: {
    city: { type: String, default: 'Karachi' },
    country: { type: String, default: 'Pakistan' }
  },
  currentWeight: { type: Number, default: 0 },
  profileImage: {
    type: String,
    default: '/files/userImage.png' 
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
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;
