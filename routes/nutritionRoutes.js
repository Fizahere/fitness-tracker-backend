import { Router } from "express";
import {
    addNutritions,
    deleteNutritions,
    getNutritionById,
    getNutritions,
    searchNutritions,
    searchUserNutritions,
    updateNutritions
} from '../Controllers/NutritionController.js';
import { authenticateToken } from "../Middlewares/authMiddleWare.js";

const nutritionRouter = Router()

nutritionRouter.get('/get-nutritions', authenticateToken, getNutritions);
nutritionRouter.get('/get-nutrition-by-id/:id', getNutritionById)
nutritionRouter.get('/search-nutrition/:searchQuery', searchNutritions); //remaining
nutritionRouter.get('/search-user-nutrition/:searchQuery',authenticateToken, searchUserNutritions); //remaining
nutritionRouter.post('/add-nutrition', addNutritions);
nutritionRouter.put('/update-nutritions/:id', updateNutritions)
nutritionRouter.delete('/delete-nutrition/:id', deleteNutritions)

export default nutritionRouter;