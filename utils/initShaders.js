import getShader from './getShader.js';

export default function initShaders(gl) {
  // 从id为'shader-fs'的script元素中加载片段着色器
  const framentShader = getShader(gl, 'shader-fs');
  // 从id为'shader-vs'的script元素中加载顶点着色器
  const vertexShader = getShader(gl, 'shader-vs');
  // 创建着色器程序
  /**
   * WebGLProgram 是 WebGL API 的一部分
   * 它由两个WebGLShaders （webgl着色器）组成，分别为顶点着色器还有片元着色器
   * （两种着色器都是由GLSL语言来写的）
   * WebGLProgram 负责将两个着色器使用在一个webgl程序上
   */
  const shaderProgram = gl.createProgram();

  // 将webgl对象与两个着色器关联起来
  /**
   * attachShader方法接受两个参数
   * 一个 WebGLProgram 对象
   * 一个类型为片段或者顶点的 WebGLShader
   */
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, framentShader);

  // 链接着色器程序
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('初始化着色器失败！');
  }

  // 为webgl对象使用着色器程序
  gl.useProgram(shaderProgram);
  const textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(textureCoordAttribute);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);  
  const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(vertexPositionAttribute);
  return {
    shaderProgram,
    vertexPositionAttribute,
  };
}
