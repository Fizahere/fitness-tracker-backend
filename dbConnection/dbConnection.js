const { connect } = require("mongoose");

 const connectDb = async () => {
    try {
        await connect('');
        console.log('connected.');
    } catch (error) {
        console.log("can't cannect.", error.message);
    }
}


export default connectDb;