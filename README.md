CSS-SEPARATION
==============

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/iTonyYo/css-separation?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge '点击 · Click') [![Build status](https://ci.appveyor.com/api/projects/status/2fm97t60f9m292yp/branch/master?svg=true)](https://ci.appveyor.com/project/iTonyYo/css-separation/branch/master '点击 · Click') [![Travis CI](https://api.travis-ci.org/iTonyYo/css-separation.svg)](https://travis-ci.org/iTonyYo/css-separation '点击 · Click') [![Project Dependencies](https://david-dm.org/iTonyYo/css-separation.png)](https://david-dm.org/iTonyYo/css-separation '点击 · Click') [![Project devDependencies](https://david-dm.org/iTonyYo/css-separation/dev-status.png)](https://david-dm.org/iTonyYo/css-separation#info=devDependencies '点击 · Click') [![Issue Stats](http://issuestats.com/github/iTonyYo/css-separation/badge/issue?style=flat)](http://issuestats.com/github/iTonyYo/css-separation '点击 · Click') [![Issue Stats](http://issuestats.com/github/iTonyYo/css-separation/badge/pr?style=flat)](http://issuestats.com/github/iTonyYo/css-separation '点击 · Click') [![NPM · downloads, rank and stars](https://nodei.co/npm/css-separation.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/css-separation '点击 · Click')



[![CSS-SEPARATION WIKI](http://g.hiphotos.baidu.com/image/pic/item/0824ab18972bd4077b71765178899e510eb309e3.jpg)](https://github.com/iTonyYo/css-separation/wiki '点击 · Click')



Primer
------

Separate content like conditional stylesheets(and so on...) from ".css" file, and generate individual files for them according to certain rules!

The stylesheets for IE8 shouldn't be download in IE7... The stylesheets for IE shouldn't be downloaded in Google Chrome(Or Google Chrome Canary, Google Chrome Chromium, Safari, Opera, Opera Dev, Firefox, Firefox Dev and so on...)... The stylesheets used hacks for specify browser shouldn't be downloaded in other browsers... The stylesheets for modile shouldn't be downloaded when someone use desktop computer to visit the site...

Maybe requirements described above can be done manually. But... This kind of jobs are very complicated... If file and folder structure of project consider these requirements when the project is in progress, it will make efficiency of the actual development be extremely low; maintenance work will be very hard; developers will have strong emotional resistance...

But the content talked above can indeed help to optimize web sites(any form of using WEB technology)...

Because...

Who knows how much your project will be... Who knows how many developers are there in your project... Who knows what would you use between [*BROWSERHACKS*](http://browserhacks.com/ '点击 · Click') and [*MODERNIZR*](http://modernizr.com/ '点击 · Click') to make your WEB application user interface under different rendering engine, adaptation model to get closer to the perfect show...

So... I want to write `CSS-SEPARATION` to implement the requirements described above. For helping web developers who use the practice from [*《Conditional Stylesheets vs CSS Hacks? Answer: Neither!》*](http://www.paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ '点击 · Click').



Usage
-----

**Install**

![how to install](https://nodei.co/npm/css-separation.png?mini=true)

Just use `npm install css-separation` command. Of course you can use `--save-dev` param after the command above to save `css-separation` to `package.json` of your project.

**Folder structure for reference,**

```
root/
├── [.git]
├── [doc]
├── [node_modules]
├── [dev]
│   ├── [code]
│   │   ├── [splited_tasks_for_gulp]
│   │   ├── [scripts]
│   │   ├── [stylesheets]
│   ├── [image]
│   ├── [font]
├── [dest]
│   ├── [bower_components]
│   ├── [resources]
│   │   ├── [css]
│   │   ├── [js]
│   │   ├── [img]
│   │   ├── [font]
├── [gulp]
├── [test]
├── [tool]
```

**Code details,**

```js
...

var separator;

instance  = require('css-separation');

separator = new instance();

separator.deal('dest/resources/css/example.css');

...
```



API
------

#### new cssSeparation(options)

+ options

	+ mute, **`boolean` type; default value is `true`**; if allow some codes to log messages.

	+ dest, **`string` type; default value is an empty string**; Generate file to specified folder.

	+ conditionalClass, **`array` type; default value is an empty array**; if need to filter conditional stylesheets, `css-separation` will use the conditional classes defined here to filter the given '*.css' file(s).

	+ beautify, **`boolean` type; default value is `true`**; if `true`; the output has a beautiful format, otherwise, the output will be the compressed format.

	+ filterCommonCSS, **`boolean` type; default value is `true`**; if filter common stylesheets.

	+ filterConditionalCSS, **`boolean` type; default value is `true`**; if filter the conditional stylesheets.

	+ filterMediaCSS, **`boolean` type; default value is `true`**; if filter media query stylesheets.

Create an instance of `css-separation`.

#### .deal(src)

+ src, **`string` or `array` type**; the source(s) need to be separated.

Deal the given `*.css` file(s).

#### .gen(category, src, options)

+ category, **`string` type**; specify kind of stylesheets

+ src, **`string` type**; specify `*.css` file

+ options

	+ mute, **`boolean` type; default value is `true`**; if allow some codes to log messages.

	+ dest, **`string` type; default value is an empty string**; Generate file to specified folder.

	+ conditionalClass, **`array` type; default value is an empty array**; if need to filter conditional stylesheets, `css-separation` will use the conditional classes defined here to filter the given '*.css' file(s).

	+ beautify, **`boolean` type; default value is `true`**; if `true`; the output has a beautiful format, otherwise, the output will be the compressed format.

Use specify configuration to generate specify kind of stylesheets for specify `*.css` file.

#### .get(category, src, options)

+ category, **`string` type**; specify kind of stylesheets

+ src, **`string` type**; specify `*.css` file

+ options

	+ mute, **`boolean` type; default value is `true`**; if allow some codes to log messages.

	+ dest, **`string` type; default value is an empty string**; Generate file to specified folder.

	+ conditionalClass, **`array` type; default value is an empty array**; if need to filter conditional stylesheets, `css-separation` will use the conditional classes defined here to filter the given '*.css' file(s).

	+ beautify, **`boolean` type; default value is `true`**; if `true`; the output has a beautiful format, otherwise, the output will be the compressed format.

Use specify configuration to get specify kind of stylesheets for specify `*.css` file. Then you can do anything with the result.



Helping CSS-SEPARATION
----------------------

#### What's CSS-SEPARATION working on next?

You can check the plan of development in my related [*Trello*](https://trello.com/b/o3aR7tSY '点击 · Click') board! I use [*Trello*](https://trello.com/ '点击 · Click') to manage the plan of this project. And we can discuss a lot through the related board! Of course we can use [*Gitter*](https://gitter.im/iTonyYo/css-separation?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge '点击 · Click') to discuss, too! You can choose your favorite kind of communication form!

#### My requirement is not met!

A person's strength is limited, I will ignore something... Or, I just did not get the idea what you think... If you'd like to help to improve the project, whelcome you to present your ideas on [*Gitter*](https://gitter.im/iTonyYo/css-separation?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge '点击 · Click') or [*Trello*](https://trello.com/b/o3aR7tSY '点击 · Click'). I will be very gratefull!

#### I found a bug!

If you found a repeatable bug, and tips from [*Usage*]( '点击 · Click') section didn't help, then be sure to [*search existing issues*](https://github.com/iTonyYo/css-separation/issues '点击 · Click') first. If there's no content is similar with the problem you found, welcome you to create a new issue you found!

#### I want to help with the code!

Awesome! I use Github to managed code. So there are lots of ways you can help. First read [*CONTRIBUTION.EN.md*](https://github.com/iTonyYo/css-separation/blob/master/doc/CONTRIBUTION.EN.md '点击 · Click'), then learn [*be social with Github*](https://help.github.com/articles/be-social/) and [*how to pull the repo*](https://help.github.com/articles/creating-a-pull-request/ '点击 · Click') on `css-separation`.



Contact info
------------

+ **Twitter:** [*@iTonyYo*](https://twitter.com/iTonyYo)

+ **Blog:** *https://medium.com/@itonyyo*

+ **More? Check here:** *http://www.evernote.com/l/AIdKUowUzdNLbK_gDY54E0gAqdcNuAol59E/*



LICENSE
------

See also [*LICENSE*](https://github.com/iTonyYo/css-separation/blob/master/LICENSE '点击 · Click') .



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/iTonyYo/css-separation/trend.png)](https://bitdeli.com/free "Bitdeli Badge")