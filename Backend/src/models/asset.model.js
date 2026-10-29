import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: [true, "Asset tag is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum : [],
      deafult : "other",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      default: null,
    },
    serialNumber: {
      type: String,
      trim: true,
      default: null,
    },
    manufacturer: {
      type: String,
      trim: true,
      default: "",
    },
    modelNumber: {
      type: String,
      trim: true,
      default: "",
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
    purchaseCost: {
      type: Number,
      min: 0,
      default: 0,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "allocated", "maintenance", "reserved", "retired"],
      default: "available",
    },
    condition: {
      type: String,
      enum: ["new", "good", "fair", "poor", "damaged"],
      default: "new",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true },
);

assetSchema.index({ category: 1, status: 1 });
assetSchema.index({ serialNumber: 1 }, { unique: true, sparse: true });

const assetModel = mongoose.model("assets", assetSchema);

export default assetModel;
