const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const SECRET_KEY = process.env.SECRET_KEY;

exports.reviewProduct = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;

    let token = await req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = await token.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user_id = await decodedToken.id;

    let username = await User.findById(user_id);
    username = username.name;

    await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          reviews: {
            user: username,
            comment: review,
            rating: rating,
          },
        },
      },
      {
        new: true,
      }
    );

    res.send("working");
  } catch (error) {
    console.log(error);
  }
};
