const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.json());
const User = require("../user.model");
const bcrypt = require("bcryptjs");
const createJWTToken = require("../../utils/jwt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res, next) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();

    const { _id, __v, password, ...sanitisedUser } = newUser.toObject();
    res.json(sanitisedUser);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(user.username);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    // Can expiry date on cookie be changed? How about JWT token?
    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true, // client-side js cannot access cookie info
      secure: false, // use HTTPS
      signed: true
    });

    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

const protectRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("You are not authorized");
    }
    req.user = jwt.verify(req.signedCookies.token, process.env.JWT_SECRET_KEY);

    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

router.get("/:username", protectRoute, async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (req.user.username !== username) {
      const forbiddenUser = new Error("Forbidden");
      forbiddenUser.statusCode = 403;
      throw forbiddenUser;
    }
    if (!user) {
      const noUserErr = new Error("No such user");
      noUserErr.statusCode = 404;
      throw noUserErr;
    }

    const { _id, __v, password, ...sanitisedUser } = user.toObject();
    res.json(sanitisedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
