'use strict';

var objectPath = require("object-path");
var flatten = require('flat').flatten;
var validator = require('validator');
var assert = require('assert');

var validatorIt = module.exports = function (schema) {
  assert('object' === typeof schema, 'validator schema must be an object or array.');
  
  var flattenSchema = flatten(schema);
  for (var path in flattenSchema) {
    if ('function' !== typeof flattenSchema[path]) {
      throw new Error(path + ' validator must be a function, got ' + flattenSchema[path] + '.');
    }
  }
  return function (obj, ifThrow) {
    for (var path in flattenSchema) {
      var pathScheme = flattenSchema[path];
      if ('function' !== typeof pathScheme) {
        throw new Error('validator must be function.');
      }
      var realValue = objectPath.get(obj, path);
      var result = pathScheme(realValue);
      // custom validate function
      if ('object' !== typeof result) {
        result = { key: pathScheme.name, value: result };
      }
      if (result.value === false) {
        if (ifThrow) {
          throw new Error('[' + path + ': ' + realValue + '] ✖ ' + result.key);
        } else {
          return false;
        }
      }
    }
    return true;
  };
};

Object.keys(validator).forEach(function (method) {
  validatorIt[method] = function () {
    var restArgs = [].slice.call(arguments);
    return function (str) {
      return {
        key: restArgs.length ? method + '(' + restArgs.join(', ') + ')' : method,
        value: validator[method].apply(validator, [str].concat(restArgs))
      };
    };
  };
});

validatorIt.validator = validator;
