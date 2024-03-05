const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Routes
const authRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// MongoDB Configuration
const mongoURI = "mongodb+srv://adammcelroy:TopHatMan15@blog.urblksr.mongodb.net/";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes Middleware
app.use("/api", authRoutes);
app.use("/api", postRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
