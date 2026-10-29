import mongoose from "mongoose";

const auditItemSchema = new mongoose.Schema(
  {
    audit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "audits",
      required: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assets",
      required: true,
    },
    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    inspectedAt: {
      type: Date,
      default: null,
    },
    found: {
      type: Boolean,
      default: false,
    },
    observedCondition: {
      type: String,
      enum: ["new", "good", "fair", "poor", "damaged"],
      default: null,
    },
    discrepancy: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

auditItemSchema.index({ audit: 1, asset: 1 }, { unique: true });

const auditItemModel = mongoose.model("auditItems", auditItemSchema);

export default auditItemModel;
