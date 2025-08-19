import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import salesRoutes from "./routes/salesRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connection to MONGO DB successful.`);
  } catch (error) {
    console.log(`Error trying to connect to the MONGO DB.`, error);
  }
};

connectDB();

app.use("/sales", salesRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => console.log(`The server is running on port: ${port}`));
