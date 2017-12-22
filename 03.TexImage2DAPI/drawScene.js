export default function drawScene(gl, shaderProgram, texture, buffers, element) {
  debugger;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  /**
   * 创建一个透视矩阵
   * 用于模拟相机的透视
   * 视角45度
   */
  const fieldOfView = 45 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 场景中心
  const modelViewMatrix = mat4.create();

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
      gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    );
  }

  {
    // 告诉webgl从何处开始绘制
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(
      gl.getAttribLocation(shaderProgram, 'aTextureCoord')
    );
  }

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
      gl.getAttribLocation(shaderProgram, 'aVertexNormal')
    );
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl.useProgram(shaderProgram);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    false,
    projectionMatrix
  );

  gl.uniformMatrix4fv(
    gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    false,
    modelViewMatrix
  );

  // gl.uniformMatrix4fv(
  //   gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
  //   false,
  //   normalMatrix);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), 0);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
