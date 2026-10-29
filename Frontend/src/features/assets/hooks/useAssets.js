import { useContext } from "react";
import { AssetsContext } from "../context/assets.context";
import {
  createAsset,
  deleteAsset,
  getAssetDetail,
  getAssets,
  updateAsset,
} from "../services/asset.service";

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error("state is empty");
  }
  const {
    loading,
    setLoading,
    error,
    setError,
    assets,
    setAssets,
  } = context;

  // create assets
  const createAssetHandler = async (assetData) => {
    setLoading(true);
    setError(null);

    try {
      const val = await createAsset(assetData);

      setAssets((prevAssets) => [...prevAssets, val.data]);

      return val.success;
    } catch (error) {
      console.error("Failed to create asset:", error);
      setError(error.response?.data?.message || "Failed to create asset");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all assets
  const fetchAssetsHandler = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const val = await getAssets(params);

      setAssets(val.data);

      return val.success;
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      setError(error.response?.data?.message || "Failed to fetch assets");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch single asset by ID
  const fetchAssetDetailHandler = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const val = await getAssetDetail(id);
      return val.data;
    } catch (error) {
      console.error("Failed to fetch asset:", error);
      setError(error.response?.data?.message || "Failed to fetch asset");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update asset
  const updateAssetHandler = async (id, assetData) => {
    setLoading(true);
    setError(null);

    try {
      const val = await updateAsset(id, assetData);

      setAssets((prevAssets) =>
        prevAssets.map((asset) => (asset._id === id ? val.data : asset)),
      );

      return val.success;
    } catch (error) {
      console.error("Failed to update asset:", error);
      setError(error.response?.data?.message || "Failed to update asset");
      return false;
    } finally {
      setLoading(false);
    }
  };

  //delete asset
  const deleteAssetHandler = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const val = await deleteAsset(id);

      setAssets((prevAssets) => prevAssets.filter((asset) => asset._id !== id));

      return val.success;
    } catch (error) {
      console.error("Failed to delete asset:", error);

      setError(error.response?.data?.message || "Failed to delete asset");

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    assets,
    createAssetHandler,
    fetchAssetsHandler,
    fetchAssetDetailHandler,
    updateAssetHandler,
    deleteAssetHandler,
  };
};
