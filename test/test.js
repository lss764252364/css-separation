'use strict';
var assert, cssSeparation, glob, path, util, _cssSeparation;

assert = require('assert');

path = require('path');

glob = require('glob');

util = require('gulp-util');

cssSeparation = require('../index');

_cssSeparation = new cssSeparation({
  mute: true,
  conditionalClass: ['.ie6', '.ie7', '.ie8', '.ie9', '.ie10', '.ie11'],
  beautify: true,
  filterCommonCSS: true
});

describe('CSS-SEPARATION', function() {
  describe('#deal()', function() {
    it('should create some file like "sample.ie6.css" around "sample.css" file', function() {
      _cssSeparation.deal('test/sample.css');
    });
  });
  describe('#getIdxListOfCommonCSS_AST()', function() {
    it('should return [1, 2, 3]', function() {
      var idxListOfCommonCSS, _rules;
      _rules = _cssSeparation.getRules_AST('test/sample.css');
      idxListOfCommonCSS = _cssSeparation.getPositionsOfSameClassOfRules('common', _rules);
      assert.deepEqual([1, 2, 3], idxListOfCommonCSS);
    });
  });
  describe('#getIdxListOfConditialCSS_AST()', function() {
    it('should return [4, 5, 6]', function() {
      var idxsOfRuleContainCC, _rules;
      _rules = _cssSeparation.getRules_AST('test/sample.css');
      idxsOfRuleContainCC = _cssSeparation.getPositionsOfSameClassOfRules('condition', _rules);
      assert.deepEqual([4, 5, 6], idxsOfRuleContainCC);
    });
  });
  describe('#getIdxListOfMediaCSS_AST()', function() {
    it('should return [7]', function() {
      var idxListOfMediaCSS, _rules;
      _rules = _cssSeparation.getRules_AST('test/sample.css');
      idxListOfMediaCSS = _cssSeparation.getPositionsOfSameClassOfRules('media', _rules);
      assert.deepEqual([7], idxListOfMediaCSS);
    });
  });
  describe('#isContainConditionalSelector()', function() {
    it('should return true if the given selectors list is [".ie7 .frmRegister > .fieldArea"]', function() {
      assert.equal(true, _cssSeparation.isContainConditionalSelector([".ie7 .frmRegister > .fieldArea"]));
    });
    it('should return true if the given selectors list is [".ie7 .frmRegister > .iptPhoneCodeArea", ".ie8 .frmRegister > .iptPhoneCodeArea", ".ie9 .frmRegister > .iptPhoneCodeArea"]', function() {
      assert.equal(true, _cssSeparation.isContainConditionalSelector([".ie7 .frmRegister > .iptPhoneCodeArea", ".ie8 .frmRegister > .iptPhoneCodeArea", ".ie9 .frmRegister > .iptPhoneCodeArea"]));
    });
  });
  describe('#getDirname()', function() {
    it('should return "./", if the given value is just "sample.css"', function() {
      assert.equal('./', _cssSeparation.getDirname('sample.css'));
    });
    it('should return "./dest", if the given value is just "dest/sample.css"', function() {
      assert.equal('./dest', _cssSeparation.getDirname('./dest/sample.css'));
    });
    it('should return "dev/stylesheet", if the given value is just "dev/stylesheet/sample.scss"', function() {
      assert.equal('dev/stylesheet', _cssSeparation.getDirname('dev/stylesheet/sample.scss'));
    });
  });
  describe('#createFile()', function() {
    it('should create a file named "created.blank.file.css" in "dest" folder', function() {
      _cssSeparation.createFile('', './dest/created.blank.file.css');
    });
  });
});
