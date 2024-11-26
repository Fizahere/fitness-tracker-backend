const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  exercises: [
    {
      exerciseName: String,
      sets: Number,
      reps: Number,
      weight: Number, 
      notes: String,
    }
  ],
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'endurance'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
