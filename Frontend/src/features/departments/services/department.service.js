import axios from "axios";

const departmentApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/department",
  withCredentials: true,
});

export const createDepartment = async ({ name, code, description }) => {
  const response = await departmentApiInstance.post("/", {
    name,
    code,
    description,
  });
  return response.data;
};

export const getAllDepartment = async () => {
  const response = await departmentApiInstance.get("/");
  return response.data;
};

export const getDepartmentById = async (id) => {
  const response = await departmentApiInstance.get(`/${id}`);
  return response.data;
};

export const updateDepartment = async (id, departmentData) => {
  const response = await departmentApiInstance.patch(`/${id}`, departmentData);
  return response.data;
};

export const updateDepartmentStatus = async (id, isActive) => {
  const response = await departmentApiInstance.patch(`/${id}/status`, {
    isActive,
  });
  return response.data;
};
