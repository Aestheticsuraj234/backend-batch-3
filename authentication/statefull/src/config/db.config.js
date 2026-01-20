import mongoose from "mongoose";


export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongodb connected successfully")
    } catch (error) {
         console.error('❌ MongoDB connection error:', error.message);
         process.exit(1)
    }
}

