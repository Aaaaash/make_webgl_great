# WebGL tutorial

## Hello WebGL

```javascript
const canvas = document.querySelector('#canvas');

// 获取webgl绘图上下文
const gl = canvas.getContext('webgl') || .getContext("experimental-webgl");

// 清空颜色 分量 颜色值为0-1  rgba颜色值需转换 (255, 255, 255, 255) 等价于 (1.0,1.0,1.0,1.0)
gl.clearColor(0.0,0.0,0.0,1.0);
// 可以调用 gl.getParameter(gl.COLOR_CLEAR_VALUE) 获取当前指定清空的颜色
// 清空颜色缓冲区
/*
 * gl.DEPTH_BUFFER_BIT  深度缓冲区
 * gl.STENCIL_BUFFER_BIT 模板缓冲区
*/
gl.clear(gl.COLOR_BUFFER_BIT);
```

## 画一个点
```javascript
// 顶点着色器
/**
 * 描述顶点特性，位置、颜色等的程序
 * 顶点是指二维或三维空间中的一个点，比如二维或三维图形的端点或交点
 */
const VSHADER_SOURCE = `
  void main() {
    // vec4 表示4个浮点数组成的矢量
    gl_Position = vec4(0.0,0.0,0.0,1.0); // 设置坐标
    gl_PointSize = 10.0;  // 设置尺寸
  }
`;

// 片元着色器 GLSL ES语言
/**
 * 进行逐片元处理过程的程序
 * 可以理解为像素， 图像的单元
 */
const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0,0.0,0.0,1.0); // 设置颜色
  }
`;

// 初始化webgl GLSL ES语言
const gl = getWebGLContext(canvas, true);
if (!gl) {
  return;
}

// 初始化着色器程序
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  return;
}

// 清空画布背景
gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// 绘制图形
gl.drawArrays(gl.POINT, 0, 1);
```

## 坐标系
WebGL使用三维坐标系（笛卡尔坐标系），X轴正方向为右边，Y轴正方向为上，Z轴正方向为外（屏幕外）也叫右手坐标系
![做右手坐标系](https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1514354164&di=1511f18361094dad5b6183aef1d6e448&src=http://static.oschina.net/uploads/space/2014/1219/150629_NFJt_1443646.jpg)

## 向顶点着色器变量传值
```javascript
// 使用attribute变量从外部向顶点着色器内传输数据
const VSHADER_SOURCE = `
  // 接受vec4类型的attribute变量
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main() {
    // 将a_Position值赋值给gl_Position 设置顶点坐标
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
  }
`;

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(0.0,1.0,0.0,1); // 设置颜色
  }
`;


function main() {
  const canvas = document.querySelector('#canvas');

  const gl = getWebGLContext(canvas, true);
  if (!gl) {
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return;
  }
  /**
   * 获取a_Position变量的存储位置
   * getAttribLocation方法用于获取指定变量在着色器程序中的存储位置
   */
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

  // 获取a_PointSize变量的存储位置
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

  if (a_Position < 0) {
    return;
  }
  
  /**
   * 将顶点位置传递给a_Position 会在着色器程序中被接收
   * vertexAttrib3f方法指定通用顶点属性的值
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttrib
   * 属性值为向量，表示顶点坐标，方法名vertexAttrib3f表示可以传递3个浮点型的分量值
   * 同族函数中还有vertexAttrib1f以及vertexAttrib2f
   * 以及vertexAttrib2fv系列函数，是上述方法的矢量版本，名字多了个字母v，接受类型化数组
   * vertexAttrib1fv系列函数表示接受一个或多个浮点型分量组成的Float32Array类型的数组
   * 也可以使用vertexAttrib3fv方法
   * const floatArray = new Float32Array([0.0,0.0,0.0]);
   * gl.vertexAttrib3fv(a_Position, floatArray);
   */
  const floatArray = new Float32Array([0.5,0.0,0.0]);
  const pointSize = 30.0;
  // 使用vertexAttrib1f方法将pointSize传递给顶点着色器内的a_PointSize变量
  gl.vertexAttrib1f(a_PointSize, pointSize);
  gl.vertexAttrib3fv(a_Position, floatArray);
  // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINT, 0, 1);
}
```

