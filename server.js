import express from 'express';
import connectDb from './dbConnection/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import workoutRouter from './routes/workoutRoutes.js';

const app = express();
const port = 2000;
connectDb();
app.use(express.json());
app.use('/auth', authRoutes)
app.use('/workout', workoutRouter)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
});