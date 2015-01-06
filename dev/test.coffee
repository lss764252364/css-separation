# name: test.js
#
# author: 沈维忠 ( Shen Weizhong / Tony Stark )
#
# Last Update: 沈维忠 ( Shen Weizhong / Tony Stark )



'use strict'



assert        = require 'assert'

util          = require 'gulp-util'

cssSeparation = require '../index'



# util.log new cssSeparation().getRules_AST('sample.css')

# new cssSeparation({beautify: true})._writeFile('sample.css', 'common.style.css')





describe 'CSS-SEPARATION', ->

	describe '#getIdxListOfRuleContainCC()', ->

		it 'should return [4, 5, 6]', ->

			_cssSeparation = new cssSeparation()

			_rules = _cssSeparation.getRules_AST 'test/sample.css'

			idxsOfRuleContainCC = _cssSeparation.getIdxListOfRuleContainCC _rules

			assert.deepEqual [4, 5, 6], idxsOfRuleContainCC

			return

	describe '#getDirname()', ->

		it 'should return "./", if the given value is just "sample.css"', ->

			_cssSeparation = new cssSeparation()

			assert.equal './', _cssSeparation.getDirname 'sample.css'

			return

		it 'should return "./dest", if the given value is just "dest/sample.css"', ->

			_cssSeparation = new cssSeparation()

			assert.equal './dest', _cssSeparation.getDirname './dest/sample.css'

			return

		it 'should return "dev/stylesheet", if the given value is just "dev/stylesheet/sample.scss"', ->

			_cssSeparation = new cssSeparation()

			assert.equal 'dev/stylesheet', _cssSeparation.getDirname 'dev/stylesheet/sample.scss'

			return

	describe '#createFile()', ->

		it 'should create a file named "created.blank.file.css" in "dest" folder', ->

			_cssSeparation = new cssSeparation()

			_cssSeparation.createFile('', './dest/created.blank.file.css')

			return

		return

	return
