const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const SECRET_KEY = process.env.SECRET_KEY;

exports.addToCart = async (req, res) => {
  // Getting user id from the token
  let token = await req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Missing Token" });
  }

  token = await token.split(" ")[1];
  const decodedToken = await jwt.verify(token, SECRET_KEY);
  const user_id = await decodedToken.id;

  // product info
  const info = req.body;
  const product = await Product.findById(info.product_id);
  const user = await User.findOne({
    _id: user_id,
    "cart.product.id": info.product_id,
  });

  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "Product already in the cart" });
  }

  const cartUpdated = await User.findByIdAndUpdate(
    user_id,
    {
      $push: {
        cart: {
          product: {
            id: product._id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.imageUrls[0].secureUrl,
          },
          stocks: info.stocks,
          quantity: info.quantity,
        },
      },
    },
    {
      new: true,
    }
  );

  res.json({ message: "Added to cart" });
};

exports.getCartItems = async (req, res) => {
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
  res.status(200).json({ success: true, data: user.cart });
};

exports.removeFromCart = async (req, res) => {
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
    const cart_product_id = req.body.id;

    const result = await User.updateOne(
      { _id: user_id },
      { $pull: { cart: { _id: cart_product_id } } }
    );
    // console.log(result);
    res.json({ success: true, message: "Product removed from the cart" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: "User not found" });
  }
};

exports.increaseQuantity = async (req, res) => {
  try {
    // user id
    let token = await req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = await token.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user_id = await decodedToken.id;
    // cart product id
    const cart_product_id = req.body.id;
    //

    // const user = await User.findById(user_id);

    const cart_product = await User.findOne(
      { _id: user_id, "cart._id": cart_product_id },
      { "cart.$": 1, _id: 0 }
    );

    const quantity = cart_product.cart[0].quantity;

    const stocks = cart_product.cart[0].stocks;

    if (quantity + 1 > stocks) {
      console.log("can't be more than stocks");
      return res.json({ message: "Can't be more that stocks" });
    }

    // increase the cart product quantity with + 1

    const updatedCart = await User.findOneAndUpdate(
      { _id: user_id, "cart._id": cart_product_id },
      { $inc: { "cart.$.quantity": 1 } },
      { new: true } // To get the updated document
    );

    res.json({ message: "increased" });
  } catch (error) {
    console.log(error);
  }
};

exports.decreaseQuantity = async (req, res) => {
  try {
    // user id
    let token = await req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = await token.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user_id = await decodedToken.id;
    // cart product id
    const cart_product_id = req.body.id;
    //

    const cart_product = await User.findOne(
      { _id: user_id, "cart._id": cart_product_id },
      { "cart.$": 1, _id: 0 }
    );

    const quantity = cart_product.cart[0].quantity;

    if (quantity - 1 < 1) {
      console.log("can't be less than 1");
      return res.json({ message: "Can't be less than 1" });
    }

    // decrease the cart product quantity with - 1
    const updatedCart = await User.findOneAndUpdate(
      { _id: user_id, "cart._id": cart_product_id },
      { $inc: { "cart.$.quantity": -1 } },
      { new: true } // To get the updated document
    );

    res.json({ message: "decreased" });
  } catch (error) {
    console.log(error);
  }
};
