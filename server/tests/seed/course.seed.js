// Test lifecycle code:
// =========================
const { ObjectID } = require('mongodb');
const { Course } = require('./../../models/course');
const { User } = require('./../../models/user');
const { Student } = require('./../../models/student');

// Create and seed two courses
const courseOneId = new ObjectID();
const courseTwoId = new ObjectID();

const courses = [{
  _id: courseOneId,
  name: 'Novel A',
  meetingTimes: [{
    dayOfTheWeek: 'monday',
    time: new Date().getTime(),
  }, {
    dayOfTheWeek: 'thursday',
    time: new Date().getTime(),
  }
  ],
  students: [],
  teachers: [],
  status: 'active',
}, {
  _id: courseTwoId,
  name: 'Bookworms A',
  meetingTimes: [{
    dayOfTheWeek: 'monday',
    time: new Date().getTime(),
  }, {
    dayOfTheWeek: 'thursday',
    time: new Date().getTime(),
  }
  ],
  students: [],
  teachers: [],
  status: 'archive',
}];


// This function (below) gave me significant problems. 
// Mongoose seems to have a problem with the mix of Promises/Callbacks/ async-await.
// After writing muliple versions of functions being pure or mixing the methods ... 
// I had to settle on using Mongoose version 4.13.10 (not version 5) and 
// removing the following error check from file: runnalble.js
//   "return done(new Error('Resolution method is overspecified. Specify a callback *or* return a Promise; not both.'));"
// The code below seems to be the only way to acutally get the data written to the database.
// Any other logic seemed to hang on the collection.remove() function ... or on the collection.find()
// I would receive multiple timeouts or unhandle Promise reject calls. 
// Pure callback chains would not get past the collection.remove () function
// Pure promise calls would miss the rtv of data from the collection.find() call 
// (and this included using Promise.all) 
// If if did not put in the "done()", I would recieve a timeout error.
// If I added it, then I would get the resolution overspecified error - mentioned above.
// Mongoose version 5 would timeout during the collection.remove call reguardless of the logic I used.
//
// One last note ... I have a suspicion that this occurs only because of the beforeEach process.
// I will test this out on the development (non-test) code and verify this suspicion.
//
const populateCourses = async (done) => {
  try {
    await Course.remove({}).exec();
    const teachers = await User.find({ roles: { $in: ['teacher'] } });
    if (!teachers) {
      // do nothing
    } else {
      courses[0].teachers = teachers;
      courses[1].teachers = teachers;
    }

    const students = await Student.find();
    if (!students) {
      // do nothing
    } else {
      courses[0].students = students;
      courses[1].students = students;
    }

    const courseOne = await new Course(courses[0]).save();
    const courseTwo = await new Course(courses[1]).save();
    done();
  } catch (err) {
    console.log('ERROR ', err);
  }
};

module.exports = {
  courses,
  populateCourses,
};
