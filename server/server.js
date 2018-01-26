require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Location} = require('./models/location');
const {Student} = require('./models/student');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// ------------------------------- USERS ------------------------------------- //
// ----- POST /users route ---- // ***
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['userName', 'firstName', 'lastName', 'email', 'password', 'roles', 'employmentType', 'status']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

// ----- GET /users/me -----// [PRIVATE]
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// ----- POST /users/login {email, password} ----- //
// *** FIX THE AWAIT (trailing then ...)
app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['userName', 'password']);
    const user = await User.findByUserName(body.userName, body.password);
    const token = await user.generateAuthToken();

    return res.header('x-auth',token).send(user);

  } catch (e) {
    res.status(400).send(e);
  }
});

// ---- DELETE /users/me/token (Logout -----??
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

// ----------------------------- LOCATIONS ----------------------------------- //
// ----- POST /location ----- //
app.post('/location', async (req, res) => {
  try {
    const body = _.pick(req.body, ['name', 'street', 'city', 'state', 'zipCode', 'locationType', 'status']);
    const location = new Location(body);
    location.createdAt = new Date().getTime();
    await location.save();
    res.send(location);
  } catch (e) {
    res.status(400).send();
  }
});

// ----- GET /location/id ----- //
app.get('/location/:id', authenticate, async (req, res) => {
  let id = req.params.id;
try {
  if (!ObjectID.isValid(id)) {
    throw new Error(); // trigger catch block below.
  }
  // now Query the db using find by the id
  const location = await Location.findOne({_id: id});
  res.send(location);
} catch (e) {
  res.status(400).send();
}
});

// ----- GET /locations (LIST) ----- // 
app.get('/location', async (req, res) => {
  try {
    const locations = await Location.find({});
    res.send({locations});
  } catch (e) {
    res.status(400).send(e);
  }
});

// ------------------------------ STUDENTS ----------------------------------- //
// ----- POST /student ----- //
app.post('/student', async (req, res) => {
  try {
    const body = _.pick(req.body, ['firstName', 'lastName', 'gender', 'school', 'grade',  'status', 'highestAchievedLeve', 'notes']);
    const student = new Student(body);
    student.createdAt = new Date().getTime();
    await student.save();
    res.send(student);
  } catch (e) {
    res.status(400).send();
  }
});


// ----- Activate listener ----- //
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
