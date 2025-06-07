const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const checkAdmin = require('../utils/checkAdmin');

router.get('/getTest', testController.getTest);
router.post('/addQuestion', checkAdmin, testController.addQuestion);
router.put('/updateQuestion', checkAdmin, testController.updateQuestion);
router.post('/addBulkQuestion', checkAdmin, testController.bulkAdd);
router.delete('/deleteQuestion', checkAdmin, testController.deleteQuestion);

//Mock Test
router.post('/addMockTest', checkAdmin, testController.addMockTest);
router.get('/getMockTest', testController.getMockTest);
router.get('/getAllMockTest', testController.getAllMockTest);
router.post('/deleteMockTest', checkAdmin, testController.deleteMockTest);

//Give Test
router.post('/giveTest', testController.giveTest);
router.get('/getLeaderboard', testController.getLeaderBoard);

//Give Mock Test
router.post('/giveMockTest', testController.giveMockTest);
router.get('/getLeaderboardMockTest', testController.getLeaderBoardMockTest);

module.exports = router;
