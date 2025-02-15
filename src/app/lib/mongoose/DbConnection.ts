import mongoose from 'mongoose';


export const mongoDbConnection = async () => {
    const uri = process.env.MONGODB_URI!;
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB');
        return true;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};