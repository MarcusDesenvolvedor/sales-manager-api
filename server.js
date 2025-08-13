import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import monthlySales from "./monthlySales.js";
import { body, validationResult } from "express-validator";

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
app.post(
  "/sales",
  [
    body("sellerName")
      .isString()
      .withMessage("sellerName must be a string")
      .isLength({ min: 3 })
      .withMessage("sellerName must have at least 3 characters")
      .notEmpty()
      .withMessage("sellerName is required"),

    body("totalSold")
      .isNumeric()
      .withMessage("totalSold must be a number")
      .custom((value) => value > 0)
      .withMessage("totalSold must be greater than 0"),

    body("month")
      .isString()
      .withMessage("month must be a string")
      .customSanitizer((value) => {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      })
      .isIn([
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ])
      .withMessage("month must be a valid month name"),

    body("year")
      .isInt({ min: 2000 })
      .withMessage("year must be an integer greater than or equal to 2000"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newMonthlySale = await monthlySales.create(req.body);
      res.json(newMonthlySale);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//READ
app.get("/listSales", async (req, res) => {
  try {
    const listSales = await monthlySales.find();
    if(listSales.length === 0) {
      return res.status(404).json({error: "No sales found"})
    }
    res.json(listSales);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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
    res.status(500).json({ error: "Server error" });
  }
});

//DELETE
app.delete("/deleteSale/:id", async (req, res) => {
  try {
    await monthlySales.findByIdAndDelete(req.params.id);
    res.send(`Sale id: ${req.params.id} successfully deleted`);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => console.log(`The server is running on port: ${port}`));
