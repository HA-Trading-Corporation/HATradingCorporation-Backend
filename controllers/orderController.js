const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Orders = require("../models/ordersModel");
const Product = require("../models/productModel");

const SECRET_KEY = process.env.SECRET_KEY;

exports.order = async (req, res) => {
  try {
    let token = await req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = await token.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user_id = await decodedToken.id;

    const user = await User.findById(user_id);
    let userCart = user.cart;

    let order = { ...req.body, orderedProducts: userCart };
    order = { ...order, userId: user_id };

    // create an order
    const result = await Orders.create(order);

    // decrease stocks

    await userCart.map(async (value, index) => {
      const orderedProductsId = value.product.id;
      const orderedProducts = await Product.findById(orderedProductsId);

      await Product.findOneAndUpdate(
        { _id: orderedProductsId },
        { $inc: { stocks: -value.quantity } },
        { new: true } // To get the updated document
      );
    });

    // remove cart product
    await User.updateOne({ _id: user_id }, { $set: { cart: [] } });

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "some error occurs" });
  }
};

exports.readOrders = async (req, res) => {
  const all_orders = await Orders.find();
  res.status(200).json({
    success: true,
    all_orders,
  });
};

exports.userSpecificOrders = async (req, res) => {
  try {
    let token = await req.headers["authorization"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing Token" });
    }

    token = await token.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user_id = await decodedToken.id;

    const userSpecificOrders = await Orders.find({ userId: user_id });
    if (!userSpecificOrders) {
      return res.status(404).json({ message: "no orders found" });
    }

    return res.status(200).json({ my_orders: userSpecificOrders });

    // find from Orders model using userId then send to the frontend
  } catch (error) {
    console.log(error);
  }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    // console.log(req.body);

    // update the ordered product status
    await Orders.findByIdAndUpdate(
      req.body.orderId,
      { $set: { status: req.body.orderStatus } },
      { new: true }
    );

    await Orders.updateMany(
      { _id: req.body.orderId },
      { $set: { "orderedProducts.$[].status": req.body.orderStatus } }
    );

    // update the ordered product status user side
    const user = await User.findById(req.body.userId);

    res.json({ message: "Order Status updated" });
  } catch (error) {
    console.log(error);
  }
};

exports.removeOrder = async (req, res) => {
  try {
    let a = await Orders.findByIdAndRemove(req.body.orderId);
    res.status(200).json({
      success: true,
      message: "Order removed successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
