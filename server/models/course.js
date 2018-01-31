// -- Create the "course" Model
const mongoose = require('mongoose');
const _ = require('lodash');

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
    type: String,
  },
  student: {
    type: String,
  },
  present: {
    type: Boolean,
  },
  recorded: {
    type: Date,
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
  students: {
    type: Array,
  },
  tempStudents: {
    type: Array,
  },
  trialStudents: {
    type: Array,
  },  
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

module.exports = {Course};