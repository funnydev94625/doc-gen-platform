const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const sendEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    // Use your SMTP config here
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  await transporter.sendMail({
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f6f9fc; padding: 32px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px;">
          <h2 style="color: #2563eb; margin-bottom: 16px;">Verify your email address</h2>
          <p style="color: #333; font-size: 16px; margin-bottom: 24px;">
            Thank you for signing up! Please verify your email address to activate your account.
          </p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%); color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px; margin-bottom: 24px;">
            Verify Email
          </a>
          <p style="color: #888; font-size: 13px; margin-top: 32px;">
            If you did not create an account, you can safely ignore this email.<br>
            This link will expire after a short time for your security.
          </p>
        </div>
      </div>
    `,
  });
}

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = uuidv4();

    // Create new user
    user = new User({
      name,
      email,
      passwordHash: password,
      verificationToken,
      isVerified: false,
      organization
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    await user.save();

    // Send verification email
    sendEmail(user.email, verificationToken)

    res.json({ msg: "Registration successful. Please check your email to verify your account." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      sendEmail(email)
      return res.status(403).json({ msg: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ name: user.name, email: user.email, token: token, isAdmin: user.isAdmin });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email, isAdmin: true });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };
    console.log(user)
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ name: user.name, email: user.email, token: token, isAdmin: user.isAdmin });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // In a real application, send an email with a reset link
    res.json({ msg: 'If an account with this email exists, a password reset link has been sent.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // In a real application, verify the token and reset the password
    res.json({ msg: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired verification token." });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Resend Verification Email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found." });
    if (user.isVerified) return res.status(400).json({ msg: "Email is already verified." });

    // Generate a new token
    const verificationToken = uuidv4();
    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f6f9fc; padding: 32px;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px;">
            <h2 style="color: #2563eb; margin-bottom: 16px;">Verify your email address</h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 24px;">
              Thank you for signing up! Please verify your email address to activate your account.
            </p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%); color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px; margin-bottom: 24px;">
              Verify Email
            </a>
            <p style="color: #888; font-size: 13px; margin-top: 32px;">
              If you did not create an account, you can safely ignore this email.<br>
              This link will expire after a short time for your security.
            </p>
          </div>
        </div>
      `,
    });

    res.json({ msg: "Verification email sent. Please check your inbox." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Failed to resend verification email." });
  }
};
