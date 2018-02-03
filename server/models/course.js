// -- Create the "course" Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');
const _ = require('lodash');
const { Student } = require('./student');

const meetingTimesSchema = new mongoose.Schema({
  dayOfTheWeek: {
    type: String,
  },
  time: {
    type: Number,
  },
});

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Schema.Types.Date,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: Student,
  },
  present: {
    type: Boolean,
  },
  recorded: {
    type: Date,
    default: new Date().getTime(),
  },
});

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Course/class name is required.'],
    trim: true,
    minlength: 3,
  },
  meetingTimes: [meetingTimesSchema],
  teachers: {
    type: Array,
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: Student,
  }],
  tempStudents: [{
    type: Schema.Types.ObjectId,
    ref: Student,
  }],
  trialStudents: [{
    type: Schema.Types.ObjectId,
    ref: Student,
  }],
  status: {
    type: String,
    required: false, 
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: new Date().getTime(),
  },
  attendanceList: [attendanceSchema],
});


// --------------- INSTANCE Methods --------------- //
CourseSchema.methods.toJSON = function () {
  const course = this;
  const courseObject = course.toObject();

  return _.pick(courseObject, ['_id', 'name', 'meetingTimes', 'status']);
};

// ---------------- MODEL Methods ---------------- //


const Course = mongoose.model('Course', CourseSchema);
CourseSchema.plugin(mongooseUniqueValidator);

module.exports = {Course};