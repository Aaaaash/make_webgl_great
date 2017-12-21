const horizAspect = 480.0 / 852.0;

export default function initBuffers(gl) {
  // createBuffer创建缓冲器
  const positionBuffer = gl.createBuffer();
  // bindBuffer用于绑定上下文
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const vertices = [
    1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
    -1.0, -1.0,
  ];
  // 将图形的顶点信息转化为一个浮点类型的数组
  // 传到gl对象的bufferData创建对象的顶点
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return positionBuffer;
}
