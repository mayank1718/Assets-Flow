import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { AuthContextProvider } from "./features/auth/context/auth.context.jsx";
import { DepartmentContextProvider } from "./features/departments/context/department.context.jsx";
import { AssetContextProvider } from "./features/assets/context/assets.context.jsx";
import { EmployeeContextProvider } from "./features/employees/contexts/employee.context.jsx";
import { BookingContextProvider } from "./features/booking/context/booking.context.jsx";

createRoot(document.getElementById("root")).render(
  <DepartmentContextProvider>
    <AssetContextProvider>
      <BookingContextProvider>
        <EmployeeContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </EmployeeContextProvider>
      </BookingContextProvider>
    </AssetContextProvider>
  </DepartmentContextProvider>,
);
