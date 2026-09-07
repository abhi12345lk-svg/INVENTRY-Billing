import jwt from "jsonwebtoken";
import { DEMO_USERS } from "../config/users.js";

const JWT_SECRET = process.env.JWT_SECRET || "distributor_erp_secret_key_2026";

export const login = (req, res) => {
  try {
    const { emailOrMobile, password, role } = req.body;

    if (!emailOrMobile && !role) {
      return res.status(400).json({
        success: false,
        message: "Please enter Email/Mobile or select a Demo Role."
      });
    }

    let user;

    // Direct role-based quick demo login
    if (role) {
      user = DEMO_USERS.find((u) => u.role === role);
    }

    // Email or mobile search
    if (!user && emailOrMobile) {
      const query = emailOrMobile.trim().toLowerCase();
      user = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === query || u.mobile === query
      );
    }

    // Default fallback to Owner if password matches demo pattern
    if (!user) {
      user = DEMO_USERS[0];
    }

    // Token creation
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! Authenticated as ${user.roleLabel}.`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        roleLabel: user.roleLabel,
        avatar: user.avatar,
        company: user.company,
        brands: user.brands,
        badgeColor: user.badgeColor,
        badgeBg: user.badgeBg,
        description: user.description
      }
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication."
    });
  }
};

export const getDemoUsers = (req, res) => {
  return res.status(200).json({
    success: true,
    users: DEMO_USERS
  });
};

export const getProfile = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = DEMO_USERS.find((u) => u.id === decoded.id) || DEMO_USERS[0];
    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
