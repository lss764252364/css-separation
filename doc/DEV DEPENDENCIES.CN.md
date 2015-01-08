主要开发依赖
-----------

+ [*Git*](http://git-scm.com/ '点击 · Click')  ( [*Pro Git 中文版*](http://git-scm.com/book/zh/v1 '点击 · Click') )

+ [*Node.js*](http://nodejs.org/ '点击 · Click')

+ [*NPM*](http://npmjs.org/ '点击 · Click')

+ [*Gulp.js*](http://gulpjs.com/ '点击 · Click')

+ [*Sass*](http://sass-lang.com/ '点击 · Click')

+ [*CoffeeScript*](http://coffeescript.org/ '点击 · Click') ( [*中文官网*](http://coffee-script.org/ '点击 · Click') )

+ [*Uglify.js 2*](http://lisperator.net/uglifyjs/ '点击 · Click')

+ [*Mocha.js*](http://mochajs.org/ '点击 · Click')

> 顺序安装；所有依赖均安装在全局环境下。

###Git

同生活中的许多伟大事件一样，`Git` 诞生于一个极富纷争大举创新的年代。`Linux` 内核开源项目有着为数众广的参与者。绝大多数的 `Linux` 内核维
护工作都花在了提交补丁和保存归档的繁琐事务上（1991－2002年间）。到 2002 年，整个项目组开始启用分布式版本控制系统 `BitKeeper` 来管理和
维护代码。到了 2005 年，开发 `BitKeeper` 的商业公司同 `Linux` 内核开源社区的合作关系结束，他们收回了免费使用 `BitKeeper` 的权力。这就
迫使 `Linux` 开源社区（特别是 `Linux` 的缔造者 `Linus Torvalds` ）不得不吸取教训，只有开发一套属于自己的版本控制系统才不至于重蹈覆辙。
他们对新的系统制订了若干目标：速度；简单的设计；对非线性开发模式的强力支持（允许上千个并行开发的分支）；完全分布式；有能力高效管理类似
`Linux` 内核一样的超大规模项目（速度和数据量）。自诞生于 2005 年以来，`Git` 日臻成熟完善，在高度易用的同时，仍然保留着初期设定的目标。
它的速度飞快，极其适合管理大项目，它还有着令人难以置信的非线性分支管理系统，可以应付各种复杂的项目开发需求。整个项目使用 `Git` 进行版本
控制。你可以通过下述命令检查 `Git` 在你的电脑上是否被安装成功：

```bash
git --help
```

###Node

`Node.js` 是一个基于 `Chrome JavaScript` 运行时建立的一个平台，用来方便地搭建快速的 易于扩展的网络应用。`Node.js` 使用事件驱动、非阻塞
`I/O` 模型，这使 `TA` 变得轻量、高效，并且非常适合跨分布式设备的数据密集型实时应用。你可以通过下述命令检查 `Node.js` 在你的电脑上是否被
安装成功：

```bash
node --help
```

###NPM

`NPM` 全称是 `Node Package Manager`, 是 `Node.js` 的包管理和分发工具，已经成为了非官方的发布 `Node.js` 模块（包）的标准。
如果你熟悉 `Ruby` 的 `gem`，`Python` 的 `pypi` 、`setuptools`，`PHP` 的 `pear`，那么你就知道 `NPM` 的作用是什么了。
`Node.js` 自身提供了基本的模块，但是开发实际应用过程中仅仅依靠这些基本模块则还需要较多的工作。幸运的是，`Node.js` 库和框架为
我们提供了帮助，让我们减少工作量。但是成百上千的库或者框架管理起来又很麻烦，有了 `NPM`，可以很快的找到特定服务要使用的包，进行
下载、安装以及管理已经安装的包。你可以通过下述命令检查 `NPM` 在你的电脑上是否被安装成功：

```bash
npm --help
```

###Gulp.js

`Gulp.js` 是一种基于流、代码优于配置的构建工具。`Gulp.js` 和 [*Grunt.js*](http://gruntjs.com/ '点击 · Click') 类似。工程中的
所有构建任务完全使用 `Gulp.js` 实现。你可以通过下述命令检查 `Gulp.js` 在你的电脑上是否被安装成功：

```bash
gulp --version
```

####Sass
`Sass` 是让 `CSS` 基础语法更加強大、优雅的扩充版本。它允许你使用变量, 嵌套规则、函数、内联引入等众多功能，并且完全相容 `CSS` 既
有语法。`Sass` 有助于保持大型样式表的严谨结构，同時也让人能夠快速上手小型样式表。你可以通过下述命令检查 `Sass` 在你的电脑上是否
被安装成功：

```bash
sass --help
```

####CoffeeScript

`CoffeeScript` 是一门编译到 `JavaScript` 的小巧语言。`TA` 尝试用简洁的方式展示 `JavaScript` 优秀的部分。`CoffeeScript` 的
指导原则是: `TA 仅仅是 JavaScript`。代码一一对应地编译到 `JS`, 不会在编译过程中进行解释。已有的 `JavaScript` 类库可
以无缝地和 `CoffeeScript` 搭配使用, 反之亦然。编译后的代码是可读的, 且经过美化, 能在所有 `JavaScript` 环境中运行, 并
且应该和对应手写的 `JavaScript` 一样快或者更快！你可以通过下述命令检查 `CoffeeScript`  在你的电脑上是否被安装成功：

```bash
coffee --help
```

###Uglify.js 2

`Uglify.js` 是一个通用的 `JavaScript` 语法分析 / 混淆 / 压缩 / 美化工具，基于 `Node.js` 开发。你可以通过下述命令检查
`Uglify.js` 在你的电脑上是否被安装成功：

```bash
uglifyjs --help
```

###MochaJS

`Mocha.js` 是一个基于 `Node.js` 和浏览器的集合各种特性的 `JavaScript` 测试框架，并且可以让异步测试也变的简单和有趣。`Mocha.js` 的测试是
连续的，在正确的测试条件中遇到未捕获的异常时，会给出灵活且准确的报告。`Mocha.js` 托管
在 [*Github*](https://github.com/mochajs/mocha '点击 · Click') 上。

```bash
mocha --help
```