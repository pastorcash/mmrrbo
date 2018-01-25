// --- Mocha Server Test file
const expect = require('expect');
const request = require('supertest');
// const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Location} = require('./../models/location');
const {
  locations,
  populateLocations,
} = require('./seed/location.seed');

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
