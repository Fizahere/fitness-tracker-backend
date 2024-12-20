import express from 'express';
import {
    createProgress,
    getProgressByUser,
    getProgressById,
    updateProgress,
    deleteProgress,
} from '../Controllers/FitnessProgressController.js';

const progressRouter = express.Router();

progressRouter.post('/create-progress', createProgress);
progressRouter.get('/get-progress/:id', getProgressByUser);
progressRouter.get('/get-progress-by-id/:id', getProgressById);
progressRouter.put('/update-progress/:id', updateProgress);
progressRouter.delete('/delete-progress/:id', deleteProgress);

export default progressRouter;
