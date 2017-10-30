const express = require("express");
const expressJwt = require("express-jwt");

const config = require("../config");
const UserModel = require("../models/player.js");

const playerRoute = express.Router();
const authorization = expressJwt({ secret: config.secret });

playerRoute.use(authorization);

playerRoute.route("/verify")
  .get((req, res) => {
    UserModel.findById(req.user._id, (err, user) => {
      if (err) {
        res.status(500).send({
          success: false,
          err
        })
      } else {
        if (user === null) {
          res.status(404).send({
            success: false,
            err: "That user does not exist"
          })
        } else {
          res.status(200).send({
            success: true,
            user: user.withoutPwd()
          })
        }
      }
    })
  })

module.exports = playerRoute;

