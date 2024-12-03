import { Router } from "express";
import {
    addWorkout,
    deleteWorkout,
    getWorkouts,
    searchWorkout,
    updateWorkout
} from "../Controllers/WorkoutController.js";

const workoutRouter = Router()

workoutRouter.get('/get-workouts', getWorkouts);
workoutRouter.get('/search-workout/:searchQuery', searchWorkout);
workoutRouter.post('/add-workout', addWorkout);
workoutRouter.put('/update-workout/:id', updateWorkout);
workoutRouter.delete('/delete-workout/:id', deleteWorkout)

export default workoutRouter;