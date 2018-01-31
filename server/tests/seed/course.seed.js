// Test lifecycle code:
// =========================
const {ObjectID} = require('mongodb');
const {Course} = require('./../../models/course');

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


// Now populate documents/data tables
const populateCourses = (done) => {
  Course.remove({}).then(() => {
    var courseOne = new Course(courses[0]).save();
    var courseTwo = new Course(courses[1]).save();

    return Promise.all([courseOne, courseTwo]);
  }).then(() => done());
};

module.exports = {
  courses,
  populateCourses,
};
