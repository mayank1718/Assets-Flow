import { useContext } from "react";
import { BookingContext } from "../context/booking.context";
import {
  createBooking,
  getBookings,
  getBookingById,
  reviewBooking,
  cancelBooking,
  completeBooking,
} from "../services/booking.service";

export const useBooking = () => {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used within BookingContextProvider");
  }

  const {
    bookings,
    booking,
    loading,
    error,
    setBooking,
    setBookings,
    setLoading,
    setError,
  } = context;

  // Get all bookings
  const handleGetBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBookings();
      setBookings(response.data);

      return response;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch bookings");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const handleGetBookingById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBookingById(id);
      setBooking(response.data);

      return response;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch booking");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create booking
  const handleCreateBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await createBooking(bookingData);

      await handleGetBookings();

      return response;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create booking");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject booking
  const handleReviewBooking = async (id, status, rejectionReason = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = await reviewBooking(id, status, rejectionReason);

      await handleGetBookings();

      return response;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to review booking");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await cancelBooking(id);

      await handleGetBookings();

      return response;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to cancel booking");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Complete booking
  const handleCompleteBooking = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await completeBooking(id);

      await handleGetBookings();

      return response;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to complete booking");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleGetBookings,
    handleGetBookingById,
    handleCreateBooking,
    handleReviewBooking,
    handleCancelBooking,
    handleCompleteBooking,
    booking,
    bookings,
    loading,
    error,
  };
};
