import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const sendToken = (user, res) => {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.cookie("token", token);
};
