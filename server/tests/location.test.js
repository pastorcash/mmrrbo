// --- Mocha Server Test file
const expect = require('expect');
const request = require('supertest');
// const {ObjectID} = require('mongodb');

const {app} = require('./../server');
// const {User} = require('./../models/user');
const {Location} = require('./../models/location');
const {
  locations,
  populateLocations,
} = require('./seed/location.seed');
const {users} = require('./seed/seed');

// Test lifecycle code:
// ======================

// Now clear collection and then repopluate with seed data
//  before EACH execution of EACH Test.
beforeEach(populateLocations);

describe('/POST Locations', () => {
  it('Should create a location', (done) => {
    let name = 'Third Location';
    let street = '123 Any Street';
    let city = 'Anytown';
    let state = 'PA';
    let zipCode = '12345';
    let locationType = 'Franchise';
    let status = 'archive';
    const locationObject = {name, street, city, state, zipCode, locationType, status}
    request(app)
      .post('/location')
      .send(locationObject)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toExist();
        expect(res.body.name).toBe(name);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        Location.find({name}).then((locations) => {
          expect(locations.length).toBe(1);
          expect(locations[0].name).toBe(name);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should reject duplicate name', (done) => {
    let name = 'First Location';
    let street = '123 Any Street';
    let city = 'Anytown';
    let state = 'PA';
    let zipCode = '12345';
    let locationType = 'Franchise';
    let status = 'archive';
    const locationObject = { name, street, city, state, zipCode, locationType, status}
    request(app)
      .post('/location')
      .send(locationObject)
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });  
  });
});

describe('GET /Location list', () => {
//   // *** MODIFY this once delineation by user has been added
  it('Should return a list of all locations', (done) => {
    request(app)
      .get('/location')
      .expect(200)
      .expect((res) => {
        expect(res.body.locations.length).toBe(2);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
      done();
    });
  });
});

describe('GET /location/id', (req, res) => {
  it('Should return valid location by id', (done) => {
    // First "login" with a valid user and Rtv token for authentication
    // then test location. Note (User[0] has been logged out - so no token exists.)
    let fName = 'First Location';
    let token = users[1].tokens[0].token;
    let locationId = locations[0]._id;

    request(app)
      .get(`/location/${locationId}`)
      .set('x-auth', token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toExist();
        expect(res.body.name).toBe(fName);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
      done();
    });
  });

  it('Should return unauthorized if no token', (done) => {
    let token = null;
    let locationId = locations[0]._id;

    request(app)
      .get(`/location/${locationId}`)
      .set('x-auth', token)
      .expect(401)
      .expect((res) => {
        expect(res.body.name).toNotExist();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
      done();
    });
  });
});

