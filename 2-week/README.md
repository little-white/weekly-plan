# Webpack的介绍

通过我翻译的一篇文章来详细介绍下Webpack吧。

原文:

* [part1](https://code.tutsplus.com/tutorials/introduction-to-webpack-part-1--cms-25791)
* [part2](https://code.tutsplus.com/tutorials/introduction-to-webpack-part-2--cms-25911)

目录：

* [Webpack的介绍：第一部分](#webpack-1)
  * [Webpack是什么](#webpack-1-1)
  * [安装](#webpack-1-2)
  * [配置](#webpack-1-3)
  * [开发服务器](#webpack-1-4)
  * [加载器](#webpack-1-5)
  * [第二部分](#webpack-1-6)
* [Webpack的介绍：第二部分](#webpack-2)
  * [样式加载器](#webpack-2-1)
  * [使用Sass](#webpack-2-2)
  * [图片](#webpack-2-3)
  * [预加载器](#webpack-2-4)
  * [生产环境的准备](#webpack-2-5)
  * [结论](#webpack-2-6)

## <a name="webpack-1"></a>Webpack的介绍：第一部分

当创建web应用时通过一系列构建的过程可以帮助执行开发的任务并可以让你的文件都处于一个实时的环境中，这种做法已经是业界标准的了。

你可能用过Grunt或者Gulp来做这些，通过构建链式的转换可以让原始的代码编程压缩好的css和js或者其它。

这些工具非常流行并且使用。然后有另外一个方式来做这些，这就是Webpack。

### <a name="webpack-1-1"></a>Webpack是什么

Webpack作为一个模块打包工具而被人熟知。它可以让js模块的依赖更清晰，并且通过最有效的方式将他们合并然后最终打包成一个文件。没什么特别，是么？这就像RequireJS这些年一直在做的事情。

当然这扭曲了Webpack的意义。通过Webpack，模块不仅仅只针对js文件。使用加载器，Webpack可以理解js模块可能需要个css文件，并且这个css文件需要一张图片。最后打包的文件将会最小限度的准确地包含所需要的。让我们动手搭建看看吧。

### <a name="webpack-1-2"></a>安装

开始之前，大部分的开发工具都是需要安装Nodejs的。假设你已经正确地安装完了，你所需要的仅仅就是输入下面的命令：

```javascript
npm install webpack -g
```

这将会安装Webpack并且你可以在系统的任何地方去执行它。下一步，新建个目录并在其中创建个最基本的HTML文件，像下面这样：

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack fun</title>
  </head>
  <body>
    <h2></h2>
    <script src="bundle.js"></script>
  </body>
</html>
```

最重要的部分就是```bundle.js```，这个就是Webpack将给我们做的事情。同样也注意下H2元素，我们之后将会用到。

下一步，在和HTML文件同级的目录下创建两个文件。第一个叫做```main.js```，可以想象成是我们的入口脚本，第二个叫做```say-hello.js```。这仅仅是个很简单的模块，它可以操作一个人的名字和DOM元素，并在H2元素插入欢迎语句。

```javascript
// say-hello.js
module.exports = function (name, element) {
    element.textContent = 'Hello ' + name + '!';
};
```

这样我就有了一个简单的模块，我们可以在```mian.js```引入进来并调用它。如此简单：

```javascript
var sayHello = require('./say-hello');
 
sayHello('Guybrush', document.querySelector('h2'));
```

现在如果我们打开HTML文件的话，欢迎的语句显然并没有出现，因为我们没有保护```main.js```文件也没有编译好浏览器所需要的依赖。我们需要做的是让Webpack看看```main.js```是否有任何依赖，如果有的话就一起编译并生成一个```bundle.js```文件，这样我们可以在浏览器中使用了。

切换到控制台去执行Webpack：

```javascript
webpack main.js bundle.js
```

第一个文件是入口文件，这样Webpack可以找寻所有的依赖。直到所有的依赖都依赖完毕后，它会输出```bundle.js```。如果你按回车，可以看到类似下面的结果：

```javascript
Hash: 3d7d7339a68244b03c68
Version: webpack 1.12.12
Time: 55ms
    Asset     Size  Chunks             Chunk Names
bundle.js  1.65 kB       0  [emitted]  main
   [0] ./main.js 90 bytes {0} [built]
   [1] ./say-hello.js 94 bytes {0} [built]
```

现在我们在打开```index.html```，可以看到页面显示了欢迎的语句。

### <a name="webpack-1-3"></a>配置

如果每次跑Webpack都得指明输入和输出是件不爽的事情。幸运的是Webpack允许我们通过一个配置文件来解决这个头疼的问题。创建一个叫做```webpack.config.js```的文件到你项目的根目录中，如下所示：

```javascript
module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js'
    }
};
```

现在我们只要输入webpack就可以得到跟上面一样的结果。

### <a name="webpack-1-4"></a>开发服务器

这个又是个啥？每次修改文件的时候你都需要输入webpack难道你不觉得很烦么？今天这个时代我。。。好吧让我们搭建个小型的开发服务器，让开发更有效率吧。在控制台下输入：

```javascript
npm install webpack-dev-server -g
```

然后执行```webpack-dev-server```这个命令。它将会开启一个简单的web服务器，并在当前目录来作为服务的对象。打开浏览器然后访问[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)。如果一切顺利的话，你将会看到下面的文字：

![alt](https://cms-assets.tutsplus.com/uploads/users/831/posts/25791/image/guybrush.jpg)

现在我们不仅有了小型的web服务器，它还可以实时观察我们代码的变化。如果我们修改一个文件，它将会自动地执行webpack命令去打包我们的代码并且刷新页面而无需我们做任何事。所有的这一切都是0配置，很简单。

亲自试下吧，修改传入```sayHello```函数的name，然后切换到浏览器看看你的改变是否立即生效了。

### <a name="webpack-1-5"></a>加载器

Webpack最重要的特点之一就是加载器。加载器和Grunt、Gulp中的tasks类似。它可以将包含的文件通过某种方式转换成打包后的代码。

就好比我们希望在代码中用一些ES2015的语法。ES2015是js的一个版本，它目前还并不能支持所有的浏览器，所以我们需要用一个加载器去将ES2015的代码转换为浏览器支持的原生的ES5的代码。为了做这件事，我们用这个流行的Babel Loader，通过下面的方式来安装：

```javascript
npm install babel-loader babel-core babel-preset-es2015 --save-dev
```

这个不仅仅安装了加载器本身，并且安装了所需的依赖以及预设为Babel，这样就知道正在转换的是何种类型的js。

现在加载器已经安装了，我们仅仅告诉Babel来使用它。更新```webpack.config.js```如下：

```javascript
module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ],
    }
};
```

还有一些重要的东西需要注意。首先是```test: /\.js$/```，它作为正则表达式告诉我们这个加载器需要对后缀是.js的文件起作用。同样```exclude: /node_modules/```告诉Webpack忽略```node_modules```目录。```loader```和```query```从名字就可以看出来了：通过Babel加载器配合ES2015的预设。

通过```ctrl+c```重启你的web服务器，并再次执行```webpack-dev-server```。我们需要做的是使用ES6的代码来测试转换是否成功。如果我们修改```sayHello```为一个常亮呢？

```javascript
const sayHello = require('./say-hello')
```

执行完毕后Webpack应该已经自动地重新编译了你的代码并且刷新了浏览器。视觉上你不会看到有任何变化，但进入到```bundle.js```中你会发现```const```关键字。如果Webpack和Babel完成了他们的任务，代码变成了原生的js。

### <a name="webpack-1-6"></a>第二部分

这个教程的第二部分，我们将用Webpack去添加css以及images到我们的页面中，同时保证网站已经在开发状态。

## <a name="webpack-2"></a>Webpack的介绍：第二部分

在前面的教程中我们掌握了如何搭建一个Webpack工程以及如何通过加载器来处理我们的js代码。然而让Webpack真正发光的地方在于它可以打包其它的静态资源，比如css和images以及其它包含进来的资源。让我加一些样式到页面中。

### <a name="webpack-2-1"></a>样式加载器

首先在样式目录中创建一个普通的css文件，命名为```mian.css```并添加个头部样式。

```css
h2 {
    background: blue;
    color: yellow;
}
```

那我们如何把样式放到页面中呢？像Webpack做的大部分事情类似，我们需要添加另外个加载器。实际上是两个：```css-loader```和```style-loader```。一个可以从css文件中读取样式，另外一个是把样式插入到HTML页面中，安装他们如下所示：

```javascript
npm install style-loader css-loader
```

下一步我们将告诉Webpack如何使用它。在```webpack.config.js中，我们需要添加另一个对象到加载器数组中。在这里我们添加了test来匹配css文件，并且指明了我们用的哪个加载。

很有趣的代码片段在```‘style!css'```这一行。加载器是从右向左读取的，也就是说这告诉了Webpack先要读取文件后缀是```.css```的样式，然后将他们注入到我们的页面中。

因为我们已经更新了配置文件，我们需要重启开发服务器来保证我们的修改生效。使用```ctrl+c```来停止服务器，然后输入```webpack-dev-server```重启。

我们所需要做的事情仅仅就是在```main.js```中把样式引入进来。具体做法跟我们进入其它js模块是一样的。

```javascript
const sayHello = require('./say-hello');
 
require('./styles/main.css');
 
sayHello('Guybrush', document.querySelector('h2'));
```

现在我们并没有动```index.html```，打开浏览器看看```h2```的样式。改变一下头部的样式会立刻看到更新的效果，👍。

### <a name="webpack-2-2"></a>使用Sass

“现在已经没人使用css了，都在用Sass”。这是当然的。幸运的是Webpack有个加载器就是做这件事的。使用Sass的node版本安装：

```javascript
npm install sass-loader node-sass
```

```webpack.config.js```更新如下：

```javascript
{
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: 'style!css!sass'
}
```

这样就是说任何后缀为.scss的文件都会转换为原生的css，然后从css中读取样式并注入到页面中。要记得修改```mian.css```为```main.scss``，并将引入的名字也替换了。开始写些Sass：

```css
$background: blue;
 
h2 {
    background: $background;
    color: yellow;
}
```

在main.js引入进来：

```javascript
require('./styles/main.scss');
```

### <a name="webpack-2-3"></a>图片

“我猜也有图片的加载器是么？”当然了，使用images，我们要用到[url-loader](https://www.npmjs.com/package/url-loader)。这个加载器操作图片的相对路径并更新它们，这样就可以正确地包含在打包文件中了，像之前的方式安装：

```javascript
npm install url-loader
```

现在让我们在```webpack.config.js```中试试不同的东西。按通常的方式添加另外一个实体到加载器的数组中，但是这次我们想让正则来匹配不同的后缀名：

```javascript
{
    test: /\.(jpg|png|gif)$/,
    include: /images/,
    loader: 'url'
}
```

注意这个不同的地方，我们并没有用到```exclude```这个关键字，而使用的是```include```。这高效地告诉Webpack去忽略“images”目录中没有匹配上的任何文件。

```javascript
var imgElement = document.createElement('img');
 
imgElement.src = require('./images/my-image.jpg');
 
document.body.appendChild(imgElement);
```

切换到浏览器看看图片出来没。

### <a name="webpack-2-4"></a>预加载器

另外个任务会在开发过程中执行，叫做linting。它提供了一种可以坚持我们代码中潜藏的错误的方式，并验证你是否遵循了代码规范。比如“没有定义变量我们是否可以使用它呢”或者“我们是否在一行的最后面忘记了分号呢？”。通过强制采用这些规则，在早期我们就可以规避下bug。

一个用来linting的工具叫做[JSHint](http://jshint.com/)。它会查看我们的代码并且高亮出代码潜在的错误。JSHint可以通过命令行来跑起来，但这在开发阶段看起来像个家务事很繁琐。并且理想状态我们希望在每次保存文件的时候自动去执行。我们的Webpack服务器已经可以检查代码的变化了，所以你猜对了：另外个加载器

安装[jshint-loader]([jshint-loader](https://www.npmjs.com/package/jshint-loader))：

```javascript
npm install jshint-loader
```

我们需要再次告诉Webpack通过添加到```webpack.config.js```中来使用它。然后这个加载器有一些不同。它实际上不是转换代码，仅仅是看看。我们也不希望仅仅因为忘记了个分号重新来执行已经很繁重的代码了。这就是预加载器的由来，它可以在我们的主任务前执行，跟其他的加载器类似的方式把它添加到```webpack.conf.js```。

```javascript
module: {
    preLoaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'jshint'
        }
    ],
    loaders: [
       ...    
    ]
}
```

现在linting的进程已经跑起来了，如果检测到错误它会立即报错。在我们重启web服务器前，我们需要告诉JSHint我们正在使用ES6，否则它看到我们使用了```const```关键字会失败。

在配置后，添加一个另外叫做“jshint”的入口，它指明了js的版本。

```javascript
module: {
    preLoaders: [
        ...
    ],
    loaders: [
        ...    
    ]
},
jshint: {
    esversion: 6
}
```

保存好配置文件后重启启动```webpack-dev-server```。跑起来了吧？非常好。这就意味着你的代码没有任何错误。让我们去掉下面这行的分号：

```javascript
var imgElement = document.createElement('img')
```

保存后我们到控制台下可以看到：

```javascript
WARNING in ./main.js
jshint results in errors
  Missing semicolon. @ line 7 char 47
```

非常感谢JSHint！

### <a name="webpack-2-5"></a>生产环境的准备

现在我们很开心的是代码已经成形了并且可以做任何我们想做的事情，我们需要在一个真实的世界来使用它。最常见的一件事就是把我们的代码压缩合并成一个尽可能小的文件。在我们继续执行，我们看看当前的```bundle.js```。它是可读的，有大量的空格，并且有32kb的大小。

“等等，不要告诉我还需要另外个加载器！是么？“当然不了！罕见的是我们不需要加载器了。Webpack已经包含了内置的压缩工具。仅仅执行下面这条命令：

```javascript
webpack -p
```

这个```-p```告诉Webpack要为生产环境做准备了。因为它会打包并且尽可能地优化。在执行完这个命令后，打开```bundle.js```我们可以看到所有的代码都已经压缩了，并且体积很小仅仅有10kb了。

### <a name="webpack-2-6"></a>结论

我希望这两部分的教程可以给你足够的自信在项目中是用Webpack。要记住如果有一些需要构建的事情，Webpack基本都会有个加载器来做这个。所有的加载器通过npm来安装，我们可以查看是否你需要的别人已经制作好了。

玩得开心！









