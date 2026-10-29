import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import {
  getMeApi,
  loginApi,
  logoutApi,
  registerApi,
} from "../services/auth.service";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { loading, setLoading, error, setError, user, setUser } = context;

  const handleRegister = async (
    fullName,
    email,
    password,
    department,
    employeeId,
    designation,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await registerApi(
        fullName,
        email,
        password,
        department,
        employeeId,
        designation,
      );

      if (data.success && data.user) {
        setUser(data.user);
      }

      return Boolean(data.success);
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginApi(email, password);

      if (data.success) {
        setUser(data.user);
      }

      return Boolean(data.success);
    } catch (error) {
      console.error("Login failed:", error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMeApi();

      if (data.success) {
        setUser(data.user);
      }

      return Boolean(data.success);
    } catch (error) {
      console.error("Fetching user failed:", error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await logoutApi();

      if (data.success) {
        setUser(null);
      }

      return Boolean(data.success);
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    user,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
};
