import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import monthlySales from "./models/monthlySales.js";
import { body, validationResult, param } from "express-validator";
import salesRoutes from "./routes/salesRoutes.js"

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

app.listen(port, () => console.log(`The server is running on port: ${port}`));
