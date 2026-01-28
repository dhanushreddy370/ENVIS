import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // If no URI is provided, we skip connection or use local default
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/envis2";
        console.log("Connecting to Database:", uri.split("@")[1] || "Localhost"); // Log safe part
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Do not exit process in dev if DB missing, just log
    }
};
