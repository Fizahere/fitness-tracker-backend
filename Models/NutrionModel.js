import mongoose from "mongoose";

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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);
export default Nutrition;
