import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Audit title is required"],
      trim: true,
      maxlength: 150,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      default: null,
    },
    conductedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed", "cancelled"],
      default: "planned",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

auditSchema.index({ department: 1, status: 1 });

const auditModel = mongoose.model("audits", auditSchema);

export default auditModel;
