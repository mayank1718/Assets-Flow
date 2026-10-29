import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { sendToken } from "../utils/token.utils.js";
import { redis } from "../database/cache.js";

export const registerController = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const isUser = await userModel.findOne({ email });
    if (isUser) {
      return res.status(401).json({
        message: "user already registered",
        success: false,
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName,
      email,
      password: hash,
      role: "employee",
    });

    sendToken(user, res);

    return res.status(201).json({
      message: "user registered successfully",
      success: true,
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        designation: user.designation,
      },
    });
  } catch (error) {
    console.log("registration failed:", error);
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "invalid credentials",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(404).json({
        success: false,
        message: "invalid credentials",
      });
    }
    sendToken(user, res);

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        designation: user.designation,
      },
    });
  } catch (error) {
    console.log("failed to login user", error);
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        employeeId: req.user.employeeId,
        designation: req.user.designation,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    await redis.set(token, "blacklisted", "EX", 7 * 24 * 60 * 60);

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("failed to logout user", error);
    next(error);
  }
};
