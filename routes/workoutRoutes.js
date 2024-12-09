import { Router } from "express";
import {
    addWorkout,
    deleteWorkout,
    getWorkoutById,
    getAllWorkouts,
    getWorkouts,
    searchWorkout,
    updateWorkout
} from "../Controllers/WorkoutController.js";
import { authenticateToken } from '../Middlewares/authMiddleWare.js'

const workoutRouter = Router()

workoutRouter.get('/get-all-workouts', getAllWorkouts);
workoutRouter.get('/get-workouts', authenticateToken, getWorkouts);
workoutRouter.get('/get-workout/:id', getWorkoutById);
workoutRouter.get('/search-workout/:searchQuery', searchWorkout);
workoutRouter.post('/add-workout', addWorkout);
workoutRouter.put('/update-workout/:id', updateWorkout);
workoutRouter.delete('/delete-workout/:id', deleteWorkout);

export default workoutRouter;