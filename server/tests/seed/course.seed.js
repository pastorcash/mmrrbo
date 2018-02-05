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

//
const populateCourses = async () => {
  try {
    await Course.remove({});
    const teachers = await User.find({ roles: { $in: ['teacher'] } });
     if (teachers.length > 0) {
      courses[0].teachers = teachers;
      courses[1].teachers = teachers;
    }
    const students = await Student.find();
     if (students.length > 0) {
      courses[0].students = students;
      courses[1].students = students;
    }
    const courseOne = await new Course(courses[0]).save();
    const courseTwo = await new Course(courses[1]).save();
    return;
  } catch (err) {
    console.log('ERROR ', err);
  }
};

module.exports = {
  courses,
  populateCourses,
};
