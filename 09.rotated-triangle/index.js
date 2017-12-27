const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_CosB;
  uniform float u_SinB;
  void main() {
    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
    gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
  }
`;

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(0.0,1.0,0.0,1); // 设置颜色
  }
`;

const angle = 30.0;

function main() {
  const canvas = document.querySelector('#canvas');

  const gl = getWebGLContext(canvas, true);
  if (!gl) {
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return;
  }

  // 设置顶点位置 返回需要绘制的顶点个数
  const n = initVertexBuffers(gl);
  if (n < 0) {
    return;
  }

  const radian = Math.PI * angle / 180.0;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);

  const u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
  const u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
  gl.uniform1f(u_CosB, cosB);
  gl.uniform1f(u_SinB, sinB);
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

const Tx = 0.5;
const Ty = 0.5;
const Tz = 0.0;
function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);

  const translation = new Float32Array([
    0.5, 0.5, 0.0, 0.0
  ]);

  const n = 3;
  
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    return -1;
  }
  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  const u_Translation = gl.getUniformLocation(gl.program,'u_Translation');
  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);
  // 分配缓冲区对象给变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // 连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);
  return n;
}
main();
