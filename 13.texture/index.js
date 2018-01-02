const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float; // 设置精度
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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

  // 设置顶点位置 返回需要绘制的顶点个数
  const n = initVertexBuffers(gl);
  if (n < 0) {
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if(!initTextures(gl, n)) {
    return;
  }

}

function initVertexBuffers(gl) {
  const vertexTexCoords = new Float32Array([
    -0.5,  0.5,   -0.3, 1.7,
    -0.5, -0.5,   -0.3, -0.2,
     0.5,  0.5,   1.7, 1.7,
     0.5, -0.5,   1.7, -0.2,
  ]);
  const n = 4;
  
  const vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    return -1;
  }
  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  // 向缓冲区对象中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertexTexCoords, gl.STATIC_DRAW);

  const FSIZE = vertexTexCoords.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  // 分配缓冲区对象给变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  // 连接a_Position变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);


  const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);

  return n;
}

function initTextures(gl, n) {
  const texture = gl.createTexture();

  const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  const image = new Image();
  image.onload = () => {
    loadTexture(gl, n, texture, u_Sampler, image);
  }

  image.src = "../images/sky.JPG";
  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
main();
