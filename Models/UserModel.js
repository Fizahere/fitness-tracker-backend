import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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
  location: {
    city: { type: String, default: 'Karachi' },
    country: { type: String, default: 'Pakistan' }
  },
  currentWeight: { type: Number, default: 0 },
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
  ]
  ,
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

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

