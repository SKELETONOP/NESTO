// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Modules
const hostController = require("../controllers/hostController");


hostRouter.get("/add-home", hostController.getAddHome);

// POST route to handle form submission
hostRouter.post("/add-home", hostController.postAddHome);

// List all homes for the host
hostRouter.get("/host-home-list", hostController.getHostHome);

// Edit home routes
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post("/edit-home", hostController.postEditHome);

// Delete home
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);

// Named export so you can do: const { hostRouter } = require('./routes/host.routes');
exports.hostRouter = hostRouter;
