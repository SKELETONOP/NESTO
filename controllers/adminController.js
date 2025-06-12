const User = require('../models/user');

// GET: Admin Dashboard
exports.getAdmin = async (req, res) => {
  if (!req.session.isLoggedIn || req.session.user?.userType !== 'admin') {
    return res.redirect('/');
  }

  try {
    const users = await User.find({}, 'firstName lastName email userType favourites bookings');

    const totalUsers = users.length;
    const totalFavourites = users.reduce((sum, user) => sum + (user.favourites?.length || 0), 0);
    const totalBookings = users.reduce((sum, user) => sum + (user.bookings?.length || 0), 0);

    const userDetails = users.map(user => ({
      id: user._id,
      fullName: `${user.firstName} ${user.lastName || ''}`.trim(),
      email: user.email,
      userType: user.userType,
      favourites: user.favourites.length,
      bookings: user.bookings.length
    }));

    res.render("admin/n-Admin", {
      pageTitle: "Admin",
      activeTab: "Admin",
      currentPage: "Admin",
      isLoggedIn: true,
      isAdmin: true,
      totalUsers,
      totalFavourites,
      totalBookings,
      userDetails
    });

  } catch (error) {
    console.error("Admin panel error:", error);
    res.status(500).send("Internal server error");
  }
};

// GET: View specific user details by ID
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('favourites')
      .populate('bookings');

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("admin/userDetails", {
      pageTitle: `${user.firstName} ${user.lastName || ''} Details`,
      user
    });

  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("Server error");
  }
};
