import express from 'express';
import connectDb from './dbConnection/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import workoutRouter from './routes/workoutRoutes.js';
import nutritionRouter from './routes/nutritionRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 2000;
connectDb();
app.use(express.json());
// app.use(cors());
const allowedOrigins = ['http://localhost:2000', 'http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use('/auth', authRoutes)
app.use('/workout', workoutRouter)
app.use('/nutrition', nutritionRouter)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
});