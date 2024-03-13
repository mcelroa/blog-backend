require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.t;

  if (!token) {
    return res.status(401).json({ msg: "No token, auth denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token not valid" });
  }
};
