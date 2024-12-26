import express from 'express';
import connectDb from './dbConnection/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import workoutRouter from './routes/workoutRoutes.js';
import nutritionRouter from './routes/nutritionRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import path from 'path';
import progressRouter from './routes/progressRoutes.js';
import router from './Controllers/Feedback.js';

dotenv.config();
const app = express();
const port = 2000;

connectDb();

app.use(express.json());

app.use(express.json({ limit: '10mb' }));

app.use('/files', express.static(path.resolve('./files')));

const allowedOrigins = ['https://fitness-tracker-backend-1-vqav.onrender.com', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS error: Origin ${origin} is not allowed.`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.options('*', cors());

app.use('/auth', authRoutes);
app.use('/workout', workoutRouter);
app.use('/nutrition', nutritionRouter);
app.use('/post', postRoutes);
app.use('/progress', progressRouter);
app.use('/feedback',router)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
