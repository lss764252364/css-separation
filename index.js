'use strict';
var collectionSize, css, cssSeparation, debug, each, extend, fs, hasStr, isArray, isEmpty, isObjectBrace, isString, isUndefined, path, trim, util, _debug, _default;

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

debug = true;

_default = {
  mute: false,
  dest: '',
  conditionalClass: ['.ie6', '.ie7', '.ie8', '.ie9', '.ie10', '.ie11'],
  beautify: false,
  filterCommonStylesheets: true,
  filterConditionalStylesheets: true,
  filterMediaQueryStylesheets: true
};

_debug = function(outputType, outputContent) {
  var err, pluginName;
  if (debug) {
    switch (outputType.toLowerCase()) {
      case 'log':
        util.log(outputContent);
        break;
      case 'error':
        pluginName = 'CSS SEPARATION';
        err = new util.PluginError(pluginName, outputContent, {
          showStack: true
        });
        break;
      default:
        util.log('Please choose the right type for output.');
    }
  }
};

cssSeparation = (function() {
  function cssSeparation(options) {
    if (isObjectBrace(options) && !isEmpty(options)) {
      this.options = extend(_default, options);
      _debug('log', 'merged Configuration...');
    } else {
      this.options = _default;
      _debug('log', 'not merged Configuration...');
    }
  }

  cssSeparation.prototype.deal = function(cssFiles) {
    var fileName, relativePath, that;
    this.cssFiles = cssFiles;
    that = this;
    fileName = that.getBasename(cssFiles, '.css');
    relativePath = that.getDirname(cssFiles);
    that.generateFile(relativePath, fileName);
  };

  cssSeparation.prototype.getBasename = function(file, ext) {
    if (isString(file) && !isEmpty(file)) {
      if (isString(ext) && !isEmpty(file)) {
        return path.basename(file, ext);
      } else {
        return path.basename(file);
      }
    }
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

  cssSeparation.prototype.generateFile = function(relativePath, belong) {
    var that;
    that = this;
    if (that.options.filterConditionalStylesheets) {
      _debug('log', '需要过滤出条件样式 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      if (isArray(that.options.conditionalClass) && !isEmpty(that.options.conditionalClass)) {
        each(that.options.conditionalClass, function(item, index, list) {
          var _newFile, _output;
          _newFile = belong + item + '.css';
          _output = relativePath + '/' + _newFile;
          that.generateCCFile(item, _output);
          _debug('log', '需要被生成文件的命名是：' + _newFile);
          _debug('log', '需要被生成文件的路径是：' + _output);
        });
      }
    }
  };

  cssSeparation.prototype.createFile = function(_content, _output) {
    if (isString(_content) && isString(_output)) {
      fs.writeFileSync(_output, _content);
      _debug('log', '已写入文件。');
    }
  };

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
    if (isArray(selector) && !isEmpty(selector)) {
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

  cssSeparation.prototype.generateCCFile = function(conditionalClass, _output) {
    var filterSelector, idxs, newRules, that, traversingResultCache, _rules;
    that = this;
    newRules = [];
    traversingResultCache = '';
    _debug('log', '需要单独操作的文件是：' + that.cssFiles);
    _rules = that.getRules_AST(that.cssFiles);
    idxs = that.getIdxListOfRuleContainCC(_rules);
    _debug('log', '包含条件类的规则的对象的索引（位置）集合是：' + idxs);
    each(idxs, function(item, index, list) {
      newRules.push(_rules[+item]);
    });
    _debug('log', '仅存在包含条件类的规则的对象的AST：' + newRules);
    filterSelector = function(currentRule) {
      var slt_ast, strSlt, _slt, _sltCache;
      strSlt = '';
      _sltCache = [];
      slt_ast = that.getSelectors_AST(currentRule);
      _debug('log', '当前AST规则包含的 "selectors" 属性的值是：' + slt_ast);
      if (collectionSize(slt_ast) >= 2) {
        each(slt_ast, function(slts_item, slts_index, slts_list) {
          if (hasStr(slts_item, conditionalClass)) {
            _sltCache.push(slts_item);
          }
        });
        if (collectionSize(_sltCache) >= 2) {
          if (that.options.beautify) {
            strSlt += _sltCache.join(',\n');
          } else {
            strSlt += _sltCache.join(',');
          }
        } else if (!isEmpty(_sltCache)) {
          strSlt += _sltCache[0];
        }
      } else {
        _slt = slt_ast[0];
        if (hasStr(_slt, conditionalClass)) {
          strSlt += _slt;
        }
      }
      return strSlt;
    };
    each(newRules, function(nr_item, nr_index, nr_list) {
      var sltFltRslt;
      if (nr_item.type === 'rule') {
        sltFltRslt = filterSelector(nr_item);
        if (!isEmpty(sltFltRslt)) {
          traversingResultCache += sltFltRslt;
          each(that.getDeclarations_AST(nr_item), function(_item, _index, _list) {
            if (_index === 0) {
              if (that.options.beautify) {
                traversingResultCache += '\u0020{\n';
              } else {
                traversingResultCache += '{';
              }
            }
            if (!isUndefined(_item.property)) {
              if (that.options.beautify) {
                traversingResultCache += '\n\t' + _item.property + ': ' + _item.value + ';\n';
              } else {
                traversingResultCache += _item.property + ':' + _item.value + ';';
              }
            }
            if (_index === (collectionSize(_list) - 1)) {
              if (that.options.beautify) {
                traversingResultCache += '\n}\n\n';
              } else {
                traversingResultCache += '}';
              }
            }
          });
        }
      }
    });
    _debug('log', '输出遍历结果：' + traversingResultCache);
    if (isString(traversingResultCache) && !isEmpty(traversingResultCache)) {
      _debug('log', '遍历结果写至：' + _output);
      that.createFile(traversingResultCache, _output);
      _debug('log', '------------------------------------------------------------------------------------------');
    }
    if (isString(traversingResultCache) && isEmpty(traversingResultCache)) {
      if (!that.options.mute) {
        util.log('There is no stylesheets contain "' + conditionalClass + '" conditional class.');
      }
      _debug('log', '------------------------------------------------------------------------------------------');
    }
  };

  return cssSeparation;

})();

module.exports = cssSeparation;
