# name: index.js
#
# author: 沈维忠 ( Shen Weizhong / Tony Stark )
#
# Last Update: 沈维忠 ( Shen Weizhong / Tony Stark )



'use strict'



fs             = require 'fs'

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



# @name _default
# @description Default options.
# @type
#	{object}   _default
#	{boolean}  _default.beautify
#	{array}    _default.conditionalClass
# @author 沈维忠 ( Tony Stark / Shen Weizhong )
_default =

	beautify: false

	conditionalClass: ['.ie7', '.ie8']



# @class cssSeparation
# @description
# eparate content like conditional stylesheets(and soon...) from "*.css" file
# , and generate individual files for them according to certain rules!
# @param {object} separateOptions
# @author 沈维忠 ( Tony Stark / Shen Weizhong )
class cssSeparation

    # @constructs
	constructor: ->

		option = arguments[0]

		if isObjectBrace option

			@options = extend _default, option

		else

			@options = _default

	getSource: (cssFile) ->

		if isString(cssFile) and not isEmpty(cssFile)

			fs.readFileSync cssFile,

				encoding: 'utf8'

	getAST: (cssFile) ->

		if isString(cssFile) and not isEmpty(cssFile)

			css.parse @getSource cssFile

	getRules: (cssFile) ->

		@getAST(cssFile).stylesheet.rules

	# @description Know if the value of selector key which in the current rule contain conditional class.
	# @param {string} selector-the value of the seletor key of current rule
	# @returns {boolean} If the value of seletor key which in the current rule contain conditional class, return true, otherwise return false.
	# @author 沈维忠 ( Tony Stark / Shen Weizhong )
	isConditionalSelector: (selector) ->

		that = @

		identificationResult = undefined

		each that.options.conditionalClass, (cc_item, cc_index, cc_list) ->

			if hasStr selector, cc_item

				identificationResult = true

			return

		if isUndefined identificationResult then false else identificationResult

	# @description 在 "CSSOM" 的 "rules" 对象（数组）中获取包含条件类的规则的对象的索引（位置）
	getIdxListOfRuleContainCC = ->

		return

	getSelectors: (currentRule, filterConditionalStyle) ->

		that = @

		st = ''

		_sltCache = []

		if collectionSize(currentRule.selectors) >= 2

			each currentRule.selectors, (slts_item, slts_index, slts_list) ->

				if filterConditionalStyle

					if that.isConditionalSelector slts_item

						_sltCache.push slts_item

				else

					if slts_index isnt (collectionSize(slts_list) - 1)

						if that.options.beautify then st += slts_item + ',\n' else st += slts_item + ','

					else

						st += slts_item

			if filterConditionalStyle

				if not isEmpty _sltCache

					util.log _sltCache

					if collectionSize(_sltCache) >= 2

						if that.options.beautify

						then st += _sltCache.join(',\n')

						else st += _sltCache.join(',')

					else

						st += _sltCache[0]

		else

			if filterConditionalStyle

				if that.isConditionalSelector currentRule.selectors[0]

					st += currentRule.selectors[0]

				else

					st += ''

			else

				st += currentRule.selectors[0]

		st

	getDeclarations: (currentRule) ->

		currentRule.declarations

	getCommonCss: (cssFile) ->

		that = @

		traversingCache = ''

		each @getRules(cssFile), (item, index, list) ->

			if item.type is 'rule'

				# traverse/set selectors
				traversingCache += that.getSelectors item, true

				# traverse/set declarations
				each that.getDeclarations(item), (_item, _index, _list) ->

					if _index is 0

						if that.options.beautify then traversingCache += '\u0020{\n' else traversingCache += '{'

					if not isUndefined _item.property

						if that.options.beautify

						then traversingCache += '\n\t' + _item.property + ': ' + _item.value + ';\n'

						else traversingCache += _item.property + ':' + _item.value + ';'

					if _index is (collectionSize(_list) - 1)

						if that.options.beautify then traversingCache += '\n}\n\n' else traversingCache += '}'

					return

			return

		traversingCache

	_writeFile: (cssFile, writeFile) ->

		fs.writeFileSync writeFile, @getCommonCss cssFile

		return



# @module css-separation
module.exports = cssSeparation
