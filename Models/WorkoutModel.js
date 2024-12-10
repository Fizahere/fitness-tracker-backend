import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  exercises:
  {
    exerciseName: String,
    sets: String,
    reps: String,
    weight: String,
    notes: String,
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'endurance'],
    required: true
  },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // comments: [
  //     {
  //         _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  //         author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //         content: { type: String, required: true },
  //         createdAt: { type: Date, default: Date.now }
  //     }
  // ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
