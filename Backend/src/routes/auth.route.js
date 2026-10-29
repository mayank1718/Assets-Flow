import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validator/auth.validate.js";
import {
  getMeController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const AuthRouter = express.Router();

// register user
AuthRouter.post("/register", registerValidator, registerController);

// login user
AuthRouter.post("/login", loginValidator, loginController);

// get user data
AuthRouter.get("/me", isAuthenticated, getMeController);

// logout user
AuthRouter.post("/logout", isAuthenticated, logoutController);

export default AuthRouter;
