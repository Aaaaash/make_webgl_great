import initialWebGL from '../utils/initialWebGL.js';
import initShaders from '../utils/initShaders.js';

const canvas = document.querySelector('#canvas');
// 初始化webgl
const gl = initialWebGL(canvas);

if (!gl) {
  console.log('无法初始化webgl');
}

/**
 * 从script标签中获取着色器源码，编译并上传到gpu
 * 生成着色器程序，并根据着色器程序找到需要输入属性值的位置
 */
const { shaderProgram, vertexPositionAttribute } = initShaders(gl);
const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
const positionBuffer = gl.createBuffer();
const positions = [
  0, 20,
  80, 20,
  0, 30,
  0, 30,
  80, 20,
  80, 30,
];

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 调整画布尺寸
webglUtils.resizeCanvasToDisplaySize(gl.canvas);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// 清空画布
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// 使用着色器程序 
gl.useProgram(shaderProgram);
// 启用对应位置的属性
gl.enableVertexAttribArray(vertexPositionAttribute);

// 告诉属性怎么从positionbuffer中读取数据
const size = 2; // 每次迭代运行提取2个单位的数据
const type = gl.FLOAT;  // 每个单位的数据类型是32位浮点型
const normalize = false;  // 不需要归一化数据
const stride = 0;
const offset = 0; // 缓冲读取起始位置
gl.vertexAttribPointer(
  vertexPositionAttribute, size, type, normalize, stride, offset
);
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

const primitiveType = gl.TRIANGLES;
gl.drawArrays(primitiveType, 0, 6);
