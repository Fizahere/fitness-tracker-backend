import { Router } from "express";
import {
    addWorkout,
    deleteWorkout,
    getWorkoutById,
    getAllWorkouts,
    getWorkouts,
    searchWorkout,
    updateWorkout,
    getCalories,
    getUserWorkoutStreak
} from "../Controllers/WorkoutController.js";
import { authenticateToken } from '../Middlewares/authMiddleWare.js'

const workoutRouter = Router()

workoutRouter.get('/get-all-workouts', getAllWorkouts);
workoutRouter.get('/get-workouts/:id', getWorkouts);
workoutRouter.get('/get-workout/:id', getWorkoutById);
workoutRouter.get('/search-workout/:searchQuery', searchWorkout); //remaining
workoutRouter.get('/get-calories', authenticateToken, getCalories); //remaining
workoutRouter.post('/add-workout', addWorkout);
workoutRouter.put('/update-workout/:id', updateWorkout);
workoutRouter.delete('/delete-workout/:id', deleteWorkout);
workoutRouter.get('/get-streaks', authenticateToken, getUserWorkoutStreak) //remaining

export default workoutRouter;