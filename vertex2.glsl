precision mediump float;

attribute vec2 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform float theta;
uniform float scaleX;

void main() {
  fColor = vColor;
  mat4 scale = mat4(
    scaleX, 0.0, 0.0, -0.5*scaleX+0.5,
    0.0, 1, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0 , 1.0
  );

  gl_Position = scale * vec4(vPosition, 0.0, 1.0);
}
