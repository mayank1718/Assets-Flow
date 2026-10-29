import bookingModel from "../models/booking.model.js";
import assetModel from "../models/asset.model.js";

// Create booking
export const createBooking = async (req, res, next) => {
  try {
    const { asset, startDate, endDate, purpose } = req.body;

    if (!asset || !startDate || !endDate || !purpose?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Asset, dates, and purpose are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start >= end
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide valid dates. End date must be after start date",
      });
    }

    const foundAsset = await assetModel.findById(asset);

    if (!foundAsset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    const overlappingBooking = await bookingModel.findOne({
      asset,
      status: { $in: ["pending", "approved"] },
      startDate: { $lt: end },
      endDate: { $gt: start },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: "This asset is already booked for the selected dates",
      });
    }

    const booking = await bookingModel.create({
      asset,
      requestedBy: req.user._id,
      startDate: start,
      endDate: end,
      purpose: purpose.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get bookings
export const getBookings = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === "employee") {
      filter.requestedBy = req.user._id;
    }

    const bookings = await bookingModel
      .find(filter)
      .populate("asset")
      .populate("requestedBy", "name email employeeId")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingModel
      .findById(req.params.id)
      .populate("asset")
      .populate("requestedBy", "name email employeeId")
      .populate("reviewedBy", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      req.user.role === "employee" &&
      booking.requestedBy._id.toString() !== req.user._id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Approve or reject booking
export const reviewBooking = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
    }

    if (status === "rejected" && !rejectionReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const booking = await bookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be reviewed",
      });
    }

    if (status === "approved") {
      const conflict = await bookingModel.findOne({
        _id: { $ne: booking._id },
        asset: booking.asset,
        status: "approved",
        startDate: { $lt: booking.endDate },
        endDate: { $gt: booking.startDate },
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: "Another approved booking overlaps these dates",
        });
      }
    }

    booking.status = status;
    booking.reviewedBy = req.user._id;
    booking.reviewedAt = new Date();
    booking.rejectionReason =
      status === "rejected" ? rejectionReason.trim() : "";

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Employees can cancel only their own pending bookings.
    if (
      req.user.role === "employee" &&
      booking.requestedBy.toString() !== req.user._id
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel another employee's booking",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Mark approved booking as completed
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await bookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved bookings can be completed",
      });
    }

    booking.status = "completed";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking completed successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
