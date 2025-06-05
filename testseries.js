const mongoose = require('mongoose');
const Test = require('./models/Test'); // adjust the path as needed

mongoose
  .connect(
    'mongodb+srv://prepnovateofficial:qWErMy9DMGslxd6R@prepnote.znaxzr3.mongodb.net/PrepNote?retryWrites=true&w=majority&appName=PrepNote',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const testNums = [];

    for (let i = 1; i <= 3; i++) {
      for (let j = 0; j <= 10; j++) {
        for (let k = 0; k <= 11; k++) {
          const testnum = `${i}${j}${k}`; // ✅ use template string
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
      console.log(`Inserted testnum: ${num}`); // ✅ correct template literal
    }

    console.log(`✅ Inserted ${testNums.length} tests.`); // ✅ correct template literal
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error connecting or inserting:', err);
  });
