import { initialWebGL } from '../utils/initialWebGL.js';
import initTexture from '../utils/initTexture.js';
import initShaders from '../utils/initShaders.js';
import initBuffers from './initialBuffer.js';
import drawScene from './drawScene.js';

const src = "./bg.mp4";
const canvas = document.querySelector('#canvas');
const gl = initialWebGL(canvas);

if (!gl) {
  console.log('Error!');
}

const texture = initTexture(gl);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,0]));
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

const video = document.createElement('video');

video.preload = 'auto';
video.src = src;
video.crossorigin = 'anonymous';
let isPlay = false;
video.addEventListener('canplaythrough', startVideo, true);
video.addEventListener('ended', videoDone, true);

function startVideo() {
  video.play();
  isPlay = true;
}

function videoDone() {
  isPlay = false;
  video.pause();
}

let then = 0;
render();
var count = 0;
function render(now) {
  now *= 0.001;  // convert to seconds
  const deltaTime = now - then;
  then = now;
  if (isPlay) {
    updateTexture(gl, texture, video);
  }
  drawScene(
    gl,
    shaderProgram,
    texture,
    positionBuffer,
    video
  );
  requestAnimationFrame(render);
}

function updateTexture() {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                srcFormat, srcType, video);
}
