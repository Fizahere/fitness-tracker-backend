// feedbackRoutes.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const FeedbackSchema = new mongoose.Schema({
    email: { type: String, required: true },
    feedback: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

router.post("/create-feedback", async (req, res) => {
    try {
        const { email, feedback } = req.body;

        if (!email || !feedback) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newFeedback = new Feedback({ email, feedback });
        await newFeedback.save();

        res.status(200).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/get-feedbacks", async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;