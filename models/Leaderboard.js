const mongoose = require('mongoose');

const Leaderboard = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  testnum: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Leaderboard', Leaderboard);
