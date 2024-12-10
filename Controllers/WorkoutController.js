import Workout from "../Models/WorkoutModel.js"

export const getAllWorkouts = async (req, res) => {
    try {
        const results = await Workout.find();
        
        if (!results.length) {
            return res.status(404).json({ msg: 'No workouts found.' });
        }
        
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

export const getWorkouts = async (req, res) => {
    try {
        const userId = req.user.id;
        const results = await Workout.find({ userId });
        
        if (!results.length) {
            return res.status(404).json({ msg: 'No workouts found for this user.' });
        }
        
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

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
        const { userId, title, exercises, category } = req.body;
        const editedWorkout = await Workout.findByIdAndUpdate(
            workoutId,
            { userId, title, exercises, category },
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

export const deleteWorkout = async (req, res) => {
    try {
        const results = await Workout.findByIdAndDelete(req.params.id)
        if (!results) {
            res.status(404).json({ msg: 'Workout not found.' })
        }
        res.status(200).json({ msg: 'Workout deleted.' })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
}

const escapeRegex = (text) => {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const searchWorkout = async (req, res) => {
    try {
        const searchQuery = req.params.searchQuery;

        if (!searchQuery) {
            return res.status(400).json({ msg: "Search term is required." });
        }

        const sanitizedSearchTerm = escapeRegex(searchQuery);

        const result = await Workout.find({
            "$or": [
                { "title": { $regex: sanitizedSearchTerm, $options: 'i' } },
                { "category": { $regex: sanitizedSearchTerm, $options: 'i' } }
            ]
        });

        if (result.length === 0) {
            return res.status(404).json({ msg: "User not found." });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};

