exports.pageNotFound = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: "Page Not Found",
    user:  'logout',
    activeTab: '',
    user: req.session.user,
    isLoggedIn: req.session.isLoggedIn,
  });
}