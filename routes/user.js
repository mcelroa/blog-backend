const express = require("express");
const router = express.Router();

const { signup, signin, signout } = require("../controllers/user");

// Sign Up
router.post("/signup", signup);

// Sign In
router.post("/signin", signin);

// Sign Out
router.post("/signout", signout);

module.exports = router;
