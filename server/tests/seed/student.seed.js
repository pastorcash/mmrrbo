// Test lifecycle code:
// =========================
const {ObjectID} = require('mongodb');


const {Student} = require('./../../models/student');

// Create and seed two users
const studentOneId = new ObjectID();
const studentTwoId = new ObjectID();

const students = [{
  _id: studentOneId,
  firstName: 'Johnny',
  lastName: 'Quest',
  gender: 'male',
  dateOfBirth: null,
  registrationDate: new Date().getTime(),
  classStartDate: new Date().getTime(),
  school: 'Pine River Elementary School',
  grade: 5,
  status: 'active',
  highestAchievedLevel: 10,
  notes: 'Jonny Quest is a media franchise that revolves around a boy named Jonny Quest who accompanies his scientist father on extraordinary adventures',
  createdAt: new Date().getTime(),
}, {
  _id: studentTwoId,
  firstName: 'Hadji',
  lastName: 'Quest',
  gender: 'male',
  dateOfBirth: null,
  registrationDate: new Date().getTime(),
  classStartDate: new Date().getTime(),
  school: 'Pine River Elementary School',
  grade: 5,
  status: 'active',
  highestAchievedLevel: 12,
  notes: 'Hadji is a streetwise 11-year-old Kolkata orphan who becomes the adopted son of Dr. Benton Quest and also Jonnys best friend and adoptive brother.',
  createdAt: new Date().getTime(),
}
];


// Now populate documents/data tables
const populateStudents = (done) => {
  Student.remove({}).then(() => {
    var studentOne = new Student(students[0]).save();
    var studentTwo = new Student(students[1]).save();

    return Promise.all([studentOne, studentTwo]);
  }).then(() => done());
};

module.exports = {
  students,
  populateStudents,
};
