import { max } from "drizzle-orm";
import {
  registerUserService,
  loginUserService,
} from "../services/auth.service.js";


export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    await registerUserService(email, password);
    res.status(204).send();
  } catch (error) {
   //  console.error("Registration error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUserService(email, password);
   // res.status(200).json({ message: "Login successful", user });
   res.cookie("authCookie", user.token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    });

    // Return user information without the password
   res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    //console.error("Login error:", error);
    res.status(401).json({ error: error.message });
  }
};
