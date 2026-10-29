import axios from "axios";

const bookingApiInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Create booking
export const createBooking = async (bookingData) => {
  const response = await bookingApiInstance.post("/bookings", bookingData);
  return response.data;
};

// Get all bookings
export const getBookings = async () => {
  const response = await bookingApiInstance.get("/bookings");
  return response.data;
};

// Get booking by ID
export const getBookingById = async (id) => {
  const response = await bookingApiInstance.get(`/bookings/${id}`);
  return response.data;
};

// Approve or reject booking
export const reviewBooking = async (id, status, rejectionReason = "") => {
  const response = await bookingApiInstance.patch(`/bookings/${id}/review`, {
    status,
    rejectionReason,
  });
  return response.data;
};

// Cancel booking
export const cancelBooking = async (id) => {
  const response = await bookingApiInstance.patch(`/bookings/${id}/cancel`);
  return response.data;
};

// Complete booking
export const completeBooking = async (id) => {
  const response = await bookingApiInstance.patch(`/bookings/${id}/complete`);
  return response.data;
};
