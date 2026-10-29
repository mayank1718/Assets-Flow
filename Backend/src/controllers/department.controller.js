import mongoose from "mongoose";
import departmentModel from "../models/department.model.js";

// CREATE DEPARTMENT
export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description } = req.body;

    const department = await departmentModel.create({
      name,
      code,
      description,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.log("department creation failed", error);
    next(error);
  }
};

// GET ALL DEPARTMENTS
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await departmentModel.find();

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// GET DEPARTMENT BY ID
export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const department = await departmentModel
      .findById(id)
      .populate("createdBy", "fullName email")
      .lean();

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE DEPARTMENT
export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (code !== undefined) updates.code = code;
    if (description !== undefined) updates.description = description;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    const department = await departmentModel.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    console.log("failed to update department", error);
    next(error);
  }
};

// ACTIVATE / DEACTIVATE DEPARTMENT
export const updateDepartmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const department = await departmentModel.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Department ${isActive ? "activated" : "deactivated"} successfully`,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};
