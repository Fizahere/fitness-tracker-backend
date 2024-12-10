import { Router } from "express";
import {
    addWorkout,
    deleteWorkout,
    getAllWorkouts,
    getWorkouts,
    searchWorkout,
    updateWorkout
} from "../Controllers/WorkoutController.js";
import { authenticateToken } from '../Middlewares/authMiddleWare.js'

const workoutRouter = Router()

workoutRouter.get('/get-all-workouts', getAllWorkouts);
workoutRouter.get('/get-workouts', authenticateToken, getWorkouts);
workoutRouter.get('/search-workout/:searchQuery', authenticateToken, searchWorkout);
workoutRouter.post('/add-workout',authenticateToken, addWorkout);
workoutRouter.put('/update-workout/:id', authenticateToken, updateWorkout);
workoutRouter.delete('/delete-workout/:id', authenticateToken, deleteWorkout);

export default workoutRouter;