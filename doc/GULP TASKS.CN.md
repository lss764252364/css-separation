Gulp 构建任务
------------

- [X] [*默认任务*]( '点击 · Click')

- [X] [*监听任务*]( '点击 · Click')

- [X] [*SASS 预处理任务*]( '点击 · Click')

- [X] [*CSS 样式表压缩任务*]( '点击 · Click')

- [X] [*CoffeeScript 预处理任务*]( '点击 · Click')

- [X] [*CoffeeScript 语法检测任务*]( '点击 · Click')

- [X] [*JS 脚本压缩任务*]( '点击 · Click')

- [X] [*执行 MochaJS 任务*]( '点击 · Click')

- [X] [*清除任务*]( '点击 · Click')



详细
----

###默认任务

通常情况下，通过运行该任务开始编辑 `CSS-SEPARATION` 工程。该任务会同时执行 [*CoffeeScript 预处理任务*]( '点击 · Click') 和 [*监听任务*]( '点击 · Click')。

```bash
gulp
```

###监听任务

监听指定目录下预处理文件是否发生改动，若改动的话，会实时执行相关预处理任务，比如：[*SASS 预处理任务*]( '点击 · Click')，[*CoffeeScript 预处理任务*]( '点击 · Click') 等。通常不会单独使用该任务，而是使用 [*默认任务*]( '点击 · Click') 开始编辑 `CSS-SEPARATION` 工程。

```bash
gulp watch
```

###SASS 预处理任务

处理指定源预处理文件，生成普通 `*.css` 文件。

```bash
gulp sass
```

###CSS 样式表压缩任务

压缩指定源 `*.css` 文件。

```bash
gulp cmprs_css
```

###CoffeeScript 预处理任务

处理指定源预处理文件，生成普通 `*.js` 文件。

```bash
gulp coffeescript
```

###CoffeeScript 语法检测任务

检测指定源 `*.coffee` 文件的语法。

```bash
gulp coffeelint
```

###JS 脚本压缩任务

压缩指定源 `*.js` 文件。

```bash
gulp cmprs_js
```

###执行 MochaJS 任务

执行 `MochaJS` 测试用例。

```bash
gulp mocha
```

###清除任务

清除供生成用的目录（比如："dest"等）下所有文件、文件夹等。

```bash
gulp clean
```