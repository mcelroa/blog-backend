const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth");

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Configuration
const mongoURI = "mongodb+srv://adammcelroy:TopHatMan15@blog.urblksr.mongodb.net/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
