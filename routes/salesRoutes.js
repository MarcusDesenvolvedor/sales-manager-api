import express from "express";
import { createSale, getSales, updateSale, deleteSaleById, getSalesReports, deleteAllSales } from "../controllers/salesController.js";
import { saleCreateValidation, saleUpdateValidation, saleIdValidation } from "../validations/salesValidation.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/createSale", saleCreateValidation, validateRequest, createSale);
router.get("/listSales", getSales);
router.get("/generalReports", getSalesReports, validateRequest);
router.put("/updateSale/:id", saleUpdateValidation, validateRequest, updateSale);
router.delete("/deleteSaleById/:id", saleIdValidation, validateRequest, deleteSaleById);
router.delete("/deleteAllSales", deleteAllSales, validateRequest);

export default router;