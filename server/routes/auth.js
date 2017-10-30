const express = require("express");
const passport = require("passport");
const Strategy = require("passport-local");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/player.js");
const config = require("../config");

const authRoute = express.Router();

passport.use(new Strategy((usernameAttempt, pwdAttempt, done) => {
    UserModel.findOne({ username: usernameAttempt }, (err, user) => {
        if (err) {
            done(err, false);
        } else if (user === null) {
            done(null, false);
        } else {
            user.auth(pwdAttempt, (isMatch) => {
                done(null, isMatch);
            })
        }
    })
}));

authRoute.use(passport.initialize());

authRoute.route("/signup")
    .post((req, res) => {
        UserModel.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    err
                })
            } else {
                if (user !== null) {
                    res.status(401).send({
                        success: false,
                        err: "That user already exists!"
                    })
                } else {
                    let newUser = new UserModel(req.body);
                    newUser.save((err, user) => {
                        if (err) {
                            res.status(500).send({
                                success: false,
                                err
                            });
                        } else {
                            res.status(201).send({
                                user: user.withoutPwd(),
                                success: true,
                                token: jwt.sign(user.withoutPwd(), config.secret, { expiresIn: 90 * 60 })
                            })
                        }
                    })
                }
            }
        })
    });

authRoute.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
    UserModel.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                success: false,
                err
            });
        } else if (user === null) {
            res.status(404).send({
                success: false,
                err: "That user does not exist"
            })
        } else {
            res.status(200).send({
                user: user.withoutPwd(),
                success: true,
                token: jwt.sign(user.withoutPwd(), config.secret, { expiresIn: 30 * 60 })
            })
        }
    })
});

module.exports = authRoute;
