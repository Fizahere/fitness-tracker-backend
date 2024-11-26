const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foodItems: [
    {
      foodName: String,
      quantity: String, 
      calories: Number,
      protein: Number, 
      carbs: Number,
      fats: Number
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);
module.exports = Nutrition;
