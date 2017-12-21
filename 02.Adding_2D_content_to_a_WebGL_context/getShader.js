export default function getShader(gl, id) {
  let shaderScript;
  let theSource;
  let currentChild;
  let shader;

  shaderScript = document.querySelector(`#${id}`);
debugger;
  if (!shaderScript) {
    return null;
  }

  theSource = '';
  currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType === currentChild.TEXT_NODE) {
      theSource += currentChild.textContent;
    }
    
    currentChild = currentChild.nextSibling;
  }

  /**
   * webgl.createShader用于创建一个WebGLShader着色器对象
   * 该对象可以使用 WebGLRenderingContext.shaderSource() 和
   * WebGLRenderingContext.compileShader() 方法配置着色器代码.
   */
  if (shaderScript.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  // 设置着色器对象的GLSL代码
  gl.shaderSource(shader, theSource);
  // 编译一个着色器，使其成为为二进制数据，然后就可以被WebGLProgram对象所使用.
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log('加载着色器出错');
  }

  return shader;
}
