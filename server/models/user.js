// --- Create the "user" model
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    trim: true,
    minlength: 6,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
    minlength: 1,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  roles: {
    type: Array,
    default: ['teacher'],
  },
  employmentType: {
    type: String,
    required: false,
    // validate: {
    //   isAsync: true,
    //   validator: validator.isIn(['W-2', '1099']),
    //   message: `{VALUE} is not a valid option.`,
    // },
  },
  status: {
    type: String,
    required: true,
    trim: true,
    default: 'active',
    // validate: {
    //   isAsync: true,
    //   validator: validator.isIn(['active', 'hold', 'archive']),
    //   message: `{VALUE} is not a valid option.`,
    // },
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
  createdAt: {
    type: Number,
    required: false,
    default: null,
  },
  updatedAt: {
    type: Number,
    required: false,
    default: null,
  },
});

// --------------- INSTANCE Methods --------------- //
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

// add employment type (?)
  return _.pick(userObject, ['_id', 'userName', 'firstName', 'lastName', 'email', 'roles', 'status']);
};

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {token},
    },
  });
};

// ---------------- MODEL Methods ---------------- //
 UserSchema.statics.findByUserName = function (userName, password) {
  const User = this;

  return User.findOne({userName}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return resolve(user);
        }
        reject();
      });
    });
  });
};


UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return resolve(user);
        }
        reject();
      });
    });
  });
};

// UserSchema.statics.fullName

UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
