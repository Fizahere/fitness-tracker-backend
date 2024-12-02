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
  profileImage: {
    type: String,
    default: 'default-profile-pic.jpg'
  },
  backgroundImage: {
    type: String,
    default: 'default-profile-pic.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

const User = mongoose.model('User', userSchema);
export default User;
