# Webpack的介绍

通过我翻译的一篇文章来详细介绍下Webpack吧。

原文:

* [part1](https://code.tutsplus.com/tutorials/introduction-to-webpack-part-1--cms-25791)
* [part2](https://code.tutsplus.com/tutorials/introduction-to-webpack-part-2--cms-25911)

## Webpack的介绍：第一部分

当创建web应用时通过一系列构建的过程可以帮助执行开发的任务并可以让你的文件都处于一个实时的环境中，这种做法已经是业界标准的了。

你可能用过Grunt或者Gulp来做这些，通过构建链式的转换可以让原始的代码编程压缩好的css和js或者其它。

这些工具非常流行并且使用。然后有另外一个方式来做这些，这就是Webpack。

### Webpack是什么

Webpack作为一个模块打包工具而被人熟知。它可以让js模块的依赖更清晰，并且通过最有效的方式将他们合并然后最终打包成一个文件。没什么特别，是么？这就像RequireJS这些年一直在做的事情。

当然这扭曲了Webpack的意义。通过Webpack，模块不仅仅只针对js文件。使用加载器，Webpack可以理解js模块可能需要个css文件，并且这个css文件需要一张图片。最后打包的文件将会最小限度的准确地包含所需要的。让我们动手搭建看看吧。

### 安装

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

### 配置

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

### 开发服务器

这个又是个啥？每次修改文件的时候你都需要输入webpack难道你不觉得很烦么？今天这个时代我。。。好吧让我们搭建个小型的开发服务器，让开发更有效率吧。在控制台下输入：

```javascript
npm install webpack-dev-server -g
```

然后执行```webpack-dev-server```这个命令。它将会开启一个简单的web服务器，并在当前目录来作为服务的对象。打开浏览器然后访问[http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/)。如果一切顺利的话，你将会看到下面的文字：

![alt](https://cms-assets.tutsplus.com/uploads/users/831/posts/25791/image/guybrush.jpg)

现在我们不仅有了小型的web服务器，它还可以实时观察我们代码的变化。如果我们修改一个文件，它将会自动地执行webpack命令去打包我们的代码并且刷新页面而无需我们做任何事。所有的这一切都是0配置，很简单。

亲自试下吧，修改传入```sayHello```函数的name，然后切换到浏览器看看你的改变是否立即生效了。

### 加载器

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

### 第二部分

这个教程的第二部分，我们将用Webpack去添加css以及images到我们的页面中，同时保证网站已经在开发状态。

## Webpack的介绍：第一部分







