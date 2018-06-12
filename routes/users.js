'use strict';
 
const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');

const router = express.Router();

/***********POST ROUTER*********/
router.post('/',(req,res,next) => { 

  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ['username','password','fullname'];
  const nonStringField = stringFields.find(field => {
    return  field in req.body && typeof(req.body[field]) !== 'string';
  });

  if(nonStringField){
    const err = new Error(`Non string field - ${nonStringField} should be of type string`);
    err.status = 422;
    return next(err);
  }  

  const trimmedFields = ['username', 'password'];
  const whiteSpaceField = trimmedFields.find(field => {
    return req.body[field] !== req.body[field].trim();
  });

  if(whiteSpaceField){
    const err = new Error(`There are trailling white spaces in ${whiteSpaceField}`);
    err.status =422;
    return next(err);
  } 
  
  //size of fields
  const sizedFields = {username: {min:1},password: {min:8,max:72}};

  const smallField = Object.keys(sizedFields).find(key => {
    return req.body[key].lenght < sizedFields.key.min;
  });

  const largeField = Object.keys(sizedFields).find(key => {
    return req.body[key].lenght > sizedFields.key.max;
  });
  
  if(smallField){    
    const err = new Error(`Check ${smallField} size -- too small`);
    err.status =422;
    return next(err);
  }

  if(largeField){
    const err = new Error('Check ${smallField} size -- too big');
    err.status =422;
    return next(err);
  }

  const {fullname,username,password} = req.body;

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
});




module.exports = router;