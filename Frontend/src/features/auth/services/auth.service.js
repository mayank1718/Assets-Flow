import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export const registerApi = async (
  fullName,
  email,
  password,
  department,
  employeeId,
  designation,
) => {
  const response = await authApiInstance.post("/register", {
    fullName,
    email,
    password,
    department,
    employeeId,
    designation,
  });
  return response.data;
};

export const loginApi = async (email, password) => {
  const response = await authApiInstance.post("/login", {
    email,
    password,
  });
  return response.data;
};

export const getMeApi = async () => {
  const response = await authApiInstance.get("/me");
  return response.data;
};

export const logoutApi = async () => {
  const response = await authApiInstance.post("/logout");
  return response.data;
};
