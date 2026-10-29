import axios from "axios";

const employeeApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/employees",
  withCredentials: true,
});

// Get all employees
export const getEmployees = async () => {
  const response = await employeeApiInstance.get("/");
  return response.data;
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  const response = await employeeApiInstance.get(`/${id}`);
  return response.data;
};

// Update employee details
export const updateEmployee = async (id, employeeData) => {
  const response = await employeeApiInstance.patch(`/${id}`, employeeData);
  return response.data;
};

// Update employee status
export const updateEmployeeStatus = async (id, isActive) => {
  const response = await employeeApiInstance.patch(`/${id}/status`, {
    isActive,
  });
  return response.data;
};
