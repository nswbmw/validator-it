'use strict';

var validatorIt = require('./');
var assert = require('assert');

var validatePosts;

try {
  validatePosts = validatorIt({
    author: {
      _id: 'abc',
      name: validatorIt.equals('nswbmw'),
      email: validatorIt.isEmail()
    },
    content: validatorIt.isByteLength(10)
  });
} catch (e) {
  assert.equal(e.message, 'author._id validator must be a function, got abc.');
}

validatePosts = validatorIt({
  author: {
    _id: validatorIt.isMongoId(),
    name: function checkName(name) { 
      if (['nswbmw', 'jack'].indexOf(name) === -1) {
        throw new Error('You are not admin.');
      }
    },
    email: validatorIt.isEmail()
  },
  content: validatorIt.isByteLength(10)
});

assert.equal(validatePosts({
  name: 'nswbmw',
  email: 'foo@bar.com'
}), false);

try {
  validatePosts({
    author: {
      name: 'nswbmw',
      email: 'foo@bar.com'
    }
  }, true);
} catch (e) {
  assert.equal(e.message, '[author._id: undefined] ✖ isMongoId');
}

try {
  validatePosts({
    author: {
      _id: 'abc',
      name: 'nswbmw',
      email: 'foo@bar.com'
    }
  }, true);
} catch (e) {
  assert.equal(e.message, '[author._id: abc] ✖ isMongoId');
}

try {
  validatePosts({
    author: {
      _id: '5643263df301e3550988b3c8',
      name: 'nswbmw',
      email: 'foo@bar.com'
    }
  }, true);
} catch (e) {
  assert.equal(e.message, '[content: undefined] ✖ isByteLength(10)');
}

try {
  validatePosts({
    author: {
      _id: '5643263df301e3550988b3c8',
      name: 'guest',
      email: 'foo@bar.com'
    }
  }, true);
} catch (e) {
  assert.equal(e.message, 'You are not admin.');
}

assert(validatePosts({
  author: {
    _id: '5643263df301e3550988b3c8',
    name: 'nswbmw',
    email: 'foo@bar.com'
  },
  content: 'abcdefghijk'
}, true));

assert(validatePosts({
  author: {
    _id: '5643263df301e3550988b3c8',
    name: 'jack',
    email: 'foo@bar.com'
  },
  content: 'abcdefghijk'
}, true));

assert.deepEqual(validatorIt.isEmail()('foo@bar.com'), { key: 'isEmail', value: true });
assert.deepEqual(validatorIt.contains('foo')('foo@bar.com'), { key: 'contains(foo)', value: true });
assert.deepEqual(validatorIt.validator.isEmail('foo@bar.com'), true);
assert.deepEqual(validatorIt.validator.contains('foo@bar.com', 'foo'), true);