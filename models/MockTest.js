const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionNo: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [String],
  answer: {
    type: String,
    required: true,
  },
});

// Define the Question schema
const MockSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  noofquestions: {
    type: Number,
    required: true,
  },
  timelimit: {
    type: Number,
    required: true,
  },
  passingscore: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [QuestionSchema],
});

const MockTest = mongoose.model('MockTest', MockSchema);

module.exports = MockTest;
