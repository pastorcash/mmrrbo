// -- Create the "location" Model
const mongoose = require('mongoose');
const _ = require('lodash');

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
    type: Number,
    default: null,
  },
  status: {
    type: String,
    required: false, 
    default: 'active',
  },
  admins: {
    type: Array,
  },
  teachers: {
    type: Array,
  },
  students: {
    type: Array,
  },
  courses: {
    type: Array,
  },
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


const Location = mongoose.model('Location', LocationSchema);

module.exports = {Location};
