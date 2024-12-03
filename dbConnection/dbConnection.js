import { connect } from "mongoose";

const connectDb = async () => {
    try {
        await connect(process.env.MONGODB_URL);
        console.log('connected.');
    } catch (error) {
        console.log("can't cannect.", error.message);
    }
}


export default connectDb;