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
