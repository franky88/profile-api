const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/models');
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// url //api/register
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });

router.post("/login", (req, res) => {
// Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
    // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
        // Sign token
                jwt.sign(
                    payload,
                    process.env.KEYS,
                {
                    expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                }
                );
            } else {
                return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

router.get('/', (req, res, next) => {
    User.find()
    .then((data) => res.json(data))
    .catch(next)
});

router.post('/', (req, res, next) => {
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });
    if(user){
         User.create(req.body)
        .then((data) =>
            res.json(data)
        )
        .catch(next)
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
    // console.log(user)
});

router.get('/:userId', (req, res, next) => {
    User.findById({"_id": req.params.userId})
    .then(data => res.json(data))
    .catch(next)
    // console.log(req.params.userID);
});

router.patch('/:userId', (req, res, next) => {
    User.updateOne({"_id": req.params.userId},
    { $set: {
      email: req.body.email,
      isActive: req.body.isActive,
      isAdmin: req.body.isAdmin,
      items: req.body.items
    }})
    .then(data => res.json(data))
    .catch(next)
    // console.log(req.params.userID);
});

router.delete('/:userId', (req, res, next) => {
    User.findOneAndDelete({"_id": req.params.userId})
      .then(data => res.json(data))
      .catch(next)
  })

module.exports = router
