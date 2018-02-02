// -- Create the "student" Model
const mongoose = require('mongoose');
// const validators = require('mongoose-validators');
const _ = require('lodash');

// At present: there are no fields for Financial information,
//   additional notes (special attn, teachers, or attendance),
//   or contact info (guardians, teachers, etc.)
const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    unique: false,
    required: [true, 'First name is required.'],
    trim: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    unique: false,
    required: [true, 'Last name is required.'],
    trim: true,
    minlength: 3,
  },
  gender: {
    type: String,
    required: false,
 //   validate: validators.isIn('male', 'female'),
    trim: true,
    default: null,
  },
  dateOfBirth: {
    type: Number,
    required: false,
    default: null,
  },
  registrationDate: {
    type: Number,
    required: false,
    default: null,
  },
  classStartDate: {
    type: Number,
    required: false,
    default: null,
  },
  school: {
    type: String,
    required: false,
  },
  grade: {
    type: String,
    required: false,
    default: null,
  },
  status: {
    type: String,
    required: true,
//    validate: validators.isIn('active', 'hold', 'archive', 'trial'),
    trim: true,
    default: 'active',
  },
  initialLevel: {
    type: Number,
    required: false,
    default: null,
  },
  highestAchievedLevel: {
    type: Number,
    required: false,
  },
  initialWordCount: {
    type: Number,
    required: false,
    default: 0,
  },
  highestAchievedWordCount: {
    type: Number,
    required: false,
    default: 0,
  },
  notes: {
    type: String,
    required: false,
  }, 
  createdAt: {
    type: Number,
    required: false,
    default: null,
  },
})

// --------------- INSTANCE Methods --------------- //
StudentSchema.methods.toJSON = function () {
  const student = this;
  const studentObject = student.toObject();
  return _.pick(studentObject, ['_id', 'firstName', 'lastName', 'status']);
};

// StudentSchema.methods.toJSONfull = function () {
//   const student = this;
//   const studentObject = student.toObject();
//   return _.pick(studentObject, ['_id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'registrationDate', 'classStartDate', 'school', 'grade',  'status', 'highestAchievedLeve', 'notes']);
// };

// ---------------- MODEL Methods ----------------- //

// ------------------ Interface ------------------- //

const Student = mongoose.model('Student', StudentSchema);

module.exports = {Student};
