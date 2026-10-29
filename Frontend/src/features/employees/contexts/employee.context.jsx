import { useState } from "react";
import { EmployeeContext } from "./employee.context";

export const EmployeeContextProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        setEmployees,
        setError,
        setLoading,
      }}>
      {children}
    </EmployeeContext.Provider>
  );
};
