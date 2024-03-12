const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user
    user = new User({
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User with this email does not exist" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect Password, please try again" });
    }

    // jwt payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY);

    const oneHour = 3600000; // milliseconds
    const expirationDate = new Date(Date.now() + oneHour);

    res.cookie("t", token, {
      sameSite: "None",
      expires: expirationDate,
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.signout = async (req, res) => {
  res.clearCookie("t");
  res.json({ msg: "Signed Out" });
};
