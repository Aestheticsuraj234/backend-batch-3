import { User } from "../models/User.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.staus(400).json({ errors: "Required all the fields " });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User with this email or username already exists",
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.userId = user._id;

    res.status(201).json({
      message: "User registered successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials ",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials ",
      });
    }
    req.session.userId = user._id;

    res.json({
      message: "Login successful",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  // Destroy session (THIS IS HOW WE LOGOUT IN STATEFUL AUTH!)
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not logout" });
    }

    res.clearCookie("connect.sid"); // Clear session cookie
    res.json({ message: "Logout successful" });
  });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
