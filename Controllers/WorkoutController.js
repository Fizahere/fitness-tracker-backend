import Notification from "../Models/NotificationModel.js";
import Workout from "../Models/WorkoutModel.js"

export const getAllWorkouts = async (req, res) => {
    try {
        const results = await Workout.find().populate({ path: 'userId', select: 'username profileImage followers' });
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
        // const userId = req.user.id;
        const userId = req.params.id;

        const results = await Workout.find({ userId });

        if (!results.length) {
            return res.status(404).json({ msg: 'No workouts found for this user.' });
        }

        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};
export const getCalories = async (req, res) => {
    try {
        const userId = req.user.id;
        let workouts = await Workout.find({ userId })
        let results = workouts.map(({ exercises }) => {
            const { sets = 0, reps = 0, weight = 0 } = exercises || {};
            const caloriesBurn = sets * reps * weight;
            return caloriesBurn.toFixed(2);
        });
        return res.json({ results })
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
}
export const getWorkoutById = async (req, res) => {
    try {
        const workoutId = req.params.id;
        const results = await Workout.findById(workoutId)
        return res.status(200).json({ results })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
}
export const getUserWorkoutStreak = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const workouts = await Workout.find({ userId })
        .sort({ createdAt: -1 })
        .limit(6);
  
      if (workouts.length < 6) {
        return res.status(200).json({ streak: false, msg: 'Not enough data for a 6-day streak.' });
      }
  
      const uniqueDates = [
        ...new Set(
          workouts
            .map(workout => workout.createdAt && new Date(workout.createdAt).setHours(0, 0, 0, 0))
            .filter(date => !isNaN(date)) 
        ),
      ];
  
      console.log('Unique Workout Dates (normalized):', uniqueDates);
  
      if (uniqueDates.length < 6) {
        return res.status(200).json({ streak: false, msg: 'Not enough unique days for a 6-day streak.' });
      }
  
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const currentDate = uniqueDates[i];
        const nextDate = uniqueDates[i + 1];
  
        const differenceInDays = (currentDate - nextDate) / (24 * 60 * 60 * 1000);
        console.log(`Difference between ${new Date(currentDate)} and ${new Date(nextDate)}:`, differenceInDays);
  
        if (differenceInDays !== 1) {
          return res.status(200).json({ streak: false, msg: 'Dates are not consecutive.' });
        }
      }
  
      return res.status(200).json({ streak: true, msg: "Consider resting tomorrow; you've had 6 active days in a row!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ streak: false, msg: 'Internal server error.' });
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
        const sendNotification = new Notification({
            toUser:userId,
            message: "`Never expected less from ${user.username}, keep going.`",
        })
       await sendNotification.save();
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

