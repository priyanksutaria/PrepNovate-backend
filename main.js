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

    const readingsPerPaper = {
      1: 5,
      2: 12,
      3: 7,
      4: 10,
      5: 11,
      6: 8,
      7: 7,
      8: 8,
      9: 19,
      10: 6,
    };

    const level = 1;

    for (let paper = 1; paper <= 10; paper++) {
      const totalChapters = readingsPerPaper[paper];
      for (let chapter = 1; chapter <= totalChapters; chapter++) {
        testNums.push(`${level}-${paper}-${chapter}`);
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