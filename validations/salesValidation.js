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

  body("year")
    .isInt({ min: 2000 })
    .withMessage("Year must be greater than 2000"),

  body("additionalSellerInformation.*.email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("additionalSellerInformation.*.country")
    .notEmpty()
    .withMessage("Country is required"),

  body("additionalSellerInformation.*.state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 2 })
    .withMessage("State must have exactly 2 characters"),

  body("additionalSellerInformation.*.city")
    .notEmpty()
    .withMessage("City is required"),

  body("additionalSellerInformation.*.document")
    .notEmpty()
    .withMessage("Document is required")
    .isLength({ min: 11, max: 11 })
    .withMessage("Document must have exactly 11 digits"),

  body("additionalSellerInformation.*.birthDate")
    .notEmpty()
    .withMessage("Birth date is required")
    .custom((value) => {
    const birthDate = new Date(value);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      throw new Error("Birth date cannot be in the future");
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 14) {
      throw new Error("Seller must be at least 14 years old");
    }

    return true;
  })
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

  body("additionalSellerInformation.*.email")
    .optional()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("additionalSellerInformation.*.country")
    .optional()
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ min: 2, max: 2 })
    .withMessage("Country must have exactly 2 characters"),

  body("additionalSellerInformation.*.state")
    .optional()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 2 })
    .withMessage("State must have exactly 2 characters"),

  body("additionalSellerInformation.*.city")
    .optional()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 25 })
    .withMessage("City must be between 2 and 25 characters long.")
];
