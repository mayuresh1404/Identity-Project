require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const contactRoutes = require("./routes/contact"); // Ensure the path is correct

const app = express();
app.use(express.json());

// Use the routes with a base path of '/api'
app.use("/api", contactRoutes);

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
