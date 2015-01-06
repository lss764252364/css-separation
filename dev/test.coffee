# name: test.js
#
# author: 沈维忠 ( Shen Weizhong / Tony Stark )
#
# Last Update: 沈维忠 ( Shen Weizhong / Tony Stark )



'use strict'



assert        = require 'assert'

util          = require 'gulp-util'

cssSeparation = require '../index'



util.log new cssSeparation().getRules('sample.css')

new cssSeparation({beautify: true})._writeFile('sample.css', 'common.style.css')



describe 'CSS-SEPARATION', ->

	describe '#method()', ->

		return

	return
