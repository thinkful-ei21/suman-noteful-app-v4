'use strict';

const express = require('express');
//const User = require('../models/user');
const passport = require('passport');
const router = express.Router();

const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, function (req, res) {
  return res.json(req.user);
});

module.exports = router;