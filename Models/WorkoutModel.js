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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
