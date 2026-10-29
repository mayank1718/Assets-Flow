import axios from "axios";

const assetApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/assets",
  withCredentials: true,
});

export const createAsset = async (assetData) => {
  const response = await assetApiInstance.post("/", assetData);
  return response.data;
};

export const getAssets = async () => {
  const response = await assetApiInstance.get("/");
  return response.data;
};

export const getAssetDetail = async (id) => {
  const response = await assetApiInstance.get(`/${id}`);
  return response.data;
};

export const updateAsset = async (id, assetData) => {
  const response = await assetApiInstance.patch(`/${id}`, assetData);
  return response.data;
};

export const deleteAsset = async (id) => {
  const response = await assetApiInstance.delete(`/${id}`);
  return response.data;
};
