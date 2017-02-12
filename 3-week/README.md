# npm script的介绍

原文请点击[这里](http://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)

目录

* [npm Scripts](#npm-script-1)
* [简写的脚本命令](#npm-script-2)
* [预处理](#npm-script-3)
* [传递参数](#npm-script-4)
* [npm config变量](#npm-script-5)
* [Windows的问题](#npm-script-6)
* [替换构建工具](#npm-script-7)
* [使用多文件](#npm-script-8)
* [执行多个任务](#npm-script-9)
* [流式处理多个任务](#npm-script-10)
* [版本冲突](#npm-script-11)
* [清除](#npm-script-12)
* [编译文件使其拥有唯一的名字](#npm-script-13)
* [实时检测](#npm-script-14)
* [实时刷新](#npm-script-15)
* [运行不是二进制的任务](#npm-script-16)
* [一个相当复杂的配置](#npm-script-17)
* [结论](#npm-script-18)

## 如何让npm成为构建工具

上个月我发布了关于为什么应该停止使用Grunt、Gulp等工具。我建议用npm script来代替。npm script可以做和那些构建工具一样的事情。需要更少的包。开始的草稿件大概有6000字来深入介绍npm如何使用，但是我移除它了。因为它仅仅是个观点不是教程。很多人告诉我那些构建工具的所具有的特点而npm不具备。有人还会展示出Gruntfile并说这些如何在npm中实现呢？我将集中讨论如何通过使用npm来执行这些常用的任务。

npm是一个很牛b的工具，它所提供的远比我们眼睛能看到的多的多。它已经成为了nodejs社区的一部分，很多人包括我每天都会经常用它。实际上在看我的BASH记录（同样的Fish记录）npm是我用的第二大常用命令仅次于git。每天都能发现关于npm的一些新的特性（当然，新的类似的东西仍然会被开发出来）。大部分的目的都是让npm成为一个强大的包管理工具，但是npm也是一个强大的构建工具。

### <a name="npm-script-1"></a>npm Scripts

首先我们需要指出npm是如何管理构建脚本的。作为npm的核心，它有```npm run-script```(简写使用npm run)。这个命令可以进入你的```package.json```然后执行scripts对象中的东西。npm run的第一个参数指向了scripts对象中的一个属性，在操作系统默认的shell中，它将会执行这个属性的值来作为命令来执行，来看一个```package.json```配置如下面所示：

```javascript
{
  "name": "myproject",
  "devDependencies": {
    "jshint": "latest",
    "browserify": "latest",
    "mocha": "latest"
  },
  "scripts": {
    "lint": "jshint **.js",
    "test": "mocha test/"
  }
}
```

如果你执行```npm run lint```-npm将会在shell中去跑```jshint **.js```。如果你执行```npm run test```，npm将会在shell中去跑```mocha test/```。此时的shell环境会将```node_modules/.bin```添加到环境变量中，这也就是以为着你安装的任何依赖都可以直接执行了。也就是说不需要执行```./node_modules/.bin/jshint **.js```或者```$(npm bin)/jshint **.js```。如果你直接执行```npm run```，不带任何参数，这将会显示有效的命令列表，像下面这样：

```javascript
Available scripts in the user-service package:
  lint
     jshint **.js
  test
    mocha test/
```

这个```npm run```shell中的环境提供了很多非常有用的特性，来确保你的脚本都正常执行。例如这个shell的环境变量已经有```./node_modules/.bin/```目录在其中了，意味着你通过这个脚本可以直接执行安装好的依赖所用到的命令。并且还可以获得到正在运行的任务、package的名字和版本等等。可用通过执行```env```来显示这些：

```javascript
"scripts": {
    "env": "env"
}
```

### <a name="npm-script-2"></a>简写的脚本命令

npm也提供了一些便利的简写法。在这个shell环境中```npm test```、```nam start```、```npm stop```这些简写方式是和加了run的方式是一样的。例如```npm test```是```npm run test```的简写。这些简写有2点有用的地方：

1. 这些常用的任务在大部分的工程中都会用到，所以没必要每次都要打全。
2. 更重要的是，它提供了一种标准的接口对于：测试、启动和停止。很多集成工具比如Travis，获取了这个的好处，它使用的默认的```npm test```来跑测试。这个同样也对新的开发者很有帮助，不用读任何文档就可以执行一些```npm test```等的脚本了。

### <a name="npm-script-3"></a>预处理

另外个很棒的特色是npm可以让任何脚本都可以设置```pre-```和```post-```钩子，这在```scripts```的对象中很容易来定义。举个例子，如果你执行```npm run lint```，尽管npm并不知道```lint```这个任务，它仍然可以立即执行```npm run replint```,之后是```npm run lint```最后是```npm run postlint```。这个在其它的命令也同样适用，包括```npm test```（```npm run pretest```，```npm run test```，```nam run posttest```）。这个pre和post脚本也都是识别退出标记的，也就是说如果你的```pretest```脚本出现了不为0的exit代码，这是npm会立即停止，并且不会执行```test```和```posttest```了。你不能在```pre-```前使用```pre-```，所以```prepretest```将会被忽略。npm也会使用```pre-```和```post-```处理一些内部的命令：```install```，```uninstall```，```publish```，```update```。你不能覆盖这些内部命令的行为，但是你可以使用```pre-```和```post-```脚本来影响这些行为。你可以像下面来处理：

```javascript
"scripts": {
    "lint": "jshint **.js",
    "build": "browserify index.js > myproject.min.js",
    "test": "mocha test/",

    "prepublish": "npm run build # also runs npm run prebuild",    
    "prebuild": "npm run test # also runs npm run pretest",
    "pretest": "npm run lint"
  }
```

### <a name="npm-script-4"></a>传递参数

npm(至少npm版本 2.0.0)还有个超酷的特点是可以传递参数，可能有点复杂，下面是一个例子：

```javascript
 "scripts": {
    "test": "mocha test/",
    "test:xunit": "npm run test -- --reporter xunit"
  }
```

通过这个配置我们执行```npm run test```会执行```mocha test/```，我可以使用自定义的参数通过```--```前缀来进行扩展。例如```npm run test -- anothertest.js```将会执行```mocha test/ anothertest.js```，更有用的例子是```npm run test -- --grep parser```将会执行```mocha test/ --grep parser```（这仅仅会执行带有“parser”的文件）。在这个package.json中我们有```test:xunit```，它会执行```mocha test/ --reporter xunit```。这个设置对于组合各种命令为了更高级的配置是非常有用的。

### <a name="npm-script-5"></a>npm config变量

最后一个特色是很值得提及的：npm在package.json中有个config指令。这可以让你设置任何值，这个值可以在scripts中当做环境变量来取到，下面是个例子：

```javascript
"name": "fooproject",
  "config": {
    "reporter": "xunit"
  },
  "scripts": {
    "test": "mocha test/ --reporter $npm_package_config_reporter",
    "test:dev": "npm run test --fooproject:reporter=spec"
  }
```

在这里```config```对象有个```reporter```属性，设置了```'xunit'```。所有配置的选项都可以以```npm_package_config_```作为环境变量，在上面的例子中```npm run test```命令就用了```$npm_package_config_reporter```变量，它是```mocha test/ --reporter xunit```的扩展。这可以用两种简便的方式来替换：

1. 试试```test:dev```任务，通过使用—fooproject:reporter你就改变了```reporter```的变量成了```spec```。你应该用项目的名字来替换```fooproject```,而```reporter```则用config中的变量来覆盖。
2. 它也可以通过作为用户配置的一部分来覆盖。用过运行```npm config set fooproject:reporter spec```（或者在```./npmrc```中：```fooproject:reporter-spec```），这样在运行时就被读取了，并且覆盖了```npm_package_config_reporter```变量，意味着在我本地的环境执行```npm run test```永远都会执行```mocha test/ --reporter spec```。可以通过```npm config delete fooproject:mocha_reporter```命令来删除这个配置。好的方式就是在```package.json```中设置会比较合理，但如果仅仅是自己的设置则可以放到```~/.npmrc```中。

就现在来，诚实地说我并不喜欢这种方式。这些配置看起来也不那么重要，这么使用看起来累赘又复杂。我喜欢更简单的方式来覆盖package的配置，这种方式不用指明package的名字，如果这成为标准的话将非常棒。这种做法就是在我的```./.npmrc```中设置我自己的mocha reporter。

另外个不太好的是对Windows不是很友好，Windows使用```%```而base使用```$```。如果在nodejs环境使用是没问题的，如果有人知道让他们在Windows和shell命令都工作，请告诉我！

### <a name="npm-script-6"></a>Windows的问题

在我们继续的时候需要发现些问题。因为npm是依赖操作系统来执行脚本命令的，这将不可移植。Linux，Solaris，BSD和Mac OSX都会预先安装好Bash来作为默认的shell，而Windows不是。在Windows中，npm将会使用Windows的命令来做这些。

幸运的是问题不大。一些好的语法在Windows命令和shell中同样适用：

* && 任务链（同步）
* & 任务（异步）
* '>'输出的值存入到对应的文件中 例如：echo "123" > index.html
* '<' 输文件的内容通过命令来打印出来 例如：```wc < index.html```
* '|'把前者的输出作为输入传给下一个

这两个最大的区别就是可用性、命令的名字和变量。我喜欢克服这些难点：

1. 不要用那些内置的命令，你可以简单地使用一些备选方案：比如你可以使用npm的```rimraf```来替换内置个```rm```。
2. 不要使用那些不能兼容的语法，同上所述。

### <a name="npm-script-7"></a>替换构建工具

好了，让我们开始这篇文章的核心吧。如果你想替换那些构建工具比如Grunt或者Gulp，我们需要一个个地替换那些构建工具的特点。我已经从大量的项目中获取到了最流行的任务、范例以及评论者的问题，并证明了如何使用npm来实现：

### <a name="npm-script-8"></a>使用多文件

有一些朋友在我最新的文章中做了回复，他们觉得任务执行器有能力去处理不同的文件，类似```*。js```，```*.min.css```或者```assets/*/*```。这个特点是受base的启发，而bash是受Unix的启发。shell会找到例如```*.js```的参数，将*作为通配符来处理。用两个```**```代表允许递归地查询。如果你使用Mac或者Linux机器，打开你的shell并试着运行看看（比如```ls *.js```）。

现在问题已经显示出来了，Windows命令行不识别这些通配符。当输入类似```*。js```这样的命令后，Windows会传递这些参数，而那些包工具则会识别这些参数，这就好像让Windows也有了识别通配符的功能。像下面所示：

```javascript
"devDependencies": {
  "jshint": "latest"
},
"scripts": {
  "lint": "jshint *.js"
}
```

### <a name="npm-script-9"></a>执行多个任务

Grunt，Gulp等等都有能力将多个任务合并成一个任务来执行，这对于构建和测试都很有帮助。使用npm你有两种配置来做这些：一个是```pre```或者```post```钩子，这个对于给一个任务做些预先的准备是非常合适的做法（比如在压缩文件之前先进行合并），或者你可以直接用bass命令```&&```，如下所示：

```javascript
"devDependencies": {
  "jshint": "latest",
  "stylus": "latest",
  "browserify": "latest"
},
"scripts": {
  "lint": "jshint **",
  "build:css": "stylus assets/styles/main.styl > dist/main.css",
  "build:js": "browserify assets/scripts/main.js > dist/main.js",
  "build": "npm run build:css && npm run build:js",
  "prebuild:js": "npm run lint"
}
```

在上面的例子中```build```会执行```build:css```和```build:js```，并且不会在```lint```任务前执行。使用这种方式你可以独立地运行```build:css```和```build:js```，而且```build:js```也会在运行前执行```lint```。任务可以被组合而且可以像你所希望的那样串行来执行，而且这种写法兼容所有。

### <a name="npm-script-10"></a>

### 流式处理多个任务

Gulp最大的特点就是从一个任务到另个任务流式地无缝（就是没有任何卡壳，很顺畅）输出。Bash和Windows命令行有管道操作符```|```，它可以将一个命令的输出(```stdout```)流式地传给另一个命令的输入(```stdin```)。让我们看个场景：希望将css中的样式先通过```Autoprefixer```，然后再```CSSMin```，最后输出到一个文件中去(使用```>```操作符，将会把输出的内容保存到一个给定的文件中)：

```javascript
"devDependencies": {
  "autoprefixer": "latest",
  "cssmin": "latest"
},
"scripts": {
  "build:css": "autoprefixer -b 'last 2 versions' < assets/styles/main.css | cssmin > dist/main.css"
}
```

你可以看到```autoprefixer```将会把所有的厂商设置的前缀添加到我们的css中，然后上面的输出用```cssmin```再次输出，最后将输出传递到```dist/main.css```中。大部分优秀的工具都会支持```stdin```和```stdout```，并且上面的代码在Windows、Mac以及Linux都适用。

### <a name="npm-script-11"></a>版本冲突

解决版本冲突是Grunt或Gulp工具中很棒的特点。它通过package.json中的一个东西来增加版本号，这会产生一次git的提交，并且git的tag可以设定版本号详细地描述这次提交。

回到npm中（毕竟它是个包管理器）。只要简单地执行```npm version patch```就可以增加

版本号(比如：1.1.1 -> 1.1.2)，或者1.1.1 -> 1.2.0或者1.1.1 ->2.0.0。这将会提交并标记自己的包，剩余的就是```git push```和```npm publish```了。

这个也完全可以自定义，如果你不想执行```git tag```，只要在执行的时候加上```--git-tag-version=false```参数（或者配置下config```npm config set git-tag-version false```）。希望修改提交的内容？仅仅在执行的时候加上```-m```参数既可以，比如```npm version patch -m "Bumped to %s"```。你也可以给自己标记这些tags，通过执行```--sing-git-tag=true```（或者执行```npm config set sign-git-tag true```）。

### <a name="npm-script-12"></a>清除

很多构建工具都会有清除任务。这个任务经常用来删除掉一堆文件，这样你就可以有个干净的目录来开始构建了。当然Bash本身就有非常好的清除命令：```rm```。通过传递```-r```可以让```rm```也可以删除文件夹。不能再简单了吧：

```javascript
"scripts": {
  "clean": "rm -r dist/*"
}
```

如果你真的希望可以得到Windows的支持，而Windows是不支持```rm```的。幸运的是有rimraf，它是兼容的做同样的事情：

```javascript
"devDependencies": {
  "rimraf": "latest"
},
"scripts": {
  "clean": "rimraf dist"
}
```

### <a name="npm-script-13"></a>编译文件使其拥有唯一的名字

试着去取代gulp-hash和grunt-hash的功能：用hash通过文件的内容来命名，这点在相比其他的命令来说非常复杂，所以我看了下npm是否可以有这个功能，但是它没有。所以我写了个(我仿佛听到了Grunt/Gulp支持者反对的声音)。关于这个我有两点想说的：一是很多插件的作者并没有明确的使用任意构建工具的解决方案，这点让我很失望。二是如果没找到合适的我就自己写个！我的[hashmark](https://github.com/keithamus/hashmark)库和grunt/gulp中的使用是同样的行数，并且根据依赖的插件有更好的特色，它还支持数据流！回到autoprefixer的例子中，我们可以用个指定hash来输出个文件：

```javascript
"devDependencies": {
  "autoprefixer": "latest",
  "cssmin": "latest"
},
"scripts": {
  "build:css": "autoprefixer -b '> 5%' < assets/styles/main.css | cssmin | hashmark -l 8 'dist/main.#.css'"
}
```

现在执行```build:css```将会生产一个命名中有hash的文件，比如：```dist/main.3ecfca12.css```。

### <a name="npm-script-14"></a>实时检测

这点是人们为何使用Grunt/Gulp最重要的原因，并且是在我之前的文章中回复也是最多的。大多数构建工具使用命令来检测文件系统，检测文件的变化然后重新加载服务器、重新编译资源、重新运行测试，这在开发中是非常有用。看起来大多数开发者在回复我的上篇文章的时候，觉得这个并不是Grunt/Gulp的配置选项。

当然大部分的工具都有这个选项，并且对于复杂文件应该去监听。例如Mocha这```-W```选项，而Stylus、Node-sass，Jade、Karma等其它也都有。你可以像下面这样来使用这些选项：

```javascript
"devDependencies": {
  "mocha": "latest",
  "stylus": "latest"
},
"scripts": {
  "test": "mocha test/",
  "test:watch": "npm run test -- -w",

  "css": "stylus assets/styles/main.styl > dist/main.css",
  "css:watch": "npm run css -- -w"
}
```

当然不是所有的工具都支持这个，而且你可能希望合并多个编译的任务为一个，这样当然检测到变化就会执行这个任务了。有很多可以可以检测文件的变化并且当变化时执行一些命令，比如[watch](https://www.npmjs.org/package/watch)、[onchange](https://www.npmjs.org/package/onchange)、[dirwatch](https://www.npmjs.org/package/dirwatch)还有[nodemon](https://github.com/remy/nodemon)：

```javascript
"devDependencies": {
  "stylus": "latest",
  "jade": "latest",
  "browserify": "latest",
  "watch": "latest",
},
"scripts": {
  "build:js": "browserify assets/scripts/main.js > dist/main.js",
  "build:css": "stylus assets/styles/main.styl > dist/main.css",
  "build:html": "jade assets/html/index.jade > dist/index.html",
  "build": "npm run build:js && npm run build:css && npm run build:html",
  "build:watch": "watch 'npm run build' .",
}
```

很容易吧，这13行JSON将会检测我们的整个项目目录，并且当文件变化时会每次去构建HTML，CSS以及JS资源。仅仅执行```npm run build:watch```就可以开发了！你甚至可以再做些优化，使用我写的工具：[Parallelshell](https://www.npmjs.org/package/parallelshell)，使用它在同个时间可以保持多个进程。如下所示：

```javascript
"devDependencies": {
  "stylus": "latest",
  "jade": "latest",
  "browserify": "latest",
  "watch": "latest",
  "parallelshell": "latest"
},
"scripts": {
  "build:js": "browserify assets/scripts/main.js > dist/main.js",
  "watch:js": "watch 'npm run build:js' assets/scripts/",
  "build:css": "stylus assets/styles/main.styl > dist/main.css",
  "watch:css": "watch 'npm run build:css' assets/styles/",
  "build:html": "jade index.jade > dist/index.html",
  "watch:html": "watch 'npm run build:html' assets/html",
  "build": "npm run build:js && npm run build:css && npm run build:html",
  "build:watch": "parallelshell 'npm run watch:js' 'npm run watch:css' 'npm run watch:html'",
}
```

现在你可以通过[Parallelshell](https://www.npmjs.org/package/parallelshell)来运行独立的检测任务了：```npm run build:watch```，这样如果你仅仅修改了css，只有css的任务会重新执行，其次类推。[Parallelshell](https://www.npmjs.org/package/parallelshell)合并了每个任务的输出，并将会监听退出码来确保日志和构建失败的信息（和Bash/Windows的```&```操作符不同）。

### <a name="npm-script-15"></a>实时刷新

实时刷新是另外个流行的特点。如果你并不知道什么是实时刷新：它是命令行的组合和浏览器的扩展（或自定义服务器）。当文件发生变化，LiveReload将会触发你所看的页面刷新而不用自己来手动地刷新。npm包[live-reload](https://www.npmjs.org/package/live-reload)对于这个功能是非常好用的，它可以启动一个服务器来仅仅为js文件服务，你需要将它引入到页面中，当发生变化时页面话会被刷新，如下所示：

```javascript
"devDependencies": {
  "live-reload": "latest",
},
"scripts": {
  "livereload": "live-reload --port 9091 dist/",
}
```

```javascript
<!-- In your HTML file -->
<script src="//localhost:9091"></script>
```

当执行```npm run livereload```，当你执行HTML页面时候它会开始监听livereload服务器。一旦```dist/```发生任何变化，将会通知客户端然后页面就会重载。

### <a name="npm-script-16"></a>运行不是二进制的任务

<t></t>It was pointed out to me that there are libs that don’t come with binaries - such as [favicon](https://www.npmjs.org/package/favicons) - and so Grunt/Gulp plugins can be useful because they wrap the tools so they can be used within the task runners. If you find a package that you want to use, but it doesn’t have a binary then simply write some JavaScript! You would have to if using Grunt or Gulp, so don’t be afraid to just chuck a bit of JavaScript somewhere that wires it all up (or even better, submit a PR to the maintainers convincing them to support a command line interface!):

```javascript
// scripts/favicon.js
var favicons = require('favicons');
var path = require('path');
favicons({
    source: path.resolve('../assets/images/logo.png'),
    dest: path.resolve('../dist/'),
});
```

```javascript
"devDependencies": {
  "favicons": "latest",
},
"scripts": {
  "build:favicon": "node scripts/favicon.js",
}
```

### <a name="npm-script-17"></a>一个相当复杂的配置

在我以往的文章中很多人告诉我说我遗忘了关于任务器的讨论，任务器是为了复杂的任务而设置的，不仅仅是运行任务而已。所以我选了这段复杂的配置而在Gruntfile中需要至少百行代码来实现，下面是任务的目标：

* 将我的JS代码代码检测并通过测试，然后编译它成为一个版本，最后上传它到S3。
* 将Stylus编译成CSS，生成一个带有版本的文件并上传到S3。
* 为测试和编译加入监听任务。
* 添加一个静态文件服务器，这样可以在浏览器中看到我的单页应用
* 添加livereload给CSS和JS
* 有个一个将所有文件合并的的任务，这样我可以仅仅输入一个命令并设置环境变量。
* 附加的特色就是可以自动打开浏览器显示我的网页

我已经打包好了，并上传到Github名叫[npm-scripts-example](https://github.com/keithamus/npm-scripts-example)。这里面包含了一个基本网站的不，一个package.json来响应上面的要求。这些配置如下：

```javascript
"scripts": {
    "clean": "rimraf dist/*",

    "prebuild": "npm run clean -s",
    "build": "npm run build:scripts -s && npm run build:styles -s && npm run build:markup -s",
    "build:scripts": "browserify -d assets/scripts/main.js -p [minifyify --compressPath . --map main.js.map --output dist/main.js.map] | hashmark -n dist/main.js -s -l 8 -m assets.json 'dist/{name}{hash}{ext}'",
    "build:styles": "stylus assets/styles/main.styl -m -o dist/ && hashmark -s -l 8 -m assets.json dist/main.css 'dist/{name}{hash}{ext}'",
    "build:markup": "jade assets/markup/index.jade --obj assets.json -o dist",

    "test": "karma start --singleRun",

    "watch": "parallelshell 'npm run watch:test -s' 'npm run watch:build -s'",
    "watch:test": "karma start",
    "watch:build": "nodemon -q -w assets/ --ext '.' --exec 'npm run build'",

    "open:prod": "opener http://example.com",
    "open:stage": "opener http://staging.example.internal",
    "open:dev": "opener http://localhost:9090",

    "deploy:prod": "s3-cli sync ./dist/ s3://example-com/prod-site/",
    "deploy:stage": "s3-cli sync ./dist/ s3://example-com/stage-site/",

    "serve": "http-server -p 9090 dist/",
    "live-reload": "live-reload --port 9091 dist/",

    "dev": "npm run open:dev -s & parallelshell 'npm run live-reload -s' 'npm run serve -s' 'npm run watch -s'"
  }
```

在Grunt做同样的事情，需要几百行代码，并多出10多个插件。当然哪种看起来更可读是根据个人的主观来判断的，我个人认为npm scripts指令非常容易读。

### <a name="npm-script-18"></a>结论

希望这篇文章展示了如何让能力非凡的npm来作为构建工具。也希望它的出现能让你在下一个工程中并不一定要首选Gulp或者Grunt，这些在你的系统中已经存在的工具更值得去研究。

可以在我的Twitter中来讨论，我是[@keithamus](https://twitter.com/keithamus)，你也可以关注我。