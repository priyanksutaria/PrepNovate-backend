const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentPlan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
    required: true,
  },
  testGiven: [
    {
      testnum: {
        type: String,
      },
      score: {
        type: Number,
      },
    },
  ],
  MockTestGiven: [
    {
      testnum: {
        type: String,
      },
      score: {
        type: Number,
      },
    },
  ],
});

module.exports = User;
