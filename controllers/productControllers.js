const Product = require("../models/productModel");
const cloudinary = require("cloudinary");

exports.createProduct = async (req, res) => {
  const data = await req.body;
  Product.create(data);
  res.status(201).json({
    success: true,
    data,
  });
};

exports.readProducts = async (req, res) => {
  const all_products = await Product.find();
  res.status(200).json({
    success: true,
    all_products,
  });
};

exports.readSingleProduct = async (req, res) => {
  const product_id = await req.params.id;
  const product_info = await Product.find({ _id: product_id });
  res.status(200).json({
    success: true,
    product_info,
  });
};

exports.updateProduct = async (req, res) => {
  const data = req.body;
  const product_id = req.params.id;
  try {
    await Product.findByIdAndUpdate(product_id, data);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const product_id = req.params.id;
  try {
    const product = await Product.findById(product_id);
    if (!product) {
      return res.send("product is not available");
    }
    await product.imageUrls.map((values, i) => {
      cloudinary.v2.uploader.destroy(values.publicId);
    });
    await Product.findByIdAndRemove(product_id);
    res.status(200).json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      error,
    });
  }
};
