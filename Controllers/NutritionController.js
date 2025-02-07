import Notification from "../Models/NotificationModel.js";
import Nutrition from "../Models/NutrionModel.js"

export const getNutritions = async (req, res) => {
    try {
        const userId = req.user.id;
        const results = await Nutrition.find({ userId });

        if (!results.length) {
            return res.status(404).json({ msg: 'No Nutrition found for this user.' });
        }
        res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};
export const getNutritionById = async (req, res) => {
    try {
        const nutritionId = req.params.id;
        const results = await Nutrition.findById(nutritionId)
        return res.status(200).json({ results })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
}
export const addNutritions = async (req, res) => {
    try {
        const { userId, mealType, foodItems } = req.body;
        if (!userId || !mealType || !foodItems) {
            return res.status(400).json({ msg: 'Fields are missing.' });
        }
        const { foodName, quantity, calories, protein, carbs, fats } = foodItems;
        if (!foodName || !quantity || !calories || !protein || !carbs || !fats) {
            return res.status(400).json({ msg: 'Invalid foodItems data, missing required fields' });
        }
        const newNutrition = new Nutrition({
            userId,
            mealType,
            foodItems
        });
        await newNutrition.save();
        const sendNotification = new Notification({
            toUser:userId,
            message: `When preparing your meal prefer adding more protiens.`,
        })
       await sendNotification.save();
        res.status(201).json({ msg: 'Nutrition added successfully.', newNutrition });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error.' });
    }
};

export const updateNutritions = async (req, res) => {
    try {
        const nutritionId = req.params.id;
        if (!nutritionId) {
            return res.status(404).json({ msg: 'nutrition ID is missing.' });
        }
        const { userId, mealType, foodItems } = req.body;
        const editedNutrition = await Nutrition.findByIdAndUpdate(
            nutritionId,
            { userId, mealType, foodItems },
            { new: true, runValidators: true }
        );

        if (!editedNutrition) {
            return res.status(404).json({ msg: 'nutrition not found.' });
        }

        return res.status(200).json({ msg: 'nutrition updated.', editedNutrition });

    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error.' });
    }
};

export const deleteNutritions = async (req, res) => {
    try {
        const results = await Nutrition.findByIdAndDelete(req.params.id)
        if (!results) {
            res.status(404).json({ msg: 'nutrition not found.' })
        }
        res.status(200).json({ msg: 'nutrition deleted.' })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
}

const escapeRegex = (text) => {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};
export const searchNutritions = async (req, res) => {
    try {
        const searchQuery = req.params.searchQuery;

        if (!searchQuery) {
            return res.status(400).json({ msg: "Search term is required." });
        }
        const sanitizedSearchTerm = escapeRegex(searchQuery);
        const result = await Nutrition.find({
            "$or": [
                { "mealType": { $regex: sanitizedSearchTerm, $options: 'i' } },
                { "foodItems.foodName": { $regex: sanitizedSearchTerm, $options: 'i' } }
            ]
        });
        if (result.length === 0) {
            return res.status(404).json({ msg: "No matching nutrition records found." });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};

export const searchUserNutritions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { searchQuery } = req.params;

        if (!searchQuery || !userId) {
            return res.status(400).json({ msg: "User ID and search term are required." });
        }

        const sanitizedSearchTerm = escapeRegex(searchQuery);

        const result = await Nutrition.find({
            userId,
            "$or": [
                { "mealType": { $regex: sanitizedSearchTerm, $options: 'i' } },
                { "foodItems.foodName": { $regex: sanitizedSearchTerm, $options: 'i' } }
            ]
        });

        if (result.length === 0) {
            return res.status(404).json({ msg: "No matching nutritions found for this user." });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};
