import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Department name must be at least 2 characters"],
      maxlength: [50, "Department name cannot exceed 100 characters"],
    },

    code: {
      type: String,
      required: [true, "Department code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, "Department code cannot exceed 20 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    departmentHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const departmentModel = mongoose.model("departments", departmentSchema);

export default departmentModel