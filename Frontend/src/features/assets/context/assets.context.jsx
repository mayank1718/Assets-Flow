import { useState } from "react";
import { AssetsContext } from "./assets.context";

export const AssetContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);

  return (
    <AssetsContext.Provider
      value={{
        loading,
        setLoading,
        error,
        setError,
        assets,
        setAssets,
      }}>
      {children}
    </AssetsContext.Provider>
  );
};
