import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foodItems: {
    foodName: { type: String, required: true },
    quantity: { type: String, required: true },
    calories: { type: String, required: true },
    protein: { type: String, required: true },
    carbs: { type: String, required: true },
    fats: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);
export default Nutrition;
