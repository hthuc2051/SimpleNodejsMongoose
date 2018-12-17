const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail is existed'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "Create user successfully",
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => { // th user này sẽ là 1 array nhưng do mình đã chặn th trùng
            //email r nên đặt tên là user th chứ thực chất nó là userArr
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed1"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => { // truyền vô password user nhập và so sánh
                // vs password trong db ! Nếu sai gì thì gọi callback
                if (err) {
                    // thằng này cho TH để parameter sai vd email đúng mà để là pass2work -> k đúng tên param
                    return res.status(500).json({
                        message: "Auth failed2" 
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userID : user[0]._id
                        },
                            "secret",
                        {
                            expiresIn:"1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                // sai password
                res.status(401).json({
                    message: "Auth failed3"
                });
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            })
        });
});


router.delete('/:userID', (req, res, next) => {
    const id = req.params.userID;
    console.log(id);
    User.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            res.status(500).json({
                Error: err
            })
        });

});
module.exports = router;