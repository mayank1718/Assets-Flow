import "./app.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./app.route";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEffect } from "react";
const App = () => {
  const { handleGetMe } = useAuth();
  useEffect(() => {
    handleGetMe();
  }, []);
  return <RouterProvider router={routes} />;
};

export default App;
