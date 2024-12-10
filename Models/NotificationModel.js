import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

// likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
// comments: [
//     {
//         _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
//         author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
//         content: { type: String, required: true },
//         createdAt: { type: Date, default: Date.now }
//     }
// ],