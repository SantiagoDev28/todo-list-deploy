import jwt from "jsonwebtoken";
import AuthModel from "../models/authModel.js";

class AuthController {
  // ============================================================
  // REGISTER
  // ============================================================
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      const result = await AuthModel.registerUser({ name, email, password });

      if (!result.success) {
        return res.status(409).json(result); // Email already exists
      }

      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        user: result.user,
      });

    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  // ============================================================
  // LOGIN
  // ============================================================
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required." });
      }

      const result = await AuthModel.loginUser({ email, password });

      if (!result.success) {
        return res.status(401).json(result);
      }

      // Token payload
      const payload = {
        id: result.user.id,
        email: result.user.email,
      };

      // Sign token
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "default_secret_key",
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        user: result.user,
        token,
      });

    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  // ============================================================
  // GET USER PROFILE (REQUIRES AUTH)
  // ============================================================
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await AuthModel.findUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });

    } catch (error) {
      console.error("Get Profile Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
}

export default AuthController;