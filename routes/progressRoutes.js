import express from 'express';
import {
    createProgress,
    getProgressByUser,
    getProgressById,
    updateProgress,
    deleteProgress,
    searchProgress,
    searchUserProgress,
} from '../Controllers/FitnessProgressController.js';
import { searchUserNutritions } from '../Controllers/NutritionController.js';
import { authenticateToken } from '../Middlewares/authMiddleWare.js';

const progressRouter = express.Router();

progressRouter.post('/create-progress', createProgress);
progressRouter.get('/get-progress/:id', getProgressByUser);
progressRouter.get('/get-progress-by-id/:id', getProgressById);
progressRouter.get('/search-progress/:searchQuery', searchProgress); //remaining
progressRouter.get('/search-user-progress/:searchQuery',authenticateToken, searchUserProgress); //remaining
progressRouter.put('/update-progress/:id', updateProgress);
progressRouter.delete('/delete-progress/:id', deleteProgress);

export default progressRouter;
