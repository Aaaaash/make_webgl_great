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
  const a_points = []; // 存储鼠标点击位置
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  canvas.addEventListener('mousedown', (ev) => {
    let x = ev.clientX;
    let y = ev.clientY;
    const rect = canvas.getBoundingClientRect();
    const pointSize = Math.random() * 20;
    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
    a_points.push([
      x,
      y,
      pointSize
    ]);
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < a_points.length; i ++ ) {
      const attr = a_points[i];
      const position = new Float32Array([attr[0], attr[1], 0.0]);
      gl.vertexAttrib3fv(a_Position, position);
      gl.vertexAttrib1f(a_PointSize, attr[2]);
      gl.drawArrays(gl.POINT, 0, 1);
    }
  });
}

main();
