# 简单的例子

在这个例子中我们地使用webpack将```index.js```打包成```bundle.js```。

首先全局安装下webpack：

```javascript
npm install webpack -g
```

这样我就可以在任何目录使用webpack命令了。

进入到Terminal并到当前目录下输入以下命令（需要输入和输出）：

```javascript
webpack index.js bundle.js
```

打开index.html你会发现在控制台下打印出了“123”。