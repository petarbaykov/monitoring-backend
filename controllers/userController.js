// controllers/userController.js
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.register = (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err });
    User.insert({ username, password: hash })
      .then(user => res.status(201).json({ message: 'User registered successfully' }))
      .catch(err => res.status(400).json({ error: err }));
  });
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json(info);
    req.login(user, err => {
      if (err) return next(err);
      return res.json({ message: 'Login successful' });
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ username: req.user.username });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};