import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "assets",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    purpose: {
      type: String,
      required: [true, "Booking purpose is required"],
      trim: true,
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

bookingSchema.index({ asset: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ requestedBy: 1, status: 1 });

const bookingModel = mongoose.model("bookings", bookingSchema);

export default bookingModel;
