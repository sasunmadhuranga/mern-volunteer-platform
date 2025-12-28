import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const router = express.Router();

// REGISTER (already implemented)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error. Could not register.' });
  }
});

// LOGIN (with JWT)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,   // Put a strong secret in your .env file
      { expiresIn: '1h' }       // Token expires in 1 hour
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Could not login.' });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    // Always return same message (security)
    if (!user) {
      return res.json({ message: "If the email exists, a reset link was sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Reset your password",
      subject: "Test Email",
      text: "Hello world!"
    });

    transporter.verify((err, success) => {
      if (err) console.log("Nodemailer error:", err);
      else console.log("Server ready to send emails");
    });



    res.json({ message: "If the email exists, a reset link was sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
