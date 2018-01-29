// --- Mocha Server Test file
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Student} = require('./../models/student');
const {students,populateStudents} = require('./seed/student.seed');

// Test lifecycle code:
// ======================

// Now clear collection and then repopluate with seed data
//  before EACH execution of EACH Test.

beforeEach(populateStudents);

describe('/POST Students', () => {
  it('Should create a student', (done) => {
    let firstName = 'Race';
    let lastName = 'Bannon'
    let status = 'active';
    const studentObject = { firstName, lastName, status }
    request(app)
      .post('/student')
      .send(studentObject)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toExist();
        expect(res.body.firstName).toBe(firstName);
        expect(res.body.lastName).toBe(lastName);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Student.find({ firstName, lastName }).then((students) => {
          expect(students.length).toBe(1);
          expect(students[0].firstName).toBe(firstName);
          expect(students[0].lastName).toBe(lastName);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /Student list', () => {
  it('Should return a list of all students', (done) => {
    request(app)
      .get('/student')
      .expect(200)
      .expect((res) => {
        expect(res.body.students.length).toBe(2);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('Should return a list of all students by location', (done) => {
    // *** Add parameter to optionally pass in location ID
    // request(app)
    //   .get('/student')
    //   .expect(200)
    //   .expect((res) => {
    //     expect(res.body.students.length).toBe(2);
    //   })
    //   .end((err, res) => {
    //     if (err) {
    //       return done(err);
    //     }
        done();
      // });
  });
});
