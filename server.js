import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import monthlySales from "./monthlySales.js";
import { body, validationResult, param } from "express-validator";

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
    if (listSales.length === 0) {
      return res.status(404).json({ error: "No sales found" });
    }
    res.json(listSales);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//UPDATE
app.put(
  "/changeSale/:id",
  [
    param("id").isMongoId().withMessage("Invalid sale ID"),

    body("sellerName")
      .optional()
      .isString()
      .withMessage("Seller name must be a string")
      .notEmpty()
      .withMessage("Seller name cannot be empty"),

    body("totalSold")
      .optional()
      .isNumeric()
      .withMessage("Total sold must be a number")
      .custom((value) => value > 0)
      .withMessage("Total sold must be greater than 0"),

    body("month")
      .optional()
      .isString()
      .withMessage("Month must be a string")
      .customSanitizer((value) => {
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
      .withMessage("Invalid month name"),

    body("year")
      .optional()
      .isInt({ min: 2000 })
      .withMessage("Year must be an integer greater than or equal to 2000"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const changeMonthSale = await monthlySales.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!changeMonthSale) {
        return res.status(404).json({ error: "Sale not found" });
      }

      res.json(changeMonthSale);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

//DELETE
app.delete(
  "/deleteSale/:id",
  [param("id").isMongoId().withMessage("MongoID is invalid")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const deleteMonthSale = await monthlySales.findByIdAndDelete(
        req.params.id
      );
      
      if (!deleteMonthSale) {
        return res.status(404).json({ error: "Sale not found" });
      }
      res.send(`Sale id: ${req.params.id} successfully deleted`);

    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.listen(port, () => console.log(`The server is running on port: ${port}`));
