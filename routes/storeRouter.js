const express = require('express');
const StoreRouter = express.Router();
const {
  getHome,
  getBookings,
  getFavourite,
  getIndex,
  getHomeDetails,
  postAddToFavourites,
  postRemoveFromFavourites,
  postAddToBookings,
  postRemoveFromBookings,
  getHelp,
} = require('../controllers/storeController');

// ✅ Cleaned Routes (no /store prefix)
StoreRouter.get("/", getHome);
StoreRouter.get("/store/index", getIndex);
StoreRouter.get("/store/bookings", getBookings);
StoreRouter.post("/store/bookings", postAddToBookings);
StoreRouter.post("/bookings/delete/:homeId", postRemoveFromBookings);
StoreRouter.get("/store/favourites", getFavourite);
StoreRouter.post("/store/favourites", postAddToFavourites);
StoreRouter.post("/favourites/delete/:homeId", postRemoveFromFavourites);
StoreRouter.get("/homes/:id", getHomeDetails);
StoreRouter.get("/help", getHelp);

module.exports = StoreRouter;
