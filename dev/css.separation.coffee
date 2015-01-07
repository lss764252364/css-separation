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

			_debug 'log', 'merged Configuration...'

		else

			@options = _default

			_debug 'log', 'not merged Configuration...'

	# @param {string | array} cssFiles Stylesheet(s) need(s) to be separated.
	deal: (@cssFiles) ->

		that = @

		# 假设传入的是单个文件（数据类型为字符串）:
		# 	获取文件名；
		# 	获取该文件所在文件夹相对路径；
		# 	为该文件生成独属于该文件的所有符合预设分离条件的文件。
		# 	处理该文件，并把结果分别写到对应文件中；
		# 假设传入的是多个文件（数据类型为数组）:
		#
		# ...

		fileName = that.getBasename cssFiles, '.css'

		relativePath = that.getDirname cssFiles

		that.generateFile relativePath, fileName

		return

	getBasename: (file, ext) ->

		if isString(file) and not isEmpty(file)

			if isString(ext) and not isEmpty(file)

				path.basename file, ext

			else

				path.basename file

	getDirname: (file) ->

		_dirname = path.dirname file

		if _dirname is '.' then './' else _dirname

	generateFile: (relativePath, belong) ->

		that = @

		if that.options.filterConditionalStylesheets

			_debug 'log', '需要过滤出条件样式 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'

			if isArray(that.options.conditionalClass) and not isEmpty(that.options.conditionalClass)

				each that.options.conditionalClass, (item, index, list) ->

					_newFile = belong + item + '.css'

					_output = relativePath + '/' + _newFile

					that.generateCCFile item, _output

					_debug 'log', '需要被生成文件的命名是：' + _newFile

					_debug 'log', '需要被生成文件的路径是：' + _output

					return

		return

	createFile: (_content, _output) ->

		if isString(_content) and isString(_output)

			fs.writeFileSync _output, _content

			_debug 'log', '已写入文件。'

		return

	getSource: (cssFile) ->

		if isString(cssFile) and not isEmpty(cssFile)

			fs.readFileSync cssFile,

				encoding: 'utf8'

	getAST: (cssFile) ->

		if isString(cssFile) and not isEmpty(cssFile)

			css.parse @getSource cssFile

	getRules_AST: (cssFile) ->

		@getAST(cssFile).stylesheet.rules

	getSelectors_AST: (currentRule) ->

		currentRule.selectors

	getDeclarations_AST: (currentRule) ->

		currentRule.declarations

	# @description Know if the value of selector key which in the current rule contain conditional class.
	# @param {string} selector-the value of the seletor key of current rule
	# @returns {boolean} If the value of seletor key which in the current rule contain conditional class, return true, otherwise return false.
	# @author 沈维忠 ( Tony Stark / Shen Weizhong )
	isConditionalSelector: (selector) ->

		that = @

		identificationResult = undefined

		if isArray(selector) and not isEmpty(selector)

			each that.options.conditionalClass, (cs_item, cs_index, cs_list) ->

				if hasStr selector, cs_item

					identificationResult = true

				return

		if isUndefined identificationResult then false else identificationResult

	# @description 在 "CSSOM" 的 "rules" 对象（数组）中获取包含条件类的规则的对象的索引（位置）
	getIdxListOfRuleContainCC: (_rules) ->

		that = @

		_arr = []

		each _rules, (cc_item, cc_index, cc_list)->

			if cc_item.type is 'rule'

				if that.isConditionalSelector that.getSelectors_AST(cc_item)

					_arr.push cc_index

			return

		_arr

	generateCCFile: (conditionalClass, _output)->

		that = @

		newRules = []

		traversingResultCache = ''

		_debug 'log', '需要单独操作的文件是：' + that.cssFiles

		_rules = that.getRules_AST that.cssFiles

		idxs = that.getIdxListOfRuleContainCC _rules

		_debug 'log', '包含条件类的规则的对象的索引（位置）集合是：' + idxs

		each idxs, (item, index, list) ->

			newRules.push _rules[+item]

			return

		_debug 'log', '仅存在包含条件类的规则的对象的AST：' + newRules

		filterSelector = (currentRule) ->

			strSlt=''

			_sltCache = []

			slt_ast = that.getSelectors_AST(currentRule)

			_debug 'log', '当前AST规则包含的 "selectors" 属性的值是：' + slt_ast

			if collectionSize(slt_ast) >= 2

				each slt_ast, (slts_item, slts_index, slts_list) ->

					if hasStr slts_item, conditionalClass

						_sltCache.push slts_item

					return

				if collectionSize(_sltCache) >= 2

					if that.options.beautify then strSlt += _sltCache.join(',\n') else strSlt += _sltCache.join(',')

				else if not isEmpty _sltCache

					strSlt += _sltCache[0]

			else

				_slt = slt_ast[0]

				if hasStr _slt, conditionalClass

					strSlt += _slt

			strSlt

		each newRules, (nr_item, nr_index, nr_list) ->

			if nr_item.type is 'rule'

				sltFltRslt = filterSelector(nr_item)

				if not isEmpty sltFltRslt

					traversingResultCache += sltFltRslt

					each that.getDeclarations_AST(nr_item), (_item, _index, _list) ->

						if _index is 0

							if that.options.beautify then traversingResultCache += '\u0020{\n' else traversingResultCache += '{'

						if not isUndefined _item.property

							if that.options.beautify

							then traversingResultCache += '\n\t' + _item.property + ': ' + _item.value + ';\n'

							else traversingResultCache += _item.property + ':' + _item.value + ';'

						if _index is (collectionSize(_list) - 1)

							if that.options.beautify then traversingResultCache += '\n}\n\n' else traversingResultCache += '}'

						return

			return

		_debug 'log', '输出遍历结果：' + traversingResultCache

		if isString(traversingResultCache) and not isEmpty(traversingResultCache)

			_debug 'log', '遍历结果写至：' + _output

			that.createFile traversingResultCache, _output

			_debug 'log', '------------------------------------------------------------------------------------------'

		if isString(traversingResultCache) and isEmpty(traversingResultCache)

			if not that.options.mute

				util.log 'There is no stylesheets contain "' + conditionalClass + '" conditional class.'

			_debug 'log', '------------------------------------------------------------------------------------------'

		return



# @module css-separation
module.exports = cssSeparation
