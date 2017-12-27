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