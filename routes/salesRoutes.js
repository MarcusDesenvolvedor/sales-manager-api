import express from "express";
import { createSale, getSales, updateSale, deleteSale } from "../controllers/salesController.js";
import { saleCreateValidation, saleUpdateValidation, saleIdValidation } from "../validations/salesValidation.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/createSale", saleCreateValidation, validateRequest, createSale);
router.get("/listSales", getSales);
router.put("/updateSale/:id", saleUpdateValidation, validateRequest, updateSale);
router.delete("/deleteSale/:id", saleIdValidation, validateRequest, deleteSale);

export default router;