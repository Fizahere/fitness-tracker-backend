import { Router } from "express";
import {
    addNutritions,
    deleteNutritions,
    getNutritions,
    searchNutritions,
    updateNutritions
}from '../Controllers/NutritionController.js';
import { authenticateToken } from "../Middlewares/authMiddleWare.js";

const nutritionRouter = Router()

nutritionRouter.get('/get-nutritions', getNutritions);
nutritionRouter.get('/search-nutrition/:searchQuery', searchNutritions);
nutritionRouter.post('/add-nutrition',authenticateToken, addNutritions);
nutritionRouter.put('/update-nutritions/:id', updateNutritions)
nutritionRouter.delete('/delete-nutrition/:id',deleteNutritions)

export default nutritionRouter;