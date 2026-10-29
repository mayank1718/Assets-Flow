import mongoose from "mongoose";

const maintenanceRequestSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assets",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    issue: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
      maxlength: 500,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: [
        "open",
        "approved",
        "in_progress",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "open",
    },
    resolution: {
      type: String,
      trim: true,
      default: "",
    },
    cost: {
      type: Number,
      min: 0,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

maintenanceRequestSchema.index({ asset: 1, status: 1 });
maintenanceRequestSchema.index({ reportedBy: 1, createdAt: -1 });

const maintenanceRequestModel = mongoose.model(
  "maintenanceRequests",
  maintenanceRequestSchema,
);

export default maintenanceRequestModel;
