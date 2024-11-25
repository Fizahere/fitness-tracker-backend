import express from 'express';
import connectDb from './dbConnection/dbConnection';

const app = express();
const port = 2000;
connectDb();
app.use(express.json());
// app.use('/api')

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
});