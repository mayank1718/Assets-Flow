import userModel from "../models/user.model.js";

// Get all employees
export const getEmployees = async (req, res, next) => {
  try {
    const employees = await userModel
      .find({ role: "employee" })
      .populate("department", "name code");

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await userModel
      .findOne({
        _id: req.params.id,
        role: "employee",
      })
      .populate("department", "name code");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Update employee details
export const updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department, employeeId } = req.body;

    const employee = await userModel.findOne({
      _id: req.params.id,
      role: "employee",
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (name !== undefined) employee.name = name;
    if (email !== undefined) employee.email = email;
    if (department !== undefined) employee.department = department;
    if (employeeId !== undefined) employee.employeeId = employeeId;

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Activate / deactivate employee
export const updateEmployeeStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    const employee = await userModel.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "employee",
      },
      { isActive },
      { new: true, runValidators: true },
    )
      .populate("department", "name code");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Employee ${isActive ? "activated" : "deactivated"} successfully`,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};
