import { Router } from "express";
import {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} from "../controllers/asset.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const AssetsRouter = Router();

// Create an asset
AssetsRouter.post("/", isAuthenticated, authorizeRoles("admin", "assetManager"), createAsset);

// Get all assets
AssetsRouter.get("/", isAuthenticated, getAssets);

// Get a single asset
AssetsRouter.get("/:id", isAuthenticated, getAssetById);

// Update an asset
AssetsRouter.patch("/:id", isAuthenticated, authorizeRoles("admin", "assetManager"), updateAsset);

// Delete an asset
AssetsRouter.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteAsset);

export default AssetsRouter;
