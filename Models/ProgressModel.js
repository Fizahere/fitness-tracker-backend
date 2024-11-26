const mongoose = require('mongoose');

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
  date: {
    type: Date,
    default: Date.now
  }
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
