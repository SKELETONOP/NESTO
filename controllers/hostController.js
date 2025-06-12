const Home = require("../models/home");


exports.getAddHome = (req, res) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    activeTab: "Add-home",
    currentPage: "Add-home",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user
  });
};

exports.getEditHome = (req, res) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  // console.log(homeId, editing);
  Home.findById(homeId).then(homes => {
    if (!homes || homes.length === 0) {
      console.log("home not found");
      res.redirect("/host/host-home-list");
    }
    res.render("host/edit-home", {
      home: homes,
      pageTitle: "Edit Home",
      activeTab: "edit-home",
      currentPage: "Host-home",
      editing: editing,
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.postEditHome = (req, res, next)=>{
  const {id, houseName, ownerName, pricePerNight, location, rating, imgUrl, description } =
    req.body;

  Home.findById(id).then((home) => {
    
    home.houseName = houseName;
    home.ownerName = ownerName;
    home.pricePerNight = pricePerNight;
    home.location = location;
    home.rating = rating;
    home.imgUrl = imgUrl;
    home.description = description;
    home.save().then((result) => {
      console.log("Home updated successfully");
      res.redirect("/host/host-home-list");
    }).catch(error => {
      console.log("error while saving home", error);
      res.redirect("/host/host-home-list");
    }).catch(error => {
      console.log("error while finding home", error);
      res.redirect("/host/host-home-list");
    });
    
  });
}

exports.postAddHome = (req, res) => {
  const { houseName, ownerName, pricePerNight, location, rating, imgUrl, description } =
    req.body;

   const home = new Home(
    {houseName ,
    ownerName ,
    pricePerNight ,
    location ,
    rating ,
    imgUrl,
    description} 
  );

  home.save().then(()=>{
    console.log("Home saved successfully")
  });
  res.redirect("host-home-list")
 
};

exports.getHostHome = (req, res) => {
  Home.find().then(homes => {
    res.render("host/host-home-list", {
      homes: homes,
      pageTitle: "Host Homes List",
      activeTab: "Host-homes",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user
    });
  });
};


exports.postDeleteHome = (req, res, next)=>{
  const homeId = req.params.homeId;
  console.log("came for delete",homeId)
  Home.findByIdAndDelete(homeId).then(result =>{
    console.log("Home Deleted successfully")
    res.redirect("/host/host-home-list")
  }).catch(error =>{
    console.log("error while deleting", error)
  });
}
