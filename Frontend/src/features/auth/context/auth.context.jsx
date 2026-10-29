import { useState } from "react";
import { AuthContext } from "./auth.context";

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{ loading, setLoading, error, setError, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
