import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: { type: Number },
  bodyMeasurements: {
    chest: Number,
    waist: Number,
    arms: Number,
  },
  performanceMetrics: {
    runTime: Number,
    liftingWeights: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Progress = mongoose.model('Progress', ProgressSchema);
export default Progress;