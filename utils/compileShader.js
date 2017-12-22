/**
 * 创建并编译一个着色器
 *
 * @param {!WebGLRenderingContext} gl WebGL上下文。
 * @param {string} shaderSource GLSL 格式的着色器代码
 * @param {number} shaderType 着色器类型, VERTEX_SHADER 或
 *     FRAGMENT_SHADER。
 * @return {!WebGLShader} 着色器。
 */
function compileShader(gl, shaderSource, shaderType) {
  // 创建着色器程序
  var shader = gl.createShader(shaderType);
 
  // 设置着色器的源码
  gl.shaderSource(shader, shaderSource);
 
  // 编译着色器
  gl.compileShader(shader);
 
  // 检测编译是否成功
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // 编译过程出错，获取错误信息。
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }
 
  return shader;
}

export default compileShader;
