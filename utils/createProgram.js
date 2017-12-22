/**
 * 从 2 个着色器中创建一个程序
 *
 * @param {!WebGLRenderingContext) gl WebGL上下文。
 * @param {!WebGLShader} vertexShader 一个顶点着色器。
 * @param {!WebGLShader} fragmentShader 一个片断着色器。
 * @return {!WebGLProgram} 程序
 */
function createProgram(gl, vertexShader, fragmentShader) {
  // 创建一个程序
  var program = gl.createProgram();
 
  // 附上着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
 
  // 链接到程序
  gl.linkProgram(program);
 
  // 检查链接是否成功
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // 链接过程出现问题
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }
 
  return program;
};

export default createProgram;
