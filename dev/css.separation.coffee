# name: index.js
#
# author: 沈维忠 ( Shen Weizhong / Tony Stark )
#
# Last Update: 沈维忠 ( Shen Weizhong / Tony Stark )



'use strict'



fs             = require 'fs'

path           = require 'path'

extend         = require 'xtend'

util           = require 'gulp-util'

css            = require 'css'

hasStr         = require 'amp-includes'

trim           = require 'amp-trim'

each           = require 'amp-each'

collectionSize = require 'amp-size'

isString       = require 'amp-is-string'

isEmpty        = require 'amp-is-empty'

isArray        = require 'amp-is-array'

isUndefined    = require 'amp-is-undefined'

isObjectBrace  = require 'is-object-brace'

debug          = true



# @name _default
# @description Default options.
# @type
#	{object}   _default
#	{boolean}  _default.beautify
#	{array}    _default.conditionalClass
# @author 沈维忠 ( Tony Stark / Shen Weizhong )
_default =

	mute: false

	dest: ''

	conditionalClass: ['.ie6', '.ie7', '.ie8', '.ie9', '.ie10', '.ie11']

	beautify: false

	filterCommonStylesheets: true

	filterConditionalStylesheets: true

	filterMediaQueryStylesheets: true



_debug = (outputType, outputContent) ->

	if debug

		switch outputType.toLowerCase()

			when 'log'

				util.log outputContent

			when 'error'

				pluginName = 'CSS SEPARATION'

				err = new util.PluginError pluginName, outputContent,

					showStack: true

			else

				util.log 'Please choose the right type for output.'

	return



fnUtil =

	isStringAndNotEmpty: (obj) ->

		if isString(obj) and not isEmpty(obj) then true else false

	isStringAndEmpty: (obj) ->

		if isString(obj) and isEmpty(obj) then true else false

	isArrayAndNotEmpty: (obj) ->

		if isArray(obj) and not isEmpty(obj) then true else false

	isObjectBraceAndNotEmpty: (obj) ->

		if isObjectBrace(obj) and not isEmpty(obj) then true else false



