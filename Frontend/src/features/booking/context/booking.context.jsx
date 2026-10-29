import { useState } from "react";
import { BookingContext } from "./booking.context";


export const BookingContextProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        booking,
        loading,
        error,
        setBooking,
        setBookings,
        setLoading,
        setError,
      }}>
      {children}
    </BookingContext.Provider>
  );
};
