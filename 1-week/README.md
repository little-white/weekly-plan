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

## 对于RequireJS使得js模块有效加载的理解

模块化编程常常用来把大的应用程序拆解成若干个更小的并且可管理的代码。基于模块化的编码可以让可管理的并且增加重用性的代码变得容易起来。然而随着应用程序的开发，如何管理模块之间的依赖是开发者很关心的问题。RequireJS是管理模块之间依赖的最流行框架之一。这个教程讲述了模块化代码的需求，以及如何通过RequireJS来解决。

### 加载js文件

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

### 什么出错了？

在这个例子中，`purchase.js`同时依赖`credits.js`和`products.js`。因此这些文件应该在调用`purchaseProduct()`之前就得加载好。所以当我们以下面的顺序来调用的时候会发生什么呢？

```javascript
<script src="products.js"></script>
<script src="purchase.js"></script>
<script src="main.js"></script>
<script src="credits.js"></script>
```

可以看出初始化在`credits.js`加载前完成。这将会导致下面所示的错误。并且这个例子中仅仅引用了三个js文件。在更大的项目中，事情会变得无法控制。所以RequireJS出现了。

![出错信息](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2012/12/requirejs-01.png)

### 介绍RequireJS

RequireJS是知名的js模块和文件加载器，并且它支持流行的浏览器的最新版本。使用RequireJS我们会拆分代码使其具有单一职责的模块。另外，依赖需要在加载文件的时候配置好。让我们从下载RequireJS开始。一旦下载完毕，拷贝这个文件到你的工程目录中。假设我们的工程目录结构如下图所示。

![目录结构](https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2013/01/requirejs021.png)





# RequireJS的使用