## 向片元着色器变量传值
attribute只能传递给顶点着色器
向片元着色器传值需要使用`uniform`变量
```GLSL
precision mediump float; // 设置精度
// 表示接受vec4类型的uniform变量
uniform vec4 u_FragColor;
void main() {
  gl_FragColor = u_FragColor; // 设置颜色
}
```
获取uniform变量的存储位置需要使用`getUniformLocation`函数
```javascript
// 获取u_FragColor变量的存储位置
const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
```
向uniform变量赋值需要使用`uniform[1234]f[v]`系列函数，参数与用法和`vertexAttrib[1234]f[v]`很相似
```javascript
const colors = new Float32Array([color[0], color[1], color[2], color[3]]);
gl.uniform4fv(u_FragColor, colors);
```

## 缓冲区对象
缓冲区对象是webgl系统中的一块内存区域，可以一次性的向缓冲区对象中填充大量的顶点数据，将数据保存在其中以供顶点着色器使用
![buffer](https://raw.githubusercontent.com/SakuraAsh/make_webgl_great/1e57d78a4b5513da585b7749fee5553d0a834b7b/images/buffer.png)

使用缓冲区对象向顶点着色器传入多个顶点的数据，需要遵循以下5个步骤

* 创建缓冲区对象(gl.createBuffer())
* 绑定缓冲区对象(gl.bindBuffer())
* 将数据写入缓冲区对象(gl.bufferData())
* 将缓冲区对象分配给一个attribute变量(gl.vertexAttribPointer)
* 开启attribute变量(gl.enableVertexAttribArray)

```javascript
const vertices = new Float32Array([
  0.0, 0.5, -0.5, -0.5, 0.5, -0.5
]);

const n = 3;

const vertexBuffer = gl.createBuffer();
if (!vertexBuffer) {
  return -1;
}
/**
 * 将缓冲区对象绑定到目标
 * bindBuffer函数 第一个参数为绑定的目标 第二个参数为绑定的缓冲区对象
 * ARRAY_BUFFER为目标
 */
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  /**
   * 向缓冲区对象中写入数据
   * bufferData函数 第一个对象同为绑定的目标 第二个参数为绑定的数据
   */
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
// 分配缓冲区对象给变量
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
// 连接a_Position变量与分配给它的缓冲区对象
gl.enableVertexAttribArray(a_Position);
```

### 类型化数组
> 为了绘制图形，WebGL通常需要同时处理大量相同类型的数据，例如顶点坐标和颜色数据。为了优化性能，WebGL为美中基本数据类型引入了一种特殊的数据（类型化数组），由于浏览器事先知道数组中的数据类型，所以处理起来也更加有效率

Float32Array就是一种类型化数组，常用来存储顶点坐标或颜色数据，WebGL中很多操作都需要用到类型化数组，比如gl.bufferData中的第二个参数data

数组类型|每个元素所占字节数|描述（C语言中的数据类型）
----|---------|-------------
Int8Array|1|8位整型数
UInt8Array|1|8位无符号整型数
Int16Array|2|16位整型数
UInt16Array|2|16位无符号整型数
Int32Array|4|32位整型数
UInt32Array|4|32位无符号整型数
Float32Array|4|单精度32位浮点数
Float64Array|8|双精度64位浮点数

> 类型化数组不支持push()和pop()方法

## 绘制三角形
将绘制三个点的代码中`gl.drawArrays(gl.POINT, 0, 3);`修改为`gl.drawArrays(gl.TRIANGLES, 0, 3);`

相当于告诉WebGL，从缓冲区的第一个顶点开始，使顶点着色器执行3次，用这3个点绘制出一个三角形
![dl.drawArrays](https://github.com/SakuraAsh/make_webgl_great/blob/97027d0604f5c737318363ad968f1418827dac69/images/drawarrays.png?raw=true)

> 从球体到立方体，再到游戏中的三维角色，都可以用小的三角形组成，可以使用这些最基本的图形来绘制出任何东西

## 绘制矩形

```javascript
// 将绘制三角形代码中的`drawArray`修改为
gl.drawArrays(gl.TRIANGLE_FAN, 0, n);

// 顶点数据修改为
const vertices = new Float32Array([
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
]);
```
表示绘制一个三角带，实际上矩形由两个三角形构成
