const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');


// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    // if no user exists, create a new one
    user = new User({
      name,
      email,
      password
    });
    // encrypt the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save the user to the database
    await user.save();

    // give the user a token that lasts for an hour
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