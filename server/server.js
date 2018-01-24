require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Location} = require('./models/location');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// ----- POST /users route ---- // ***
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
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
app.post('/users/login', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  await User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
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

// ----- POST /location ----- //
app.post('/location', async (req, res) => {
  try {
    const body = _.pick(req.body, ['name', 'street', 'city', 'state', 'zipCode', 'locationType', 'status']);
    const location = new Location(body);
    await location.save();
    res.send(location);
  } catch (e) {
    res.status(400).send();
  }
});

// ----- GET /location ----- //
app.get('./location', (req, res) => {

});

// ----- Get /locations (LIST) ----- // 
app.get('/location/list', async (req, res) => {

});

// ----- Activate listener ----- //
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
