import Progress from "../Models/ProgressModel.js";

export const createProgress = async (req, res) => {
    try {
        const { userId, weight, bodyMeasurements, performanceMetrics } = req.body;

        if (!userId || !weight || !bodyMeasurements || !performanceMetrics) {
            return res.status(400).json({ msg: 'all fields are required.' });
        }
        const { chest, waist, arms } = bodyMeasurements;
        if (!chest || !waist || !arms) {
            return res.status(400).json({ msg: 'body measurements are not filled properly.' });
        }

        const { runTime, liftingWeights } = performanceMetrics;
        if (!runTime || !liftingWeights) {
            return res.status(400).json({ msg: 'performance metrics are not filled properly.' });
        }

        const progress = new Progress({
            userId,
            weight,
            bodyMeasurements,
            performanceMetrics,
        });

        const savedProgress = await progress.save();
        return res.status(201).json({ msg: 'Progress created successfully.', data: savedProgress });
    } catch (error) {
        console.error('Error creating progress:', error);
        return res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

export const getProgressByUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const progressRecords = await Progress.find({ userId }).sort({ date: -1 });
        if (!progressRecords) {
            return res.status(404).json({ msg: 'No progress records found for this user.' });
        }

        return res.status(200).json({ msg: 'Progress records fetched successfully.', data: progressRecords });
    } catch (error) {
        console.error('Error fetching progress:', error);
        return res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

export const getProgressById = async (req, res) => {
    try {
        const { id } = req.params;

        const progressRecord = await Progress.findById(id);
        if (!progressRecord) {
            return res.status(404).json({ msg: 'Progress record not found.' });
        }

        return res.status(200).json({ msg: 'Progress record fetched successfully.', data: progressRecord });
    } catch (error) {
        console.error('Error fetching progress by ID:', error);
        return res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { weight, bodyMeasurements, performanceMetrics } = req.body;

        const updatedProgress = await Progress.findByIdAndUpdate(
            id,
            { weight, bodyMeasurements, performanceMetrics },
            { new: true, runValidators: true }
        );

        if (!updatedProgress) {
            return res.status(404).json({ msg: 'Progress record not found.' });
        }

        return res.status(200).json({ msg: 'Progress record updated successfully.', data: updatedProgress });
    } catch (error) {
        console.error('Error updating progress:', error);
        return res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

export const deleteProgress = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProgress = await Progress.findByIdAndDelete(id);
        if (!deletedProgress) {
            return res.status(404).json({ msg: 'Progress record not found.' });
        }

        return res.status(200).json({ msg: 'Progress record deleted successfully.', data: deletedProgress });
    } catch (error) {
        console.error('Error deleting progress:', error);
        return res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};
