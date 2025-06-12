const express = require('express');
const adminRouter = express.Router();

const adminController = require('../controllers/adminController');

// Admin dashboard
adminRouter.get("/admin", adminController.getAdmin);

// View user details by ID
adminRouter.get('/admin/user/details/:id', adminController.getUserDetails);

module.exports = adminRouter;
