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

// --------------------- TEACHERS (SUBSET OF USERS) -------------------------- //
// ----- GET /teachers/:status ----- //
// This will allow display limits based on status: all, active, archived, or on hold
// For the status parameter: "all" runs blank query limitation
app.get('/teachers/:status', async (req, res) => {
  try {
    const status = req.params.status;
    if (status === 'all') {
      const users = await User.find({}).where('roles').in(['teacher']);
      res.send({users});
    } else {
      const users = await User.find({status}).where('roles').in(['teacher']);
      // const users = await User.findByRole('teacher', status);
      
      res.send({users});
    }
  } catch (e) {
    res.status(400).send();
  }
});

// ----- GET /location/teachers/:status ----- //
// This will limit by sts: all, active, archived, or on hold
app.get('/location/teachers/:id.:status', async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status
    // validate id using isValid

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(`${req.params.id} - ID not valid!`);
  }
    // *** Set up conditions for query here .....
    // a) vld/rtv location for array of teachers
    // b) status 

    // *** Later refactor option may be to exclude this validation,
    //     as it will be coming "from" a previous location route already validated.
    const location = await Location.findOne({_id: id});

    if (status === 'all') {
      const users = await User.find({}).where('roles').in(['teacher']);
      res.send({users});
    } else {
      const users = await User.find({status}).where('roles').in(['teacher']);
      // const users = await User.findByRole('teacher', status);
      
      res.send({users});
    }
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

// ----- GET /student (LIST) ----- // 
app.get('/student/:status', async (req, res) => {
  try {
    const status = req.params.status;
    if (status === 'all') {
      const students = await Student.find({});
      res.send({students});
    } else {
      const students = await Student.find({status});
      res.send({students});
    }
  } catch (e) {
    res.status(400).send();
  }
});

// -------------------- STUDENTS assigned to LOCATION ------------------------ //
// ----- GET /location/students/:status ----- //
// This will limit by sts: all, active, archived, or on hold
app.get('/location/students/:id.:status', async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status
    const assignedStudents = [];
    // validate id using isValid

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(`${req.params.id} - ID not valid!`);
  }
    // rtv location document
    const location = await Location.findOne({_id: id});
    try {
      // now iterate through the array to rtv student info
      for (let i=0; i <location.students.length; i++) {
        const student = await Student.findOne({"_id" : location.students[i]});

        if (status === 'all' || status === student.status) {
          assignedStudents.push(student);
        }  
      }
    } catch (e) {
      res.status(400).send();  
    } 
        console.log(`Final array ${assignedStudents}`);
    res.send(assignedStudents);

  } catch (e) {
    res.status(400).send();
  }
});

// ----- Activate listener ----- //
app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
