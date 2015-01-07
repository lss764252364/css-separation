'use strict';
var collectionSize, css, cssSeparation, debug, each, extend, fnUtil, fs, hasStr, isArray, isEmpty, isObjectBrace, isString, isUndefined, path, trim, util, _debug, _default;

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
  conditionalClass: [],
  beautify: false,
  filterCommonCSS: true,
  filterConditionalCSS: true,
  filterMediaCSS: true
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

fnUtil = {
  isStringAndNotEmpty: function(obj) {
    if (isString(obj) && !isEmpty(obj)) {
      return true;
    } else {
      return false;
    }
  },
  isStringAndEmpty: function(obj) {
    if (isString(obj) && isEmpty(obj)) {
      return true;
    } else {
      return false;
    }
  },
  isArrayAndNotEmpty: function(obj) {
    if (isArray(obj) && !isEmpty(obj)) {
      return true;
    } else {
      return false;
    }
  },
  isObjectBraceAndNotEmpty: function(obj) {
    if (isObjectBrace(obj) && !isEmpty(obj)) {
      return true;
    } else {
      return false;
    }
  }
};

cssSeparation = (function() {
  function cssSeparation(options) {
    if (isObjectBrace(options) && !isEmpty(options)) {
      this.options = extend(_default, options);
    } else {
      this.options = _default;
    }
  }

  cssSeparation.prototype.deal = function(cssFiles) {
    var fileName, relativePath;
    this.cssFiles = trim(cssFiles);
    fileName = this.getBasename(this.cssFiles, '.css');
    relativePath = this.getDirname(this.cssFiles);
    this.genFiles(relativePath, fileName);
  };

  cssSeparation.prototype.genFiles = function(relativePath, belong) {
    var $rules, commonCSS_AST, conditionalCSS_AST, mediaCSS_AST, opts, that, _newFile, _output;
    that = this;
    opts = that.options;
    $rules = that.getRules_AST(that.cssFiles);
    if (opts.filterCommonCSS) {
      _newFile = belong + '.common.css';
      _output = relativePath + '/' + _newFile;
      commonCSS_AST = that.getSameClassOfRules('common', $rules);
      that.genCommonCSS(commonCSS_AST, _output);
    }
    if (opts.filterConditionalCSS) {
      conditionalCSS_AST = that.getSameClassOfRules('condition', $rules);
      if (fnUtil.isArrayAndNotEmpty(opts.conditionalClass)) {
        each(opts.conditionalClass, function(item, index, list) {
          _newFile = belong + item + '.css';
          _output = relativePath + '/' + _newFile;
          that.genConditionalCSS(conditionalCSS_AST, item, _output);
        });
      }
    }
    if (opts.filterMediaCSS) {
      _newFile = belong + '.media.css';
      _output = relativePath + '/' + _newFile;
      mediaCSS_AST = that.getSameClassOfRules('media', $rules);
      that.genMediaCSS(mediaCSS_AST, _output);
    }
  };

  cssSeparation.prototype.getBasename = function(fileWithPath, ext) {
    if (fnUtil.isStringAndNotEmpty(fileWithPath)) {
      if (fnUtil.isStringAndNotEmpty(ext)) {
        return path.basename(fileWithPath, ext);
      } else {
        return path.basename(fileWithPath);
      }
    }
  };

  cssSeparation.prototype.getDirname = function(fileWithPath) {
    var _dirname;
    _dirname = path.dirname(fileWithPath);
    if (_dirname === '.') {
      return './';
    } else {
      return _dirname;
    }
  };

  cssSeparation.prototype.createFile = function(_content, _output) {
    if (fnUtil.isStringAndNotEmpty(_content) && fnUtil.isStringAndNotEmpty(_output)) {
      fs.writeFileSync(_output, _content);
    }
  };

  cssSeparation.prototype.getSource = function(cssFile) {
    if (fnUtil.isStringAndNotEmpty(cssFile)) {
      return fs.readFileSync(cssFile, {
        encoding: 'utf8'
      });
    }
  };

  cssSeparation.prototype.getAST = function(cssFile) {
    if (fnUtil.isStringAndNotEmpty(cssFile)) {
      return css.parse(this.getSource(cssFile));
    }
  };

  cssSeparation.prototype.getRules_AST = function(cssFile) {
    if (fnUtil.isStringAndNotEmpty(cssFile)) {
      return this.getAST(cssFile).stylesheet.rules;
    }
  };

  cssSeparation.prototype.getSelectors_AST = function(currentRule) {
    if (fnUtil.isObjectBraceAndNotEmpty(currentRule)) {
      return currentRule.selectors;
    }
  };

  cssSeparation.prototype.getDeclarations_AST = function(currentRule) {
    return currentRule.declarations;
  };

  cssSeparation.prototype.isContainConditionalSelector = function(selector) {
    var identificationResult, opts, that;
    that = this;
    opts = that.options;
    identificationResult = void 0;
    if (fnUtil.isArrayAndNotEmpty(selector)) {
      each(opts.conditionalClass, function(cs_item, cs_index, cs_list) {
        if (hasStr(selector.toString(), cs_item)) {
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

  cssSeparation.prototype.getPositionsOfSameClassOfRules = function(category, _rules) {
    var that, _arr;
    that = this;
    _arr = [];
    switch (category.toLowerCase()) {
      case 'common':
        each(_rules, function(item, index, list) {
          if (item.type === 'rule') {
            if (!that.isContainConditionalSelector(that.getSelectors_AST(item))) {
              _arr.push(index);
            }
          }
        });
        break;
      case 'condition':
        each(_rules, function(item, index, list) {
          if (item.type === 'rule') {
            if (that.isContainConditionalSelector(that.getSelectors_AST(item))) {
              _arr.push(index);
            }
          }
        });
        break;
      case 'media':
        each(_rules, function(item, index, list) {
          if (item.type === 'media') {
            _arr.push(index);
          }
        });
        break;
      default:
        util.log('#getPositionsOfSameClassOfRules(): Please choose the right category of stylesheet.');
    }
    return _arr;
  };

  cssSeparation.prototype.getSameClassOfRules = function(category, _rules) {
    var newRules, pos, that;
    that = this;
    newRules = [];
    pos = that.getPositionsOfSameClassOfRules(category.toLowerCase(), _rules);
    each(pos, function(item, index, list) {
      newRules.push(_rules[+item]);
    });
    return newRules;
  };

  cssSeparation.prototype.genCommonCSS = function(rules_AST, _output) {
    var filterSelectors_AST, opts, that, traversingResultCache;
    that = this;
    opts = that.options;
    traversingResultCache = '';
    filterSelectors_AST = function(currentRule) {
      var slt_ast, strSlt, _sltCache;
      strSlt = '';
      _sltCache = [];
      slt_ast = that.getSelectors_AST(currentRule);
      if (collectionSize(slt_ast) >= 2) {
        each(slt_ast, function(slts_item, slts_index, slts_list) {
          _sltCache.push(slts_item);
        });
        if (opts.beautify) {
          strSlt += _sltCache.join(',\n');
        } else {
          strSlt += _sltCache.join(',');
        }
      } else {
        strSlt += trim(slt_ast[0]);
      }
      return strSlt;
    };
    each(rules_AST, function(nr_item, nr_index, nr_list) {
      if (nr_item.type === 'rule') {
        traversingResultCache += filterSelectors_AST(nr_item);
        each(that.getDeclarations_AST(nr_item), function(_item, _index, _list) {
          if (_index === 0) {
            if (opts.beautify) {
              traversingResultCache += '\u0020{\n';
            } else {
              traversingResultCache += '{';
            }
          }
          if (!isUndefined(_item.property)) {
            if (opts.beautify) {
              traversingResultCache += '\n\t' + _item.property + ': ' + _item.value + ';\n';
            } else {
              traversingResultCache += _item.property + ':' + _item.value + ';';
            }
          }
          if (_index === (collectionSize(_list) - 1)) {
            if (opts.beautify) {
              traversingResultCache += '\n}\n\n';
            } else {
              traversingResultCache += '}';
            }
          }
        });
      }
    });
    if (fnUtil.isStringAndNotEmpty(traversingResultCache)) {
      that.createFile(traversingResultCache, _output);
    }
  };

  cssSeparation.prototype.genConditionalCSS = function(rules_AST, conditionalClass, _output) {
    var filterSelectors_AST, opts, that, traversingResultCache;
    that = this;
    opts = that.options;
    traversingResultCache = '';
    filterSelectors_AST = function(currentRule) {
      var slt_ast, strSlt, _slt, _sltCache;
      strSlt = '';
      _sltCache = [];
      slt_ast = that.getSelectors_AST(currentRule);
      if (collectionSize(slt_ast) >= 2) {
        each(slt_ast, function(slts_item, slts_index, slts_list) {
          if (hasStr(slts_item, conditionalClass)) {
            _sltCache.push(slts_item);
          }
        });
        if (collectionSize(_sltCache) >= 2) {
          if (opts.beautify) {
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
    each(rules_AST, function(nr_item, nr_index, nr_list) {
      var sltFltRslt;
      if (nr_item.type === 'rule') {
        sltFltRslt = filterSelectors_AST(nr_item);
        if (!isEmpty(sltFltRslt)) {
          traversingResultCache += sltFltRslt;
          each(that.getDeclarations_AST(nr_item), function(_item, _index, _list) {
            if (_index === 0) {
              if (opts.beautify) {
                traversingResultCache += '\u0020{\n';
              } else {
                traversingResultCache += '{';
              }
            }
            if (!isUndefined(_item.property)) {
              if (opts.beautify) {
                traversingResultCache += '\n\t' + _item.property + ': ' + _item.value + ';\n';
              } else {
                traversingResultCache += _item.property + ':' + _item.value + ';';
              }
            }
            if (_index === (collectionSize(_list) - 1)) {
              if (opts.beautify) {
                traversingResultCache += '\n}\n\n';
              } else {
                traversingResultCache += '}';
              }
            }
          });
        }
      }
    });
    if (fnUtil.isStringAndNotEmpty(traversingResultCache)) {
      that.createFile(traversingResultCache, _output);
    }
    if (fnUtil.isStringAndEmpty(traversingResultCache)) {
      if (!that.options.mute) {
        util.log('There is no stylesheets contain "' + conditionalClass + '" conditional class.');
      }
    }
  };

  cssSeparation.prototype.genMediaCSS = function(rules_AST, _output) {
    var filterSelectors_AST, opts, that, traversingResultCache;
    that = this;
    opts = that.options;
    traversingResultCache = '';
    filterSelectors_AST = function(currentRule) {
      var slt_ast, strSlt, _sltCache;
      strSlt = '';
      _sltCache = [];
      slt_ast = that.getSelectors_AST(currentRule);
      if (collectionSize(slt_ast) >= 2) {
        each(slt_ast, function(slts_item, slts_index, slts_list) {
          if (opts.beautify) {
            _sltCache.push('\t' + slts_item);
          } else {
            _sltCache.push(slts_item);
          }
        });
        if (opts.beautify) {
          strSlt += _sltCache.join(',\n');
        } else {
          strSlt += _sltCache.join(',');
        }
      } else {
        strSlt += trim(slt_ast[0]);
      }
      return strSlt;
    };
    if (fnUtil.isArrayAndNotEmpty(rules_AST)) {
      each(rules_AST, function(item, index, list) {
        if (opts.beautify) {
          traversingResultCache += '@media ' + trim(item.media);
        } else {
          traversingResultCache += '@media ' + trim(item.media).replace(/[\n]+/g, '');
        }
        if (opts.beautify) {
          traversingResultCache += '\u0020{\n\n';
        } else {
          traversingResultCache += '{';
        }
        each(item.rules, function(_item, _index, _list) {
          traversingResultCache += filterSelectors_AST(_item);
          each(that.getDeclarations_AST(_item), function(__item, __index, __list) {
            if (__index === 0) {
              if (opts.beautify) {
                traversingResultCache += '\u0020{\n';
              } else {
                traversingResultCache += '{';
              }
            }
            if (!isUndefined(__item.property)) {
              if (opts.beautify) {
                traversingResultCache += '\n\t\t' + __item.property + ': ' + __item.value + ';\n';
              } else {
                traversingResultCache += __item.property + ':' + __item.value + ';';
              }
            }
            if (__index === (collectionSize(__list) - 1)) {
              if (opts.beautify) {
                traversingResultCache += '\n\t}\n\n';
              } else {
                traversingResultCache += '}';
              }
            }
          });
        });
        if (opts.beautify) {
          traversingResultCache += '\n}\n\n';
        } else {
          traversingResultCache += '}';
        }
      });
    }
    if (fnUtil.isStringAndNotEmpty(traversingResultCache)) {
      that.createFile(traversingResultCache, _output);
    }
  };

  return cssSeparation;

})();

module.exports = cssSeparation;
