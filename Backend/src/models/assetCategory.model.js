import mongoose from "mongoose";

const assetCategorysSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assets",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      default: null,
    },
    allocatedAt: {
      type: Date,
      default: Date.now,
    },
    expectedReturnDate: {
      type: Date,
      default: null,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    returnCondition: {
      type: String,
      enum: ["good", "fair", "poor", "damaged"],
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "returned", "lost"],
      default: "active",
    },
  },
  { timestamps: true },
);

assetCategorysSchema.index({ assignedTo: 1, status: 1 });
assetCategorysSchema.index({ asset: 1, status: 1 });

const assetCategorysModel = mongoose.model("assetCategorys", assetCategorysSchema);

export default assetCategorysModel;
