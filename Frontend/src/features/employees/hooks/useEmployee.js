import { useContext } from "react";
import { EmployeeContext } from "../contexts/employee.context";
import { getEmployeeById, getEmployees, updateEmployee, updateEmployeeStatus } from "../services/employee.service";

export const useEmployee = () => {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error("Employee context is Empty");
  }

  const { employees, loading, error, setEmployees, setError, setLoading } =
    context;

  // Fetch all employees
  const fetchEmployeesHandler = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getEmployees();
      setEmployees(response.data);

      return response.success;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch employees");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch one employee
  const fetchEmployeeByIdHandler = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getEmployeeById(id);

      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch employee");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update employee details
  const updateEmployeeHandler = async (id, employeeData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await updateEmployee(id, employeeData);

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === id ? response.data : employee,
        ),
      );

      return response.success;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update employee");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Activate or deactivate employee
  const updateEmployeeStatusHandler = async (id, isActive) => {
    try {
      setLoading(true);
      setError(null);

      const response = await updateEmployeeStatus(id, isActive);

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === id ? response.data : employee,
        ),
      );

      return response.success;
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update employee status",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    employees,
    updateEmployeeHandler,
    updateEmployeeStatusHandler,
    fetchEmployeeByIdHandler,
    fetchEmployeesHandler,
  };
};
