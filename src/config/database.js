import mongoose from 'mongoose';
const connectDatabase = async () => {
    try {
        const con = await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
        console.log(`MongoDB is connected to the host: ${con.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`)
        console.log('Shutting down the server due to unhandled rejection error');
        process.exit(1);
    }
};

export default connectDatabase;
