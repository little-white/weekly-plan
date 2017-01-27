# 为什么学RequireJS

例子是最好的说明:

```javascript
<script src="frameworkA.js"></script>
<script src="moduleA.js"></script>
<script src="moduleB.js"></script>
<script src="moduleC.js"></script>//deps:moduleA,moduleB
<script src="moduleD.js"></script>//deps:frameworkA,moduleB
```

从上面的代码中我们可以得出以下几个结论:

* frameworkA.js->moduleA.js->moduleB.js->moduleC.js->moduleD.js是顺序（同步）加载的
* moduleC模块依赖moduleA和moduleB模块
* moduleD模块依赖frameworkA框架和moduleB模块

这一切看起来都没什么，因为这只是个小demo。但如果试想下，当我们的代码量非常大并且多人协作开发的时候，很难在调用某一个模块的时候，能准确地把它对应的依赖也加进来。所以保证一个正确的依赖顺序在一个大的工程中尤其重要。

> 注意：顺序加载多个js文件带来的性能问题暂且不考虑，因为可以用压缩合并方式来优化。

而RequireJS可以解决这个头大的问题，所以开始它的学习吧！

# RequireJS的介绍

通过我翻译的一篇文章来详细介绍下RequireJS吧。

原文点[这里](https://www.sitepoint.com/understanding-RequireJS-for-effective-javascript-module-loading/)

### 目录

[对于RequireJS使得js模块有效加载的理解](#requirejs-1)

[加载js文件](#requirejs-2)

[什么出错了？](#requirejs-3)

[介绍RequireJS](#requirejs-4)

[使用RequireJS来创建应用](#requirejs-5)

[使用`require()`还是`define()`](#requirejs-6)

[为何RequireJS如此重要](#requirejs-7)

[管理依赖文件的顺序](#requirejs-8)

[总结](#requirejs-9)

### <a name="requirejs-1"></a>对于RequireJS使得js模块有效加载的理解

模块化编程常常用来把大的应用程序拆解成若干个更小的并且可管理的代码。基于模块化的编码可以让可管理的并且增加重用性的代码变得容易起来。然而随着应用程序的开发，如何管理模块之间的依赖是开发者很关心的问题。RequireJS是管理模块之间依赖的最流行框架之一。这个教程讲述了模块化代码的需求，以及如何通过RequireJS来解决。

### <a name="requirejs-2"></a>加载js文件

大型应用常常需要大量的javascript文件。通常情况它们是使用script标签一个接一个的加载。然后每个文件会潜在地依赖其它的文件。最常见的例子就是jquery插件，它们都依赖jquery库。因此，jquery必须在其它的jquery插件前加载。让我们看下存在于真实应用中的一个简单的例子。假设我们有下面三个文件。

`purchase.js`

```javascript
function purchaseProduct(){
  console.log("Function : purchaseProduct");

  var credits = getCredits();
  if(credits > 0){
    reserveProduct();
    return true;
  }
  return false;
}
```

`products.js`

```javascript
function reserveProduct(){
  console.log("Function : reserveProduct");

  return true;
}
```

`credits.js`

```javascript
function getCredits(){
  console.log("Function : getCredits");

  var credits = "100";
  return credits;
}
```

在这个例子中，我们试图给一个产品结账。首先它检查了是否有足够的信用来支付这个产品。之后通过信用的验证，它储备了这个产品。另外个js脚本，main.js，通过调用`purchaseProduct()`来进行初始化。具体可看下面：

```javascript
var result = purchaseProduct();
```

### <a name="requirejs-3"></a>什么出错了？

在这个例子中，`purchase.js`同时依赖`credits.js`和`products.js`。因此这些文件应该在调用`purchaseProduct()`之前就得加载好。所以当我们以下面的顺序来调用的时候会发生什么呢？

```javascript
<script src="products.js"></script>
<script src="purchase.js"></script>
<script src="main.js"></script>
<script src="credits.js"></script>
```

可以看出初始化在`credits.js`加载前完成。这将会导致下面所示的错误。并且这个例子中仅仅引用了三个js文件。在更大的项目中，事情会变得无法控制。所以RequireJS出现了。

![出错信息](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2012/12/requirejs-01.png)

### <a name="requirejs-4"></a>介绍RequireJS

RequireJS是知名的js模块和文件加载器，并且它支持流行的浏览器的最新版本。使用RequireJS我们会拆分代码使其具有单一职责的模块。另外，依赖需要在加载文件的时候配置好。让我们从下载RequireJS开始。一旦下载完毕，拷贝这个文件到你的工程目录中。假设我们的工程目录结构如下图所示。

![目录结构](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2013/01/requirejs021.png)

所有js文件包括RequireJS都放到scripts文件夹中。mian.js用来初始化，其它的文件包含应用的逻辑。让我们看看这些脚本是如何包含在html文件中的。

```javascript
<script data-main="scripts/main" src="scripts/require.js"></script>
```

这是使用RequireJS包含这些文件仅有的代码。你可能想知道其它的文件发生了什么并且他们是如何包含进来的。这个data-main属性定义了此应用的初始化入口。在这个例子中它是main.js。RequireJS通过main.js去寻找其它的脚本以及依赖。在这个场景中所有的文件都存放在同一个目录中。通过配置，你可以移动这些文件到任何你希望的目录中。现在让我们看一看main.js吧。

```javascript
require(["purchase"],function(purchase){
  purchase.purchaseProduct();
});
```

在RequireJS中，所有的代码都使用require()或者define()包裹。这些函数的第一个参数指定了需要的依赖。在前面的例子中，初始化的代码依赖`purchase.js`，因为它定义了`purchaseProduct()`。需要注意的是文件的扩展名被忽略了。这是因为RequireJS仅仅对.js文件生效。

上面的例子中require的第二个参数是一个匿名函数，它获取一个用来调用依赖文件中的方法的对象。在这个场景中，我们仅依赖了一个模块。多个模块的依赖使用下面的语法。

```javascript
require(["a","b","c"],function(a,b,c){
});
```

### <a name="requirejs-5"></a>使用RequireJS来创建应用

在这个部分我们将之前的例子转化为使用RequireJS来实现。我们已经写好了main.js，让我们转向其它文件的实现。

`purchase.js`

```javascript
define(["credits","products"], function(credits,products) {

  console.log("Function : purchaseProduct");

  return {
    purchaseProduct: function() {

      var credit = credits.getCredits();
      if(credit > 0){
        products.reserveProduct();
        return true;
      }
      return false;
    }
  }
});
```

首先我们声明了依赖于credits和products的purchase。在这个`return`语句中，我们可以定义每一个模块的函数体。在这里我们调用了`getCredits()`和`reserveProduct()`函数。`product.js`和`credits.js`也类似，并且会在下面展示。

`products.js`

```javascript
define(function(products) {
  return {
    reserveProduct: function() {
      console.log("Function : reserveProduct");

      return true;
    }
  }
});
```

`credits.js`

```javascript
define(function() {
  console.log("Function : getCredits");

  return {
    getCredits: function() {
      var credits = "100";
      return credits;
    }
  }
});
```

这两个文件都是作为独立的模块和来配置的—意味着他们不会依赖其它模块。需要注意的是使用了`define()`来替代了`require()`。选择`require()`还是`define()`取决于你的代码结构，将会在下面的部分来继续探讨。

### <a name="requirejs-6"></a>使用`require()`还是`define()`

早先的时候我提到了我们既可以用`require()`也可以使用`define()`来加载依赖。理解它们的不同对于管理依赖是必备的。`require()`用来直接运行，而`define()`用来定义那些模块来用在不同的地方。在我们的例子中需要立即执行`purchaseProduct()`。所以在main.js中使用`require()`。然后其它的文件是可重用的模块，所以使用`define()`.

### <a name="requirejs-7"></a>为何RequireJS如此重要

在前面原生js的例子中，由于错误的文件加载顺序导致出现了错误。现在在这个使用RequireJS的例子中我们删除了`credits.js`然后看看它是如何工作的。下面的图片展示了通过浏览器检查工具显示的输出。

![alt](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2012/12/requirejs-03.png)

不同的是在RequireJS的例子中并没有任何执行的代码，这点我们可以在控制台很确认地看到。在原生js的例子中我们通过控制台看到了在错误出现的前面有一部分输出了。RequireJS需要所有依赖的模块都被加载后才可以执行代码。如果任何模块丢失了，它不会执行任何的代码。这点可以帮助我们保持数据的一致性。

### <a name="requirejs-8"></a>管理依赖文件的顺序

RequireJS使用异步模块加载(AMD)来加载文件。每个依赖的模块将会通过给定的顺序来异步的加载。即使文件的顺序已经确定了，由于异步的特点我们并不能保证第一个文件会在第二个文件之前加载。所以RequireJS允许我们通过`shim`的配置来定义这些文件的加载是在正确的顺序下的。让我们看看在如何RequireJS来配置。

```javascript
requirejs.config({
  shim: {
    'source1': ['dependency1','dependency2'],
    'source2': ['source1']
  }
});
```

RequireJS允许我们通过config来配置。使用`shim`用来强制地保证依赖的加载得顺序。你可以在[RequireJS的API文档中](http://requirejs.org/docs/api.html#config)找到完整的配置说明。

```javascript
define(["dependency1","dependency2","source1","source2"], function() {

);
```

正常情况下这四个文件会按照给定的顺序来加载。可以看到`source2`依赖`source1`。所以一旦`source1`加载完毕，`source2`将会认为所有的依赖已经加载好了。然而`dependency1`和`dependency2`仍然在加载中。使用shim来配置，它会在`source1`之前强制加载这些依赖。因此错误将不会产生。

### <a name="requirejs-9"></a>总结

我希望这个教程帮助你开始RequireJS的学习。尽管它看起来很简单，但它在大的js应用中有有力地管理好依赖。这个教程当然不足以包含的RequireJS的各个方面，所以我希望你可以通过官网来学习所有高级的配置以及技术。

如果你喜欢这篇文章，你将会爱上[Learnable](https://learnable.com/?utm_source=sitepoint&utm_medium=link&utm_campaign=learnablelink&_ga=1.239416643.173663835.1484572187)：这个地方可以从浅入深地学习新的技能和技术。里面的成员可以进入SitePoint's的电子书还有互动的在线课程，比如[Simply JavaScript](https://learnable.com/books/simply-javascript?utm_source=sitepoint&utm_medium=link&utm_campaign=learnablelink&_ga=1.238967104.173663835.1484572187)。

这个文章的评论已经关闭了，有关于js的任何疑问可以访问[forums](http://www.sitepoint.com/forums/forumdisplay.php?15-JavaScript-amp-jQuery?utm_source=sitepoint&utm_medium=link&utm_campaign=forumlink)。







# RequireJS的使用