'use strict';
var assert, cssSeparation, util;

assert = require('assert');

util = require('gulp-util');

cssSeparation = require('../index');

describe('CSS-SEPARATION', function() {
  describe('#getIdxListOfRuleContainCC()', function() {
    return it('should return [4, 5, 6]', function() {
      var idxsOfRuleContainCC, _cssSeparation, _rules;
      _cssSeparation = new cssSeparation();
      _rules = _cssSeparation.getRules_AST('test/sample.css');
      idxsOfRuleContainCC = _cssSeparation.getIdxListOfRuleContainCC(_rules);
      assert.deepEqual([4, 5, 6], idxsOfRuleContainCC);
    });
  });
  describe('#getDirname()', function() {
    it('should return "./", if the given value is just "sample.css"', function() {
      var _cssSeparation;
      _cssSeparation = new cssSeparation();
      assert.equal('./', _cssSeparation.getDirname('sample.css'));
    });
    it('should return "./dest", if the given value is just "dest/sample.css"', function() {
      var _cssSeparation;
      _cssSeparation = new cssSeparation();
      assert.equal('./dest', _cssSeparation.getDirname('./dest/sample.css'));
    });
    return it('should return "dev/stylesheet", if the given value is just "dev/stylesheet/sample.scss"', function() {
      var _cssSeparation;
      _cssSeparation = new cssSeparation();
      assert.equal('dev/stylesheet', _cssSeparation.getDirname('dev/stylesheet/sample.scss'));
    });
  });
  describe('#createFile()', function() {
    it('should create a file named "created.blank.file.css" in "dest" folder', function() {
      var _cssSeparation;
      _cssSeparation = new cssSeparation();
      _cssSeparation.createFile('', './dest/created.blank.file.css');
    });
  });
});
