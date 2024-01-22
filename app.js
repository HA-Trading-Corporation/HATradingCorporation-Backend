require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connect_mongo = require("./config/mongo");
const {
  createProduct,
  readProducts,
  updateProduct,
  deleteProduct,
  readSingleProduct,
} = require("./controllers/productControllers");
const {
  register,
  login,
  updateUser,
  getUserInfo,
  changePass,
} = require("./controllers/userControllers");
// middlewares
const { verifyToken } = require("./middlewares/verifyToken");
const {
  addToCart,
  getCartItems,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = require("./controllers/cartController");
const {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
} = require("./controllers/wishlistController");
const {
  order,
  readOrders,
  userSpecificOrders,
  changeOrderStatus,
  removeOrder,
} = require("./controllers/orderController");
const { reviewProduct } = require("./controllers/reviewController");
const { isAdmin } = require("./middlewares/isAdmin");
const {
  googleRegistration,
  googleLogin,
} = require("./controllers/googleAuthController");

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  Credential: true,
};

cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("secretcode"));

connect_mongo(process.env.DB_URL);

// the routes that have "//" after them those are admin only routes

// product routes
app.post("/api/v1/create-product", verifyToken, isAdmin, createProduct); //
app.get("/api/v1/all-products", readProducts);
app.get("/api/v1/single-product/:id", readSingleProduct);
app.put("/api/v1/update-product/:id", verifyToken, isAdmin, updateProduct); //
app.delete("/api/v1/delete-product/:id", verifyToken, isAdmin, deleteProduct); //

// user routes

app.post("/register", register);
app.post("/login", login);
app.get("/api/v1/get-user-info", verifyToken, getUserInfo);
app.put("/api/v1/update-user", verifyToken, updateUser);
app.put("/api/v1/change-pass", verifyToken, changePass);

// google auth router
app.post("/google-registration", googleRegistration);
app.post("/google-login", googleLogin);

// cart
app.put("/api/v1/add-to-cart", verifyToken, addToCart);
app.get("/api/v1/get-cart-items", verifyToken, getCartItems);
app.post("/api/v1/remove-from-cart", verifyToken, removeFromCart);
// cart product increase and decrease routes
app.put("/api/v1/increase-quantity", verifyToken, increaseQuantity);
app.put("/api/v1/decrease-quantity", verifyToken, decreaseQuantity);

// wishlist
app.post("/api/v1/add-to-wishlist", verifyToken, addToWishlist);
app.get("/api/v1/get-wishlist-items", verifyToken, getWishlistItems);
app.post("/api/v1/remove-from-wishlist", verifyToken, removeFromWishlist);

// order
app.post("/api/v1/order", verifyToken, order);
app.get("/api/v1/all-orders", verifyToken, isAdmin, readOrders); //
app.post(
  "/api/v1/change-order-status",
  verifyToken,
  isAdmin,
  changeOrderStatus
); //
app.post("/api/v1/remove-order", verifyToken, isAdmin, removeOrder); //

app.get("/api/v1/my-orders", verifyToken, userSpecificOrders); // User specific

// review product
app.post("/api/v1/review", verifyToken, reviewProduct);

app.listen(process.env.PORT, () => {
  console.log(`Server is running!!!`);
});
