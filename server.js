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

// Connect to the database
connectDb();

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
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
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Enable cookies if needed
}));

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/auth', authRoutes);
app.use('/workout', workoutRouter);
app.use('/nutrition', nutritionRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
