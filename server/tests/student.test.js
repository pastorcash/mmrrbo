// --- Mocha Server Test file
const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');

const {Student} = require('./../models/student');
const {
// students,
  populateStudents,
} = require('./seed/student.seed');
// const {users} = require('./seed/seed');

// Test lifecycle code:
// ======================

// Now clear collection and then repopluate with seed data
//  before EACH execution of EACH Test.
beforeEach(populateStudents);

describe('/POST Students', () => {
  it('Should create a student', (done) => {
    let firstName = 'Johnny';
    let lastName = 'Quest'
    let status = 'active';
    const studentObject = {name, status}
    request(app)
      .post('/student')
      .send(studentObject)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toExist();
        expect(res.body.firstName).toBe(firstName);
        expect(res.body.lastName).toBe(lastName);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        Student.find({name}).then((students) => {
          expect(students.length).toBe(1);
          expect(students[0].firstName).toBe(firstName);
          expect(students[0].lastName).toBe(lastName);
          done();
        }).catch((e) => done(e));
      });
  });
});