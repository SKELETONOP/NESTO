const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["host", "guest"], required: true },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
});
module.exports = mongoose.model("User", userSchema);
