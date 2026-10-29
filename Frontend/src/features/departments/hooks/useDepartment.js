import { useContext } from "react";
import { DepartmentContext } from "../context/department.context";
import {
  createDepartment,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  updateDepartmentStatus,
} from "../services/department.service";

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("department state is empty");
  }
  const { loading, setLoading, error, setError, departments, setDepartments } =
    context;

  // Create department
  const createDepartmentHandler = async (departmentData) => {
    setLoading(true);
    setError(null);

    try {
      const val = await createDepartment(departmentData);

      setDepartments((prevDepartments) => [...prevDepartments, val.data]);

      return val.success;
    } catch (error) {
      console.error("Failed to create department:", error);

      setError(error.response?.data?.message || "Failed to create department");

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all departments
  const fetchDepartmentsHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      const val = await getAllDepartment();

      setDepartments(val.data);

      return val.success;
    } catch (error) {
      console.error("Failed to fetch departments:", error);

      setError(error.response?.data?.message || "Failed to fetch departments");

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch department by ID
  const fetchDepartmentByIdHandler = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const val = await getDepartmentById(id);

      return val.data;
    } catch (error) {
      console.error("Failed to fetch department:", error);

      setError(error.response?.data?.message || "Failed to fetch department");

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update department
  const updateDepartmentHandler = async (id, departmentData) => {
    setLoading(true);
    setError(null);

    try {
      const val = await updateDepartment(id, departmentData);

      setDepartments((prevDepartments) =>
        prevDepartments.map((department) =>
          department._id === id ? val.data : department,
        ),
      );

      return val.success;
    } catch (error) {
      console.error("Failed to update department:", error);

      setError(error.response?.data?.message || "Failed to update department");

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update department status
  const updateDepartmentStatusHandler = async (id, isActive) => {
    setLoading(true);
    setError(null);

    try {
      const val = await updateDepartmentStatus(id, isActive);

      setDepartments((prevDepartments) =>
        prevDepartments.map((department) =>
          department._id === id ? val.data : department,
        ),
      );

      return val.success;
    } catch (error) {
      console.error("Failed to update department status:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Failed to update department status",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    departments,
    createDepartmentHandler,
    fetchDepartmentsHandler,
    fetchDepartmentByIdHandler,
    updateDepartmentHandler,
    updateDepartmentStatusHandler,
  };
};
