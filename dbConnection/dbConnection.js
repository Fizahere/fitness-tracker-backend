import { connect } from "mongoose";

const connectDb = async () => {
    try {
        await connect('mongodb+srv://fizabatool0278:vZcWfz3UaPR70UFO@cluster0.0ncvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('connected.');
    } catch (error) {
        console.log("can't cannect.", error.message);
    }
}


export default connectDb;