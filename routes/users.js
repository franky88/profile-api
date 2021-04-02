const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/', (req, res, next) => {
    User.find()
    .then((data) => res.json(data))
    .catch(next)
});

router.post('/', (req, res, next) => {
    const user = new User({
        userName: req.body.userName,
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

router.get('/:userID', (req, res, next) => {
    User.findById({"_id": req.params.userID})
    .then(data => res.json(data))
    .catch(next)
    // console.log(req.params.userID);
});

router.patch('/email-update/:userID', (req, res, next) => {
    User.updateOne({"_id": req.params.userID}, {$set: { email: req.body.email }})
    .then(data => res.json(data))
    .catch(next)
    // console.log(req.params.userID);
});

router.delete('/:userID', (req, res, next) => {
    User.findOneAndDelete({"_id": req.params.userID})
      .then(data => res.json(data))
      .catch(next)
  })

module.exports = router