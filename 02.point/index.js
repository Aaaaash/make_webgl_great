const VSHADER_SOURCE = `
  void main() {
    gl_Position = vec4(0.0,0.0,0.0,1.0); // 设置坐标
    gl_PointSize = 10.0;  // 设置尺寸
  }
`;

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(0.5,0.5,0.5,1); // 设置颜色
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

  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINT, 0, 1);
}

main();
