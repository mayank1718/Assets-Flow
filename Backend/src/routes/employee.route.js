import { Router } from "express";
import {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
} from "../controllers/employee.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const EmployeeRouter = Router();

// Get all employees
EmployeeRouter.get(
  "/",
  isAuthenticated,
  authorizeRoles("admin", "assetManager"),
  getEmployees,
);

// Get employee by ID
EmployeeRouter.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "assetManager"),
  getEmployeeById,
);

// Update employee
EmployeeRouter.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateEmployee,
);

// Activate / deactivate employee
EmployeeRouter.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRoles("admin"),
  updateEmployeeStatus,
);

export default EmployeeRouter;
