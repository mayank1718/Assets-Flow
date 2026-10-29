import express from "express";

import {
  createBooking,
  getBookings,
  getBookingById,
  reviewBooking,
  cancelBooking,
  completeBooking,
} from "../controllers/booking.controller.js";

import { authorizeRoles } from "../middleware/role.middleware.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const BookingRouter = express.Router();

// Create booking — employee
BookingRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("employee"),
  createBooking,
);

// Get all bookings / employee's own bookings
BookingRouter.get(
  "/",
  isAuthenticated,
  authorizeRoles("admin", "assetManager", "employee", "approver", "auditor"),
  getBookings,
);

// Get single booking
BookingRouter.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "assetManager", "employee", "approver", "auditor"),
  getBookingById,
);

// Approve or reject booking
BookingRouter.patch(
  "/:id/review",
  isAuthenticated,
  authorizeRoles("admin", "assetManager", "approver"),
  reviewBooking,
);

// Cancel booking
BookingRouter.patch(
  "/:id/cancel",
  isAuthenticated,
  authorizeRoles("admin", "assetManager", "employee"),
  cancelBooking,
);

// Mark booking as completed
BookingRouter.patch(
  "/:id/complete",
  isAuthenticated,
  authorizeRoles("admin", "assetManager"),
  completeBooking,
);

export default BookingRouter;
