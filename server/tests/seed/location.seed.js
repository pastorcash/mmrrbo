// Test lifecycle code:
// =========================
const {ObjectID} = require('mongodb');


const {Location} = require('./../../models/location');

// Create and seed two users
const locationOneId = new ObjectID();
const locationTwoId = new ObjectID();

const locations = [{
  _id: locationOneId,
  name: 'First Location',
  street: '6428 Carnation Ct',
  city: 'Mt Pleasant',
  state: 'WI',
  zipCode: '53406',
  locationType: 'Other',
  status: 'active',
  createdAt: new Date().getTime(),
  latitude: null,
  longitude: null,
}, {
  _id: locationTwoId,
  name: 'Second Location',
  street: '6233 Durand Ave, Suite C-102',
  city: 'Mt Pleasant',
  state: 'WI',
  zipCode: '53406',
  locationType: 'Pilot',
  status: 'active',
  createdAt: new Date().getTime(),
  latitude: null,
  longitude: null,
}];


// Now populate documents/data tables
const populateLocations = (done) => {
  Location.remove({}).then(() => {
    var locationOne = new Location(locations[0]).save();
    var locationTwo = new Location(locations[1]).save();

    return Promise.all([locationOne, locationTwo]);
  }).then(() => done());
};

module.exports = {
  locations,
  populateLocations,
};
