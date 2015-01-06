'use strict';
var assert, cssSeparation, util;

assert = require('assert');

util = require('gulp-util');

cssSeparation = require('../index');

util.log(new cssSeparation().getRules('sample.css'));

new cssSeparation({
  beautify: true
})._writeFile('sample.css', 'common.style.css');

describe('CSS-SEPARATION', function() {
  describe('#method()', function() {});
});
