const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  try {
    // info.username means the email address
    const info = req.body;
    const user = await User.findOne({ username: info.username });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(info.password, 10);
    const result = await User.create({
      name: info.name,
      username: info.username,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: result._id }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(201).json({
      success: true,
      token: token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in register user:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.login = async (req, res) => {
  const info = req.body;
  try {
    const user = await User.findOne({ username: info.username });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const matchPass = await bcrypt.compare(info.password, user.password); // return true of false
    if (!matchPass) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(201).json({
      success: true,
      token: token,
      message: "Login successfully",
    });
  } catch (error) {
    console.log("error from login: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user_id = decodedToken.id;
    const user = await User.findById(user_id);
    user.password = undefined;
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Getting user id from the token
    let token = req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user_id = decodedToken.id;

    // Getting user updated info
    const info = req.body;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(user_id, info, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid Token" });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.changePass = async (req, res) => {
  try {
    // Getting user id from the token
    let token = req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user_id = decodedToken.id;

    // getting user
    const user = await User.findById(user_id);

    const matchPass = await bcrypt.compare(
      req.body.password && req.body.confirmPassword,
      user.password
    );

    if (!matchPass) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // Getting user updated info
    const newPassword = req.body.newPassword;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { password: hashedPassword },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid Token" });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
