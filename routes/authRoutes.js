import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { login, register } from "../controllers/authController.js";
import { registerValidation } from "../validations/authValidation.js"

const router = express.Router();

router.post("/register", validateRequest, registerValidation, register);
router.post("/login", login, validateRequest);

export default router;