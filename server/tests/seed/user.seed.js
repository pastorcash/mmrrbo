// Test lifecycle code:
// =========================
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/user');

// Create and seed two users
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();

const users = [{
  _id: userOneId,
  userName: 'JonDoe',
  firstName: 'Jon',
  lastName: 'Doe',
  email: 'JDoe880@gmail.com',
  password: 'userOnePass',
  roles: ['teacher'],
  employmentType: 'W-2',
  status: 'active',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString(),
  }],
  createdAt:  new Date().getTime(),
  updatedAt:  new Date().getTime(),
}, {
  _id: userTwoId,
  userName: 'JaneDoe',
  firstName: 'Jane',
  lastName: 'Doe',   
  email: 'jnDoe881@gmail.com',
  password: 'userTwoPass',
  roles: ['teacher'],
  employmentType: '1099',
  status: 'hold',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString(),
  }],
  createdAt:  new Date().getTime(),
  updatedAt:  new Date().getTime(),
}, {
  _id: userThreeId,
  userName: 'pastorcash',
  firstName: 'Cash',
  lastName: 'Myers',   
  email: 'cmyers880@gmail.com',
  password: 'userThreePass',
  roles: ['admin'],
  employmentType: '1099',
  status: 'active',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userThreeId, access: 'auth' }, process.env.JWT_SECRET).toString(),
  }],
  createdAt:  new Date().getTime(),
  updatedAt:  new Date().getTime(),
}];


// Now populate documents/data tables
const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    var userThree = new User(users[2]).save();

    return Promise.all([userOne, userTwo, userThree]);
  }).then(() => done());
};

module.exports = {
  users,
  populateUsers,
};
