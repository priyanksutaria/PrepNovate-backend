const mongoose = require('mongoose');
const Test = require('./models/Test'); // adjust the path as needed

mongoose
  .connect('mongodb://localhost:27017/PrepNote', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const testNums = [];

    for (let i = 1; i <= 3; i++) {
      for (let j = 0; j <= 10; j++) {
        for (let k = 0; k <= 11; k++) {
          const testnum = `${i}${j}${k}`;
          testNums.push(testnum);
        }
      }
    }

    for (const num of testNums) {
      const test = new Test({
        testnum: num,
        questions: [], // empty question list
      });
      await test.save();
      console.log(`Inserted testnum: ${num}`);
    }

    console.log(`✅ Inserted ${testNums.length} tests.`);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error connecting or inserting:', err);
  });