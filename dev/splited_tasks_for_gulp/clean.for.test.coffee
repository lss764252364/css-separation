# name: clean.js
#
# author: 沈维忠 ( Shen Weizhong / Tony Stark )
#
# Last Update: 沈维忠 ( Shen Weizhong / Tony Stark )



'use strict'



cfg        = require '../config.json'

gulp       = require 'gulp'

$          = require('gulp-load-plugins')()

del        = require 'del'

ff         = require 'node-find-folder'

order      = cfg.clean_order

cln_prefix = 'clean-'



order.forEach (the) ->

	gulp.task cln_prefix + the, ->

		ff_result = new ff the,

			nottraversal: ['.git', 'node_modules', 'backup']

		ff_result.forEach (_item, _index, _array) ->

			del _item + '/*'

			return

		return

	return



gulp.task 'clean', order.map (the) ->

	cln_prefix + the
