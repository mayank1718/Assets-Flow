import express from "express";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error.middleware.js";
import AuthRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import DepartmentRouter from "./routes/department.routes.js";
import AssetsRouter from "./routes/asset.route.js";
import EmployeeRouter from "./routes/employee.route.js";
import BookingRouter from "./routes/booking.routes.js";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(helmet());

/* Routes */
app.use("/api/auth", AuthRouter);
app.use("/api/department", DepartmentRouter);
app.use("/api/assets", AssetsRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/bookings", BookingRouter);

/* Centralized error handler */
app.use(errorMiddleware);

export default app;
