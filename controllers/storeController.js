const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res) => {
  Home.find().then((homes) => {
    res.render("store/index", {
      homes: homes,
      pageTitle: "Index",
      activeTab: "index",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user, // Pass user info to the view
    });
  });
};

exports.getHome = (req, res) => {
  const user = req.session.user;
  if(user){
     Home.find().then((homes) => {
    res.render("store/home-list", {
      homes: homes,
      pageTitle: "Home",
      activeTab: "home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user, // Pass user info to the view
    });
  });
  }else{
    res.redirect("/login")
  }
 
};

exports.getHomeDetails = (req, res) => {
  const homeId = req.params.id;

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      return res.redirect("/");
    }
    res.render("store/home-details", {
      home: home,
      pageTitle: home.houseName,
      activeTab: "home",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user, // Pass user info to the view
    });
  });
};

exports.getBookings = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate("bookings");
    
    if (!user) {
      return res.redirect("/login");
    }
    
    res.render("store/bookings-list", {
      pageTitle: "My Bookings",
      bookings: user.bookings, // Now this is an array of populated Home objects
      activeTab: "bookings",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Internal server error");
  }
};

exports.postAddToBookings = async (req, res) => {
  try {
    const homeId = req.body.homeId;
    console.log("Adding to bookings:", homeId);
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.redirect("/login");
    }
    
    // Check if already booked (comparing ObjectIds)
    const alreadyBooked = user.bookings.some(
      (bookingId) => bookingId.toString() === homeId
    );
    
    if (!alreadyBooked) {
      user.bookings.push(homeId);
      await user.save();
    }
    
    res.redirect("/store/bookings");
  } catch (error) {
    console.error("Error adding to bookings:", error);
    res.status(500).send("Internal server error");
  }
};

exports.postRemoveFromBookings = async (req, res) => {
  try {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.redirect("/login");
    }
    
    // Remove the booking using pull method (more efficient)
    user.bookings.pull(homeId);
    await user.save();
    
    res.redirect("/store/bookings");
  } catch (error) {
    console.error("Error removing booking:", error);
    res.status(500).send("Internal server error");
  }
};

exports.getFavourite = async (req, res, next) => {
  const userId = req.session.user._id; // Assuming user ID is stored in session
  const user = await User.findById(userId).populate("favourites");
  res.render("store/favourite-list", {
    homes: user.favourites,
    pageTitle: "My Favourites",
    activeTab: "favourites",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user, // Pass user info to the view
  });
};

exports.postAddToFavourites = async (req, res) => {
  const homeId = req.body.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/store/favourites");
};

exports.postRemoveFromFavourites = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;

  const user = await User.findById(userId);
  user.favourites.pull(homeId);
  await user.save();

  res.redirect("/store/favourites");
};

exports.getHelp = (req, res) => {
  res.render("store/help", {
    pageTitle: "Help",
    activeTab: "help",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user, // Pass user info to the view
  });
};