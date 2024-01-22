const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const SECRET_KEY = process.env.SECRET_KEY;

exports.isAdmin = async (req, res, next) => {
  try {
    let token = await req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = await token.split(" ")[1];
    const decodedToken = await jwt.verify(token, SECRET_KEY);
    const user_id = await decodedToken.id;
    const user = await User.findById(user_id);

    if (user.isAdmin) return next();
    if (!user.isAdmin) return res.send(401).json({ message: "Unauthorized" });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};
