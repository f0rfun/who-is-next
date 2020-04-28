const express = require("express");
const app = express();
const gtechiesRoute = require("./src/routes/gtechies.route");
const userRoute = require("./src/routes/user.route");
const cookieParser = require("cookie-parser");

require("./utils/db");
const GovTechies = require("./src/govtechies.model");

const apiMenu = {
  "0": "GET    /",
  "1": "GET    /jumplings",
  "2": "POST   /jumplings",
  "3": "GET /jumplings/:id",
  "4": "PUT /jumplings/:id",
  "5": "DELETE /jumplings/:id",
  "6": "-----------------------",
  "7": "POST   /jumplings/presenters",
  "8": "GET    /jumplings/presenters"
};
app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.status(200);
  res.json(apiMenu);
});

app.use("/gtechies", gtechiesRoute);

app.use("/user", userRoute);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
