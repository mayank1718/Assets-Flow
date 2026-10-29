import { body, param, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

export const createDepartmentValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Department name is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Department name must be between 2 and 100 characters"),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Department code is required")
    .bail()
    .isLength({ min: 2, max: 20 })
    .withMessage("Department code must be between 2 and 20 characters")
    .bail()
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage(
      "Department code can contain letters, numbers, and hyphens only",
    ),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  validate,
];

export const updateDepartmentValidator = [
  param("id").isMongoId().withMessage("Invalid department ID"),

  body("name")
    .optional()
    .isString()
    .withMessage("Department name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Department name cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Department name must be between 2 and 100 characters"),

  body("code")
    .optional()
    .isString()
    .withMessage("Department code must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Department code cannot be empty")
    .bail()
    .isLength({ min: 2, max: 20 })
    .withMessage("Department code must be between 2 and 20 characters")
    .bail()
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage(
      "Department code can contain letters, numbers, and hyphens only",
    ),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  validate,
];

export const departmentIdValidator = [
  param("id").isMongoId().withMessage("Invalid department ID"),
  validate,
];

export const departmentStatusValidator = [
  param("id").isMongoId().withMessage("Invalid department ID"),

  body("isActive")
    .exists()
    .withMessage("isActive is required")
    .bail()
    .isBoolean()
    .withMessage("isActive must be true or false")
    .toBoolean(),
  validate,
];
