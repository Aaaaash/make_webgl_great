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

main();
