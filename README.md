## validator-it

Just validate it, based on [validator](https://github.com/chriso/validator.js).

### Install

```
npm i validator-it
```

### Examples

```
var validatorIt = require('validator-it');

var validatePosts = validatorIt({
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

validatePosts({
  author: {
    _id: '5643263df301e3550988b3c8',
    name: 'nswbmw',
    email: 'foo@bar.com'
  },
  content: 'abcdefghijk'
});
// return true

validatePosts({
  author: {
    _id: 'abc',
    name: 'nswbmw',
    email: 'foo@bar.com'
  }
});
// return false

validatePosts({
  author: {
    _id: 'abc',
    name: 'nswbmw',
    email: 'foo@bar.com'
  }
}, true);
// throw
// [author._id: abc] ✖ isMongoId

validatePosts({
  author: {
    _id: '5643263df301e3550988b3c8',
    name: 'guest',
    email: 'foo@bar.com'
  }
});
// throw
// You are not admin.

validatorIt.isEmail()('foo@bar.com') // { key: 'isEmail', value: true }
validatorIt.contains('foo')('foo@bar.com') // { key: 'contains(foo)', value: true }

validatorIt.validator.isEmail('foo@bar.com') // true
validatorIt.validator.contains('foo@bar.com', 'foo') // true
```

More examples see [test](./test.js).

### License

MIT