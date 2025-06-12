const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const user = require("../models/user");

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    activeTab: "login",
    currentPage: "login",
    isLoggedIn: req.session.isLoggedIn,
    user: {},
  });
};

exports.postLogin = async (req, res, next) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase(); // Normalize email to lowercase
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      activeTab: "login",
      currentPage: "login",
      isLoggedIn: false,
      errorMessages: ["User Does not Exist Please Signup"],
      oldInput: {
        email: email,
        password: password,
      },
      user: {},
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      activeTab: "login",
      currentPage: "login",
      isLoggedIn: false,
      errorMessages: ["Invalid Password"],
      oldInput: {
        email: email,
        password: password,
      },
      user: {},
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user; // Store user information in session
  await req.session.save();
  if (user.userType === "admin") {
    res.redirect("/admin");
  } else {
    res.redirect("/");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getsignup = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    activeTab: "signup",
    currentPage: "signup",
    isLoggedIn: req.session.isLoggedIn,
    user: {},
  });
};

exports.postsignup = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("First name must contain only letters"),
  check("lastName")
    .matches(/^[a-zA-Z]*$/)
    .withMessage("Last name must contain only letters"),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .trim(),
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["host", "guest"])
    .withMessage("User type must be either host or guest"),
  check("termsAccepted")
    .equals("on")
    .withMessage("You must accept the terms and conditions"),
  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        activeTab: "signup",
        currentPage: "signup",
        isLoggedIn: false,
        errorMessages: errors.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
        },
        user: {},
      });
    }
    // Here you would typically save the user to the database
    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        userType: userType,
      });

      user
        .save()
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
];
