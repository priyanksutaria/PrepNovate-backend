const { TokenExpiredError } = require('jsonwebtoken');
const MockTest = require('../models/MockTest');
const Test = require('../models/Test');
const sendResponse = require('../utils/sendResponce');
const Leaderboard = require('../models/Leaderboard');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.addQuestion = async (req, res) => {
  try {
    const { testnum, question } = req.body;

    if (
      !testnum ||
      !question ||
      !question.question ||
      !Array.isArray(question.options) ||
      !question.answer
    ) {
      return sendResponse(res, 400, false, 'Missing required question fields');
    }

    const test = await Test.findOne({ testnum });

    if (!test) {
      return sendResponse(res, 404, false, 'Test not found');
    }
    const questionNo = test.questions.length + 1;
    const newQuestion = {
      questionNo,
      question: question.question,
      options: question.options,
      answer: question.answer,
    };

    test.questions.push(newQuestion);
    await test.save();

    sendResponse(res, 200, true, 'Question added successfully', newQuestion);
  } catch (error) {
    console.error('Add Question Error:', error.message);
    sendResponse(res, 500, false, 'Server Error');
  }
};
exports.updateQuestion = async (req, res) => {
  try {
    const { testnum, question, questionNo } = req.body;

    if (
      !testnum ||
      !question ||
      typeof questionNo !== 'number' ||
      !question.question ||
      !Array.isArray(question.options) ||
      !question.answer
    ) {
      return sendResponse(
        res,
        400,
        false,
        'Missing or invalid question fields'
      );
    }

    const test = await Test.findOne({ testnum });

    if (!test) {
      return sendResponse(res, 404, false, 'Test not found');
    }

    // Find the index of the question to update
    const index = test.questions.findIndex((q) => q.questionNo === questionNo);

    if (index === -1) {
      return sendResponse(res, 404, false, `Question ${questionNo} not found`);
    }

    // Update the existing question
    test.questions[index] = {
      questionNo,
      question: question.question,
      options: question.options,
      answer: question.answer,
    };

    await test.save();

    sendResponse(
      res,
      200,
      true,
      'Question updated successfully',
      test.questions[index]
    );
  } catch (error) {
    console.error('Update Question Error:', error.message);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.bulkAdd = async (req, res) => {
  try {
    const { testnum, questions } = req.body;
    if (!testnum || !Array.isArray(questions)) {
      return sendResponse(res, 400, false, 'Invalid request body');
    }
    const test = await Test.findOne({ testnum });
    if (!test) {
      return sendResponse(res, 404, false, 'Test not found');
    }

    const questionLength = test.questions.length;
    for (let i = 0; i < questions.length; i++) {
      questions[i].questionNo = questionLength + i + 1;
    }

    test.questions.push(...questions);
    await test.save();
    sendResponse(res, 200, true, 'Questions added successfully');
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { testnum, questionNo } = req.body;

    if (!testnum || !questionNo) {
      return res.status(400).json({
        success: false,
        message: 'Test number and question number are required',
      });
    }

    // Find the test by testnum
    const test = await Test.findOne({ testnum });
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: 'Test not found' });
    }

    // Find the question by questionNo and remove it
    const questionIndex = test.questions.findIndex(
      (q) => q.questionNo === questionNo
    );

    if (questionIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Question not found' });
    }

    // Remove the question
    test.questions.splice(questionIndex, 1);

    for (let i = questionIndex; i < test.questions.length; i++) {
      test.questions[i].questionNo--;
    }

    await test.save();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.addMockTest = async (req, res) => {
  try {
    console.log('gi');
    const {
      name,
      noofquestions,
      timelimit,
      passingscore,
      description,
      weightage,
    } = req.body;

    toAddQuestions = [];
    for (const key in weightage) {
      if (weightage.hasOwnProperty(key)) {
        const tofindQuestions = Math.round(
          (noofquestions * weightage[key]) / 100
        );

        const randomQuestions = await Test.aggregate([
          { $match: { testnum: key } },
          { $unwind: '$questions' },
          { $sample: { size: tofindQuestions } },
          { $replaceRoot: { newRoot: '$questions' } },
        ]);

        toAddQuestions.push(...randomQuestions);
      }
    }
    const mockTest = new MockTest({
      name,
      noofquestions,
      timelimit,
      passingscore,
      description,
      weightage,
      questions: toAddQuestions,
    });

    await mockTest.save();
    sendResponse(res, 200, true, 'Mock Test added successfully', mockTest);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.getMockTest = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return sendResponse(res, 400, false, 'Test name is required');
    }
    const test = await MockTest.findOne({ name });
    if (!test) {
      return sendResponse(res, 404, false, 'Test not found');
    }
    sendResponse(res, 200, true, 'Test fetched successfully', test);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.deleteMockTest = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return sendResponse(res, 400, false, 'Test name is required');
    }
    const test = await MockTest.findOneAndDelete({ name });
    if (!test) {
      return sendResponse(res, 404, false, 'Test not found');
    }
    sendResponse(res, 200, true, 'Test deleted successfully');
  } catch (error) {
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.getTest = async (req, res) => {
  try {
    const { testnum } = req.query;
    if (!testnum) {
      return sendResponse(res, 400, false, 'Test number is required');
    }
    const test = await Test.findOne({ testnum });
    sendResponse(res, 200, true, 'Test fetched successfully', test);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};
exports.getAllMockTest = async (req, res) => {
  try {
    const tests = await MockTest.find({}).select('-questions');
    sendResponse(res, 200, true, 'Tests fetched successfully', tests);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.giveTest = async (req, res) => {
  try {
    const { testnum, score } = req.body;
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return sendResponse(
        res,
        401,
        false,
        'Not authorized to access this route'
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return sendResponse(
        res,
        401,
        false,
        'Not authorized to access this route'
      );
    }
    const user = await User.findOne({ username: decoded.username });

    // Find if user has already given this test
    const testIndex = user.testGiven.findIndex(
      (test) => test.testnum === testnum
    );

    const uniqueTestsGiven = new Set(user.testGiven.map((t) => t.testnum));

    if (decoded.currentPlan === 'free') {
      if (testIndex !== -1) {
        return sendResponse(
          res,
          400,
          false,
          'Free plan users cannot retake a test.'
        );
      }

      if (!uniqueTestsGiven.has(testnum) && uniqueTestsGiven.size >= 2) {
        return sendResponse(
          res,
          400,
          false,
          'You have already given 2 tests. Upgrade your plan to give more tests.'
        );
      }
    }

    // For both free and premium: update or insert testGiven entry
    if (testIndex !== -1) {
      // If new score is better, update it
      if (score > user.testGiven[testIndex].score) {
        user.testGiven[testIndex].score = score;
      }
    } else {
      // New test entry
      user.testGiven.push({ testnum, score });
    }

    await user.save();

    // Leaderboard logic
    const existingEntry = await Leaderboard.findOne({
      testnum,
      email: user.email,
    });

    if (existingEntry) {
      if (score > existingEntry.score) {
        await Leaderboard.findByIdAndUpdate(existingEntry._id, { score });
      }
    } else {
      await Leaderboard.create({ testnum, score, email: user.email });
    }

    return sendResponse(res, 200, true, 'Test given successfully');
  } catch (error) {
    console.error('Error in giveTest:', error);
    return sendResponse(res, 500, false, 'Server Error');
  }
};

exports.getLeaderBoard = async (req, res) => {
  try {
    const { testnum } = req.query;
    const leaderboard = await Leaderboard.find({ testnum }).sort({ score: -1 });
    sendResponse(
      res,
      200,
      true,
      'Leaderboard fetched successfully',
      leaderboard
    );
  } catch (error) {
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.getLeaderBoardMockTest = async (req, res) => {
  try {
    const { testnum } = req.query;
    const leaderboard = await Leaderboard.find({ testnum }).sort({
      score: -1,
    });
    sendResponse(
      res,
      200,
      true,
      'Leaderboard fetched successfully',
      leaderboard
    );
  } catch (error) {
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.giveMockTest = async (req, res) => {
  try {
    const { testnum, score } = req.body;
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return sendResponse(
        res,
        401,
        false,
        'Not authorized to access this route'
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return sendResponse(
        res,
        401,
        false,
        'Not authorized to access this route'
      );
    }
    const user = await User.findOne({ username: decoded.username });

    // Find if user has already given this test
    const testIndex = user.MockTestGiven.findIndex(
      (test) => test.testnum === testnum
    );

    const uniqueTestsGiven = new Set(user.MockTestGiven.map((t) => t.testnum));

    if (decoded.currentPlan === 'free') {
      if (testIndex !== -1) {
        return sendResponse(
          res,
          400,
          false,
          'Free plan users cannot retake a test.'
        );
      }

      if (!uniqueTestsGiven.has(testnum) && uniqueTestsGiven.size >= 1) {
        return sendResponse(
          res,
          400,
          false,
          'You have already given 1 Mock test. Upgrade your plan to give more tests.'
        );
      }
    }

    // For both free and premium: update or insert testGiven entry
    if (testIndex !== -1) {
      // If new score is better, update it
      if (score > user.MockTestGiven[testIndex].score) {
        user.MockTestGiven[testIndex].score = score;
      }
    } else {
      // New test entry
      user.MockTestGiven.push({ testnum, score });
    }

    await user.save();

    // Leaderboard logic
    const existingEntry = await Leaderboard.findOne({
      testnum,
      email: user.email,
    });

    if (existingEntry) {
      if (score > existingEntry.score) {
        await Leaderboard.findByIdAndUpdate(existingEntry._id, { score });
      }
    } else {
      await Leaderboard.create({
        testnum,
        score,
        email: user.email,
      });
    }

    return sendResponse(res, 200, true, 'Test given successfully');
  } catch (error) {
    console.error('Error in giveTest:', error);
    return sendResponse(res, 500, false, 'Server Error');
  }
};
