import Workout from "../Models/WorkoutModel.js"

export const getWorkouts = async (req, res) => {
    try {
        const results = await Workout.find()
        res.status(200).json({ results })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
}

export const addWorkout = async (req, res) => {
    try {
        const { userId, title, exercises, category } = req.body;
        if (!userId || !title || !exercises || !category) {
            return res.status(400).json({ msg: 'field are empty.' })
        }
        const { exerciseName, sets, reps, weight, notes } = exercises;
        if (!exerciseName || !sets || !reps || !weight || !notes) {
            return res.status(400).json({ msg: 'Invalid exercise data' });
        }
        const newWrokout = new Workout({
            userId, title, exercises, category
        })
        await newWrokout.save();
        res.status(201).json({ msg: 'workout added.', newWrokout })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
}

export const updateWorkout = async (req, res) => {
    try {
        const workoutId = req.params.id;
        if (!workoutId) {
            return res.status(404).json({ msg: 'Workout ID is missing.' });
        }
        const { userId, title,exercises,category } = req.body;
        const editedWorkout = await Posts.findByIdAndUpdate(
            workoutId,
            {  userId, title,exercises,category },
            { new: true, runValidators: true }
        );

        if (!editedWorkout) {
            return res.status(404).json({ msg: 'Workout not found.' });
        }

        return res.status(200).json({ msg: 'Workout updated.', editedWorkout });

    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error.' });
    }
};