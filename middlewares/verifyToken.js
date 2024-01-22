const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

exports.verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    token = token.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Forbidden: Invalid token" });
      } else {
        // res.status(200).json({ message: "working successfully" });
        next();
      }
    });
  } catch (error) {
    console.log("error from verify token: ", error);
    return res.status(403).json({ message: "Some error occurs" });
  }
};