# @class cssSeparation
# @description
# eparate content like conditional stylesheets(and soon...) from "*.css" file
# , and generate individual files for them according to certain rules!
# @param {object} separateOptions
# @author 沈维忠 ( Tony Stark / Shen Weizhong )
class cssSeparation

    # @constructs
    # @param {object} options Configuration for the instance.
	constructor: (options) ->

		if isObjectBrace(options) and not isEmpty(options)

			@options = extend _default, options

		else

			@options = _default

	# @param {string | array} cssFiles Stylesheet(s) need(s) to be separated.
	deal: (cssFiles) ->

		@cssFiles = trim cssFiles

		fileName = @getBasename @cssFiles, '.css'

		relativePath = @getDirname @cssFiles

		@generateFile relativePath, fileName

		return

	getBasename: (fileWithPath, ext) ->

		if fnUtil.isStringAndNotEmpty fileWithPath

			if fnUtil.isStringAndNotEmpty(ext) then path.basename(fileWithPath, ext) else path.basename fileWithPath

	getDirname: (fileWithPath) ->

		_dirname = path.dirname fileWithPath

		if _dirname is '.' then './' else _dirname

	generateFile: (relativePath, belong) ->

		that   = @

		opts   = that.options

		$rules = that.getRules_AST that.cssFiles

		if opts.filterCommonStylesheets

			_newFile = belong + '.common.css'

			_output  = relativePath + '/' + _newFile

			commonStylesheets_AST = that.getCommonStylesheets $rules

			that.generateCommonStylesheets  commonStylesheets_AST, _output

		if opts.filterConditionalStylesheets

			conditionalStylesheets_AST = that.getStylesheetsContainConditionalClass $rules

			if fnUtil.isArrayAndNotEmpty(opts.conditionalClass)

				each opts.conditionalClass, (item, index, list) ->

					_newFile = belong + item + '.css'

					_output  = relativePath + '/' + _newFile

					that.generateConditionalStylesheets conditionalStylesheets_AST, item, _output

					return

		return

	createFile: (_content, _output) ->

		if fnUtil.isStringAndNotEmpty(_content) and fnUtil.isStringAndNotEmpty(_output)

			fs.writeFileSync _output, _content

		return

	getSource: (cssFile) ->

		if fnUtil.isStringAndNotEmpty cssFile

			fs.readFileSync cssFile,

				encoding: 'utf8'

	getAST: (cssFile) ->

		if fnUtil.isStringAndNotEmpty cssFile

			css.parse @getSource cssFile

	getRules_AST: (cssFile) ->

		if fnUtil.isStringAndNotEmpty cssFile

			@getAST(cssFile).stylesheet.rules

	getSelectors_AST: (currentRule) ->

		if fnUtil.isObjectBraceAndNotEmpty currentRule

			currentRule.selectors

	getDeclarations_AST: (currentRule) ->

		currentRule.declarations

	# @description Know if the value of selector key which in the current rule contain conditional class.
	# @param {array} selector-the value of the seletor key of current rule
	# @returns {boolean} If the value of seletor key which in the current rule contain conditional class, return true, otherwise return false.
	# @author 沈维忠 ( Tony Stark / Shen Weizhong )
	isContainConditionalSelector: (selector) ->

		that                 = @

		opts                 = that.options

		identificationResult = undefined

		if fnUtil.isArrayAndNotEmpty selector

			each opts.conditionalClass, (cs_item, cs_index, cs_list) ->

				if hasStr selector.toString(), cs_item

					identificationResult = true

				return

		if isUndefined identificationResult then false else identificationResult

	# @description 在 "CSSOM" 的 "rules" 对象（数组）中获取不包含条件类的规则的对象的索引（位置）
	getIdxListOfCommonCSS_AST: (_rules) ->

		that = @

		_arr = []

		each _rules, (cc_item, cc_index, cc_list) ->

			if cc_item.type is 'rule'

				if not that.isContainConditionalSelector that.getSelectors_AST cc_item

					_arr.push cc_index

			return

		_arr

	# @description 在 "CSSOM" 的 "rules" 对象（数组）中获取包含条件类的规则的对象的索引（位置）
	getIdxListOfConditialCSS_AST: (_rules) ->

		that = @

		_arr = []

		each _rules, (cc_item, cc_index, cc_list)->

			if cc_item.type is 'rule'

				if that.isContainConditionalSelector that.getSelectors_AST cc_item

					_arr.push cc_index

			return

		_arr

	getCommonStylesheets: (_rules) ->

		that = @

		rulesJustContainCommonCSS = []

		idxs = that.getIdxListOfCommonCSS_AST _rules

		each idxs, (item, index, list) ->

			rulesJustContainCommonCSS.push _rules[+item]

			return

		rulesJustContainCommonCSS

	getStylesheetsContainConditionalClass: (_rules) ->

		that = @

		rulesJustContainConditionalClass = []

		idxs = that.getIdxListOfConditialCSS_AST _rules

		each idxs, (item, index, list) ->

			rulesJustContainConditionalClass.push _rules[+item]

			return

		rulesJustContainConditionalClass

	generateCommonStylesheets: (rules_AST, _output) ->

		that                  = @

		opts                  = that.options

		traversingResultCache = ''

		filterSelectors_AST   = (currentRule) ->

			strSlt    = ''

			_sltCache = []

			slt_ast   = that.getSelectors_AST(currentRule)

			if collectionSize(slt_ast) >= 2

				each slt_ast, (slts_item, slts_index, slts_list) ->

					_sltCache.push slts_item

					return

				if opts.beautify then strSlt += _sltCache.join(',\n') else strSlt += _sltCache.join(',')

			else

				strSlt += trim slt_ast[0]

			strSlt

		each rules_AST, (nr_item, nr_index, nr_list) ->

			if nr_item.type is 'rule'

				traversingResultCache += filterSelectors_AST(nr_item)

				each that.getDeclarations_AST(nr_item), (_item, _index, _list) ->

					if _index is 0

						if opts.beautify then traversingResultCache += '\u0020{\n' else traversingResultCache += '{'

					if not isUndefined _item.property

						if opts.beautify

						then traversingResultCache += '\n\t' + _item.property + ': ' + _item.value + ';\n'

						else traversingResultCache += _item.property + ':' + _item.value + ';'

					if _index is (collectionSize(_list) - 1)

						if opts.beautify then traversingResultCache += '\n}\n\n' else traversingResultCache += '}'

					return

			return

		if fnUtil.isStringAndNotEmpty(traversingResultCache)

			that.createFile traversingResultCache, _output

		return

	generateConditionalStylesheets: (rules_AST, conditionalClass, _output) ->

		that                  = @

		opts                  = that.options

		traversingResultCache = ''

		filterSelectors_AST   = (currentRule) ->

			strSlt    = ''

			_sltCache = []

			slt_ast   = that.getSelectors_AST(currentRule)

			if collectionSize(slt_ast) >= 2

				each slt_ast, (slts_item, slts_index, slts_list) ->

					if hasStr slts_item, conditionalClass

						_sltCache.push slts_item

					return

				if collectionSize(_sltCache) >= 2

					if opts.beautify then strSlt += _sltCache.join(',\n') else strSlt += _sltCache.join(',')

				else if not isEmpty _sltCache

					strSlt += _sltCache[0]

			else

				_slt = slt_ast[0]

				if hasStr _slt, conditionalClass

					strSlt += _slt

			strSlt

		each rules_AST, (nr_item, nr_index, nr_list) ->

			if nr_item.type is 'rule'

				sltFltRslt = filterSelectors_AST nr_item

				if not isEmpty sltFltRslt

					traversingResultCache += sltFltRslt

					each that.getDeclarations_AST(nr_item), (_item, _index, _list) ->

						if _index is 0

							if opts.beautify then traversingResultCache += '\u0020{\n' else traversingResultCache += '{'

						if not isUndefined _item.property

							if opts.beautify

							then traversingResultCache += '\n\t' + _item.property + ': ' + _item.value + ';\n'

							else traversingResultCache += _item.property + ':' + _item.value + ';'

						if _index is (collectionSize(_list) - 1)

							if opts.beautify then traversingResultCache += '\n}\n\n' else traversingResultCache += '}'

						return

			return

		if fnUtil.isStringAndNotEmpty traversingResultCache

			that.createFile traversingResultCache, _output

		if fnUtil.isStringAndEmpty traversingResultCache

			if not that.options.mute

				util.log 'There is no stylesheets contain "' + conditionalClass + '" conditional class.'

		return



# @module css-separation
module.exports = cssSeparation
