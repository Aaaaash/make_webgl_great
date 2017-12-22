import compileShader from './compileShader.js';

/**
 * 用 script 标签的内容创建着色器
 *
 * @param {!WebGLRenderingContext} gl WebGL上下文。
 * @param {string} scriptId script标签的id。
 * @param {string} opt_shaderType. 要创建的着色器类型。
 *     如果没有定义，就使用script标签的type属性。
 *     
 * @return {!WebGLShader} 着色器。
 */
function createShaderFromScript(gl, scriptId, opt_shaderType) {
  // 通过id找到script标签
  var shaderScript = document.getElementById(scriptId);
  if (!shaderScript) {
    throw("*** Error: unknown script element" + scriptId);
  }
 
  // 提取标签内容。
  var shaderSource = shaderScript.text;
 
  // 如果没有传着色器类型，就使用标签的 ‘type’ 属性
  if (!opt_shaderType) {
    if (shaderScript.type == "x-shader/x-vertex") {
      opt_shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type == "x-shader/x-fragment") {
      opt_shaderType = gl.FRAGMENT_SHADER;
    } else if (!opt_shaderType) {
      throw("*** Error: shader type not set");
    }
  }
 
  return compileShader(gl, shaderSource, opt_shaderType);
};

export default createShaderFromScript;
