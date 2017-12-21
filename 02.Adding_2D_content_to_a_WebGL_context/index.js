import initShaders from './initShaders.js';
import initBuffers from './initBuffers.js';
import drawScene from './drawScene.js';
import { initialWebGL } from '../utils/initialWebGL.js';

const canvas = document.querySelector('#canvas');
const gl = initialWebGL(canvas);

if (gl) {
  canvas.width = 852;
  canvas.height = 480;
  gl.viewport(0, 0, canvas.width, canvas.height);

  // 设置清除颜色为黑色，不透明
  gl.clearColor(0.0, 0.0, 0.0, 1.0);    
  // 开启“深度测试”, Z-缓存
  gl.enable(gl.DEPTH_TEST); 
  // 设置深度测试，近的物体遮挡远的物体
  gl.depthFunc(gl.LEQUAL); 
  // 清除颜色和深度缓存
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);     

  // 初始化着色器
  const { shaderProgram } = initShaders(gl);

  // 创建一个缓冲器来存储图形的顶点
  const positionBuffer = initBuffers(gl);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  drawScene(
    gl,
    programInfo,
    positionBuffer,
  );
}
