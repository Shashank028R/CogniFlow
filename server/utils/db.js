import mongoose from "mongoose";

const connectDb = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successful!");
  } catch (error) {
    console.log("MongoDB Connection Failed: ", error);
  }
};

export default connectDb;
