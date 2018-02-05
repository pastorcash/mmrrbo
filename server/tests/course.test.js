// --- Mocha Server Test file
const expect = require('expect');
const request = require('supertest');
// const {ObjectID} = require('mongodb');

const {app} = require('./../server');
// const {User} = require('./../models/user');
const {course} = require('./../models/course');
const {
  courses,
  populateCourses,
} = require('./seed/course.seed');
const {users} = require('./seed/user.seed');

// Test lifecycle code:
// ======================

// Now clear collection and then repopluate with seed data
//  before EACH execution of EACH Test.
beforeEach(populateCourses);

describe('Populate Database', async function() {
  it('Should put data into the test database', (done) => {
    return done();
  });
});