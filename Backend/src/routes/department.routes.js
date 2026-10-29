import { Router } from "express";

import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  updateDepartmentStatus,
} from "../controllers/department.controller.js";

import {
  createDepartmentValidator,
  updateDepartmentValidator,
  departmentIdValidator,
  departmentStatusValidator,
} from "../validator/department.validator.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const DepartmentRouter = Router();

// Create department — Admin only
DepartmentRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  createDepartmentValidator,
  createDepartment,
);

// Get all departments — Authenticated users
DepartmentRouter.get("/", isAuthenticated, getDepartments);

// Get one department — Authenticated users
DepartmentRouter.get("/:id", isAuthenticated, departmentIdValidator, getDepartmentById);

// Update department — Admin only
DepartmentRouter.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateDepartmentValidator,
  updateDepartment,
);

// Activate/deactivate department — Admin only
DepartmentRouter.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRoles("admin"),
  departmentStatusValidator,
  updateDepartmentStatus,
);

export default DepartmentRouter;
