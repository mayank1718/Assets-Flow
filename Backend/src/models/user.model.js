import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    minlength: [2, "Full name must be at least 2 characters"],
    maxlength: [25, "Full name cannot exceed 100 characters"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },

  role: {
    type: String,
    enum: ["admin", "assetManager", "employee", "approver", "auditor"],
    default: "employee",
    required: true,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "departments",
    default: null,
  },

  employeeId: {
    type: String,
    trim: true,
    sparse: true,
    unique: true,
  },

  designation: {
    type: String,
    trim: true,
    maxlength: [100, "Designation cannot exceed 100 characters"],
    default: "",
  },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
