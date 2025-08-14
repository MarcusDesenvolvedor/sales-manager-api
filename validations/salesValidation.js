import { body, param } from "express-validator";

export const saleIdValidation = [
  param("id").isMongoId().withMessage("Invalid MongoDB ID"),
];

export const saleCreateValidation = [
  body("sellerName")
    .isString()
    .withMessage("Seller name must be a string")
    .isLength({ min: 3 })
    .withMessage("Must have at least 3 characters")
    .notEmpty()
    .withMessage("Seller name is required"),

  body("totalSold")
    .isNumeric()
    .withMessage("Total sold must be a number")
    .custom((value) => value > 0)
    .withMessage("Must be greater than 0"),

  body("month")
    .isString()
    .withMessage("Month must be a string")
    .customSanitizer(
      (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    )
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

  body("year").isInt({ min: 2000 }).withMessage("Year must be greater than 2000"),
];

export const saleUpdateValidation = [
  ...saleIdValidation,
  body("sellerName")
    .optional()
    .isString()
    .withMessage("SellerName must be a string")
    .notEmpty()
    .withMessage("SellerName cannot be empty"),

  body("totalSold")
    .optional()
    .isNumeric()
    .withMessage("TotalSold must be a number")
    .custom((value) => value > 0)
    .withMessage("TotalSold Must be greater than 0"),

  body("month")
    .optional()
    .isString()
    .withMessage("Month must be a string")
    .customSanitizer(
      (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    )
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
    .withMessage("Year must be greater than or equal to 2000"),
];
