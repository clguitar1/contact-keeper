const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth.middleware');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Protected route. Uses json web token to access logged in user's data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // if user is authorized with a token, send back the user info without the password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});

// @route   POST api/auth
// @desc    Login, authenticate user and get token
// @access  Public
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    // check for user
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // check for matching password
    const isMatch = await bcrypt.compare(password, user.password);
    // if password doesn't match
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // if the password does match, give them a token that lasts for an hour
    const payload = {
      user: {
        id: user.id
      }
    }
    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 3600
    }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});

module.exports = router;