const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
const User = require("../models/userModel");

const SECRET_KEY = process.env.SECRET_KEY;

exports.googleRegistration = async (req, res) => {
  try {
    const google_token = req.body.credential;
    const decoded = jwtDecode(google_token);
    // check if the user already exist

    const user = await User.findOne({ username: decoded.email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // creating new user
    const result = await User.create({
      name: `${decoded.given_name} ${decoded.family_name}`,
      username: decoded.email,
      password: decoded.sub, // using the sub a the password
    });

    const token = jwt.sign({ id: result._id }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(201).json({
      success: true,
      token: token,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("google auth register: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const google_token = req.body.credential;
    const decoded = jwtDecode(google_token);

    const user = await User.findOne({ username: decoded.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(201).json({
      success: true,
      token: token,
      message: "Login successfully",
    });
  } catch (error) {
    console.log("google login: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
