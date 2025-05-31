const cloudinary = require("../lib/cloudinary");
const sentOtpEmail = require("../lib/otpMail");
const { generateToken } = require("../lib/utils");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    generateToken(newUser._id, res);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("error in signup", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = await userModel.findOne({ email });

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generateToken(checkUser._id, res);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: checkUser,
    });
  } catch (error) {
    console.log("error in login", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  res.json({ message: "User is authenticated", user: req.user });
};

exports.updateProfile = async (req, res) => {
  // console.log(req.body)
  try {
    const { fullName, bio, profilePic } = req.body;

    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { fullName, bio, profilePic: upload.secure_url },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // console.log("error in updateProfile", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.checkMailAndSendOTP = async (req, res) => {
  console.log("checkMailAndSendOTP", req.body);
  console.log("------------------------------------------");

  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    user.otp = otp;
    user.otpTimer = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log("-------------------------------------------");
    await sentOtpEmail(user.email, otp, user.fullName);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("error in checkMailAndSendOTP", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  console.log("verifyOTP", req.body);
  console.log("------------------------------------------");
  try {
    const { otp, email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    console.log(user.otp === otp);
    if (Number(user.otp) !== Number(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpTimer < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("error in verifyOTP", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.forgotPass = async (req, res) => {
  console.log("forgotPass", req.body);
  console.log("------------------------------------------");
  try {
    const { newPass, email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpTimer = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("error in forgotPass", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
