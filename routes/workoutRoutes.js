import { Router } from "express";
import { addWorkout, getWorkouts, updateWorkout } from "../Controllers/WorkoutController.js";

const workoutRouter = Router()

workoutRouter.get('/get-workouts', getWorkouts);
workoutRouter.post('/add-workout', addWorkout);
workoutRouter.put('/update-workout/:id', updateWorkout)

export default workoutRouter;