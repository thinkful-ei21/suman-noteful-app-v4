'use strict';
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');

// ===== Define and create basicStrategy =====
const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User.findOne({ username })
    .then(results => {
      user = results;
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username'
        });
      }
      if(user){
        //check if the number of characters in user is more than 1 if not reject a promise

      }
      //const isValid = user.validatePassword(password);
      return user.validatePassword(password);
    })   
    .then(isValid => {
      if(!isValid){
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password',
          location: 'password'
        });
      }
      //check if the password was a minimum length of 8 and maximum f 72 , if not reject the promise.
      
      return done(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;