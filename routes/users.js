'use strict';
 
const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');

const router = express.Router();

/***********POST ROUTER*********/
router.post('/',(req,res,next) => {
  const { fullname, username, password } = req.body; 
  
  if(!username){
    const err = new Error('User Name cannot be empty');
    err.status = 404;
    return next(err);
  }

  if(!password){
    const err = new Error('Password cannot be empty');
    err.status = 404;
    return next(err);
  }

  //const newUser = {fullname,username,password};
  

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
  // User.create(newUser)
  //   .then(result => {
  //     res.location(`${req.originalUrl}/${result.username}`).status(201).json(result);
  //     //res.json(result);
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
});




module.exports = router;