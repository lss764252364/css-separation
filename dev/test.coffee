# name: test.js
#
# author: 沈维忠 ( Shen Weizhong / Tony Stark )
#
# Last Update: 沈维忠 ( Shen Weizhong / Tony Stark )



'use strict'



assert         = require 'assert'

path           = require 'path'

glob           = require 'glob'

util           = require 'gulp-util'

cssSeparation  = require '../index'

_cssSeparation = new cssSeparation

	mute: true

	conditionalClass: ['.ie6', '.ie7', '.ie8', '.ie9', '.ie10', '.ie11']

	beautify: true

	filterCommonCSS: true



# util.log new cssSeparation().getRules_AST('sample.css')

# new cssSeparation({beautify: true})._writeFile('sample.css', 'common.style.css')





describe 'CSS-SEPARATION', ->

	describe '#deal()', ->

		it 'should create some file like "sample.ie6.css" around "sample.css" file', ->

			_cssSeparation.deal 'test/sample.css'

			return

		return

	describe '#getIdxListOfCommonCSS_AST()', ->

		it 'should return [1, 2, 3]', ->

			_rules = _cssSeparation.getRules_AST 'test/sample.css'

			idxListOfCommonCSS = _cssSeparation.getPositionsOfSameClassOfRules 'common', _rules

			assert.deepEqual [1, 2, 3], idxListOfCommonCSS

			return

		return

	describe '#getIdxListOfConditialCSS_AST()', ->

		it 'should return [4, 5, 6]', ->

			_rules = _cssSeparation.getRules_AST 'test/sample.css'

			idxsOfRuleContainCC = _cssSeparation.getPositionsOfSameClassOfRules 'condition', _rules

			assert.deepEqual [4, 5, 6], idxsOfRuleContainCC

			return

		return

	describe '#getIdxListOfMediaCSS_AST()', ->

		it 'should return [7]', ->

			_rules = _cssSeparation.getRules_AST 'test/sample.css'

			idxListOfMediaCSS = _cssSeparation.getPositionsOfSameClassOfRules 'media', _rules

			assert.deepEqual [7], idxListOfMediaCSS

			return

		return

	describe '#isContainConditionalSelector()', ->

		it 'should return true if the given selectors list is [".ie7 .frmRegister > .fieldArea"]', ->

			assert.equal true, _cssSeparation.isContainConditionalSelector [".ie7 .frmRegister > .fieldArea"]

			return

		it 'should return true if the given selectors list is [".ie7 .frmRegister > .iptPhoneCodeArea", ".ie8 .frmRegister > .iptPhoneCodeArea", ".ie9 .frmRegister > .iptPhoneCodeArea"]', ->

			assert.equal true, _cssSeparation.isContainConditionalSelector [".ie7 .frmRegister > .iptPhoneCodeArea", ".ie8 .frmRegister > .iptPhoneCodeArea", ".ie9 .frmRegister > .iptPhoneCodeArea"]

			return

		return

	describe '#getDirname()', ->

		it 'should return "./", if the given value is just "sample.css"', ->

			assert.equal './', _cssSeparation.getDirname 'sample.css'

			return

		it 'should return "./dest", if the given value is just "dest/sample.css"', ->

			assert.equal './dest', _cssSeparation.getDirname './dest/sample.css'

			return

		it 'should return "dev/stylesheet", if the given value is just "dev/stylesheet/sample.scss"', ->

			assert.equal 'dev/stylesheet', _cssSeparation.getDirname 'dev/stylesheet/sample.scss'

			return

		return

	describe '#createFile()', ->

		it 'should create a file named "created.blank.file.css" in "dest" folder', ->

			_cssSeparation.createFile('', './dest/created.blank.file.css')

			return

		return

	return
