const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const SECRET_KEY = process.env.SECRET_KEY;

exports.addToWishlist = async (req, res) => {
  let token = await req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Missing Token" });
  }

  token = await token.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_KEY);

  const user_id = await decodedToken.id;
  const product_id = await req.body.product_id;

  const product = await Product.findById(product_id);

  const user = await User.findOne({
    _id: user_id,
    "wishlist.id": product_id,
  });

  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "Product already in the wishlist" });
  }

  const updatedWishlist = await User.findByIdAndUpdate(
    user_id,
    {
      $push: {
        wishlist: {
          id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.imageUrls[0].secureUrl,
        },
      },
    },
    {
      new: true,
    }
  );

  res.json({ message: "working fine " });
};

exports.getWishlistItems = async (req, res) => {
  // getting user id from header
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
  if (!user) res.status(404).json({ message: "User not found" });
  // console.log(user.cart);
  res.status(200).json({ success: true, data: user.wishlist });
};

exports.removeFromWishlist = async (req, res) => {
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
    const wishlist_product_id = req.body.id;

    const result = await User.updateOne(
      { _id: user_id },
      { $pull: { wishlist: { _id: wishlist_product_id } } }
    );
    res.json({ success: true, message: "Product removed from wishlist" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: "User not found" });
  }
};
