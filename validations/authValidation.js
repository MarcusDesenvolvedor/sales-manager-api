import { body } from "express-validator";

export const registerValidation = [
  body("login")
    .isString()
    .withMessage("login must be a string")
    .notEmpty()
    .withMessage("login cannot be empty")
    .isLength({ min: 3, max: 20 })
    .withMessage("Login must be between 3 and 20 characters long."),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    .withMessage(
      "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
    ),
];
