const express = require('express');
const router = express.Router();

// @route   GET api/contacts
// @desc    Get all user's contacts
// @access  Private
router.get('/', (req, res) => {
  res.send('Get all user\'s contacts route...');
});

// @route   POST api/contacts
// @desc    Add new contacts
// @access  Private
router.post('/', (req, res) => {
  res.send('Add new contact..');
});

// @route   PUT api/contacts
// @desc    Update contact
// @access  Private
router.put('/', (req, res) => {
  res.send('Updated a contact...');
});

// @route   DELETE api/contacts
// @desc    Delete contact
// @access  Private
router.delete('/:id', (req, res) => {
  res.send('Deleted a contact...');
});

module.exports = router;