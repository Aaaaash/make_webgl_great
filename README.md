# WebGL tutorial

## Hello WebGL

```javascript
const canvas = document.querySelector('#canvas');

// 获取webgl绘图上下文
const gl = canvas.getContext('webgl') || .getContext("experimental-webgl");

// 清空颜色 颜色值为0-1  rgba颜色值需转换 (255, 255, 255, 255) 等价于 (1.0,1.0,1.0,1.0)
gl.clearColor(0.0,0.0,0.0,1.0);
// 可以调用 gl.getParameter(gl.COLOR_CLEAR_VALUE) 获取当前指定清空的颜色
// 清空颜色缓冲区
gl.clear(gl.COLOR_BUFFER_BIT);
```
