import { useState } from "react";
import { DepartmentContext } from "./department.context";

export const DepartmentContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);

  return (
    <DepartmentContext.Provider
      value={{
        loading,
        setLoading,
        error,
        setError,
        departments,
        setDepartments,
      }}>
      {children}
    </DepartmentContext.Provider>
  );
};
