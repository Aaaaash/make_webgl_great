export function initialWebGL(element) {
  let webgl;
  try {
    webgl = element.getContext("webgl") || element.getContext("experimental-webgl");
  }
  catch(e) {}
  if (!webgl) {
    alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
    webgl = null;
  }
  return webgl;
}
