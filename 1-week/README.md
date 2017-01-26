# 为什么学requirejs

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

而requirejs可以解决这个头大的问题，所以开始它的学习吧！

# requirejs的介绍

# requirejs的使用

