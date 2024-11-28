import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  bodyMeasurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number
  },
  performanceMetrics: {
    runTime: Number, 
    maxLift: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
