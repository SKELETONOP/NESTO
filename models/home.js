const mongoose = require("mongoose");


const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  ownerName: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  imgUrl: String,
  description: String,
});

// homeSchema.pre('findOneAndDelete', async function(next) {
//   const homeId = this.getQuery()._id;
//   await favourite.deleteMany({ houseId: homeId });
//   next();
// });

module.exports = mongoose.model('Home', homeSchema);

