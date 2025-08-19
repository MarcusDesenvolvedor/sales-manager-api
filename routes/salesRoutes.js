import express from "express";
import { createSale, getSales, updateSale, deleteSaleById, getSalesReports, deleteAllSales } from "../controllers/salesController.js";
import { saleCreateValidation, saleUpdateValidation, saleIdValidation } from "../validations/salesValidation.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createSale", authMiddleware, saleCreateValidation, validateRequest, createSale);
router.get("/listSales", authMiddleware, getSales);
router.get("/generalReports", authMiddleware, getSalesReports, validateRequest);
router.put("/updateSale/:id", authMiddleware, saleUpdateValidation, validateRequest, updateSale);
router.delete("/deleteSaleById/:id", authMiddleware, saleIdValidation, validateRequest, deleteSaleById);
router.delete("/deleteAllSales", authMiddleware, deleteAllSales, validateRequest);

export default router;