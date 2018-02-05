// -- Create the "location" Model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');
const _ = require('lodash');
const { User } = require('./user');
const { Student } = require('./student');
const { Course } = require('./course');

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Location name is required.'],
    trim: true,
    minlength: 3,
  },
  street: {
    type: String,
    required: [true, 'Street name is required.'],
    trim: true,
    minlength: 1,
  },
  city: {
    type: String,
    required: [true, 'City name is required.'],
    trim: true,
    minlength: 1,
  },
  state: {
    type: String,
    required: [true, 'State code is required.'],
    trim: true,
    minlength: 2,
    maxlength: 2,
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required.'],
    trim: true,
    minlength: 5,
  },
  locationType: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: 'Other',
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Schema.Types.Date,
    default: null,
  },
  status: {
    type: String,
    required: false,
    default: 'active',
  },
  admins: [
    { type: Schema.Types.ObjectId, ref: User }
  ],
  teachers: [
    { type: Schema.Types.ObjectId, ref: User }
  ],
  students: [
    { type: Schema.Types.ObjectId, ref: Student }
  ],
  courses: [
    { type: Schema.Types.ObjectId, ref: Course }
  ],
  contacts: {
    type: Object,
  },
});

// --------------- INSTANCE Methods --------------- //
LocationSchema.methods.toJSON = function () {
  const location = this;
  const locationObject = location.toObject();

  return _.pick(locationObject, ['_id', 'name', 'street', 'city', 'state', 'zipCode', 'locationType', 'status', 'latitude', 'longitude']);
};

// ---------------- MODEL Methods ---------------- //


// ------------------ Interface ------------------- //
const Location = mongoose.model('Location', LocationSchema);
LocationSchema.plugin(mongooseUniqueValidator);

module.exports = { Location };
