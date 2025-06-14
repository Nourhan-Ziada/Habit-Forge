import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", (req, res) => {
  // This endpoint can be used to get the current user's information
  // You might want to implement a middleware to verify the token first
  res.status(200).json({ message: "User information endpoint" });
});


export default authRouter;