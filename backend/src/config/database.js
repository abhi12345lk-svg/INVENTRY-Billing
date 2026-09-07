import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log("ℹ️ MONGODB_URI not specified. Using Mongoose in-memory schema repository mode.");
    return false;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("🍃 MongoDB Atlas connected successfully.");
    return true;
  } catch (error) {
    console.error("⚠️ MongoDB Atlas connection error:", error.message);
    console.log("ℹ️ Continuing with Mongoose schema & repository fallback mode.");
    return false;
  }
};export const isDatabaseConnected = () => mongoose.connection.readyState === 1;
