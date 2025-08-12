import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import monthlySales from "./monthlySales.js";

dotenv.config();

const app = express();
const port = 3000;

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

//CREATE
app.post("/sales", async (req, res) => {
  try {
    const newMonthlySale = await monthlySales.create(req.body);
    res.json(newMonthlySale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//READ
app.get("/listSales", async (req, res) => {
  try {
    const listSales = await monthlySales.find();
    res.json(listSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//UPDATE
app.put("/changeSale/:id", async (req, res) => {
  try {
    const changeMonthSale = await monthlySales.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(changeMonthSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//DELETE
app.delete("/deleteSale/:id", async (req, res) => {
  try {
    await monthlySales.findByIdAndDelete(req.params.id);
    res.send(`Sale id: ${req.params.id} successfully deleted`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`The server is running on port: ${port}`));
