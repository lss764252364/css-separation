'use strict';
var collectionSize, css, cssSeparation, each, extend, fs, hasStr, isArray, isEmpty, isObjectBrace, isString, isUndefined, path, trim, util, _default;

fs = require('fs');

path = require('path');

extend = require('xtend');

util = require('gulp-util');

css = require('css');

hasStr = require('amp-includes');

trim = require('amp-trim');

each = require('amp-each');

collectionSize = require('amp-size');

isString = require('amp-is-string');

isEmpty = require('amp-is-empty');

isArray = require('amp-is-array');

isUndefined = require('amp-is-undefined');

isObjectBrace = require('is-object-brace');

_default = {
  beautify: false,
  conditionalClass: ['.ie7', '.ie8', '.ie9']
};

cssSeparation = (function() {
  function cssSeparation() {
    var option;
    option = arguments[0];
    if (isObjectBrace(option)) {
      this.options = extend(_default, option);
    } else {
      this.options = _default;
    }
  }

  cssSeparation.prototype.getSource = function(cssFile) {
    if (isString(cssFile) && !isEmpty(cssFile)) {
      return fs.readFileSync(cssFile, {
        encoding: 'utf8'
      });
    }
  };

  cssSeparation.prototype.getAST = function(cssFile) {
    if (isString(cssFile) && !isEmpty(cssFile)) {
      return css.parse(this.getSource(cssFile));
    }
  };

  cssSeparation.prototype.getRules_AST = function(cssFile) {
    return this.getAST(cssFile).stylesheet.rules;
  };

  cssSeparation.prototype.getSelectors_AST = function(currentRule) {
    return currentRule.selectors;
  };

  cssSeparation.prototype.getDeclarations_AST = function(currentRule) {
    return currentRule.declarations;
  };

  cssSeparation.prototype.isConditionalSelector = function(selector) {
    var identificationResult, that;
    that = this;
    identificationResult = void 0;
    if (isArray(selector)) {
      each(that.options.conditionalClass, function(cs_item, cs_index, cs_list) {
        if (hasStr(selector, cs_item)) {
          identificationResult = true;
        }
      });
    }
    if (isUndefined(identificationResult)) {
      return false;
    } else {
      return identificationResult;
    }
  };

  cssSeparation.prototype.getIdxListOfRuleContainCC = function(_rules) {
    var that, _arr;
    that = this;
    _arr = [];
    each(_rules, function(cc_item, cc_index, cc_list) {
      if (cc_item.type === 'rule') {
        if (that.isConditionalSelector(that.getSelectors_AST(cc_item))) {
          _arr.push(cc_index);
        }
      }
    });
    return _arr;
  };

  cssSeparation.prototype.getDirname = function(file) {
    var _dirname;
    _dirname = path.dirname(file);
    if (_dirname === '.') {
      return './';
    } else {
      return _dirname;
    }
  };

  cssSeparation.prototype.createFile = function(_content, _output) {
    if (isString(_content && isString(_output))) {
      fs.writeFile(_output, _content, function(err) {
        if (err) {
          throw err;
        }
      });
    }
  };

  cssSeparation.prototype._writeFile = function(_input, _output) {
    fs.writeFileSync(_output, this.getCommonCss(_input));
  };

  return cssSeparation;

})();

module.exports = cssSeparation;
