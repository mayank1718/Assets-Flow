import assetModel from "../models/asset.model.js";

// Create asset
export const createAsset = async (req, res, next) => {
  try {
    const asset = await assetModel.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Asset created successfully",
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

// Get all assets
export const getAssets = async (req, res, next) => {
  try {
    const assets = await assetModel
      .find()
      .populate("category", "name")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: assets.length,
      data: assets,
    });
  } catch (error) {
    next(error);
  }
};

// Get single asset
export const getAssetById = async (req, res, next) => {
  try {
    const asset = await assetModel
      .findById(req.params.id)
      .populate("category", "name")
      .populate("department", "name");

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

// Update asset
export const updateAsset = async (req, res, next) => {
  try {
    const asset = await assetModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asset updated successfully",
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

// Delete asset
export const deleteAsset = async (req, res, next) => {
  try {
    const asset = await assetModel.findByIdAndDelete(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
