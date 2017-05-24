import * as THREE from 'three';

/**
 * Code shamelessly copied from:
 * https://threejs.org/examples/webgl_effects_anaglyph.html
 */
export default function(renderer, width = 512, height = 512) {
  this.colorMatrixLeft = new THREE.Matrix3().fromArray([
     1.0671679973602295,   -0.0016435992438346148,    0.0001777536963345483,
    -0.028107794001698494, -0.00019593400065787137,  -0.0002875397040043026,
    -0.04279090091586113,   0.000015809757314855233, -0.00024287120322696865,
  ]);

  this.colorMatrixRight = new THREE.Matrix3().fromArray([
    -0.0355340838432312,    -0.06440307199954987, 0.018319187685847282,
    -0.10269022732973099,    0.8079727292060852,  -0.04835830628871918,
     0.0001224992738571018, -0.009558862075209618, 0.567823588848114,
  ]);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new THREE.Scene();
  const stereo = new THREE.StereoCamera();
  const params = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
  };

  if (width === undefined) width = 512;
  if (height === undefined) height = 512;

  const renderTargetL = new THREE.WebGLRenderTarget(width, height, params);
  const renderTargetR = new THREE.WebGLRenderTarget(width, height, params);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      mapLeft: { value: renderTargetL.texture },
      mapRight: { value: renderTargetR.texture },
      colorMatrixLeft: { value: this.colorMatrixLeft },
      colorMatrixRight: { value: this.colorMatrixRight },
    },
    vertexShader: [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = vec2(uv.x, uv.y);',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D mapLeft;',
      'uniform sampler2D mapRight;',
      'varying vec2 vUv;',
      '',
      'uniform mat3 colorMatrixLeft;',
      'uniform mat3 colorMatrixRight;',
      '',
      'float lin(float c) {',
      '  return c <= 0.04045 ?',
      '    c * 0.0773993808 :',
      '    pow(c * 0.9478672986 + 0.0521327014, 2.4);',
      '}',
      '',
      'vec4 lin(vec4 c) {',
      '  return vec4(lin(c.r), lin(c.g), lin(c.b), c.a);',
      '}',
      '',
      'float dev(float c) {',
      '  return c <= 0.0031308 ?',
      '    c * 12.92 :',
      '    pow(c, 0.41666) * 1.055 - 0.055;',
      '}',
      '',
      'void main() {',
      '  vec2 uv = vUv;',
      '  vec4 colorL = lin(texture2D(mapLeft, uv));',
      '  vec4 colorR = lin(texture2D(mapRight, uv));',
      '  vec3 color = clamp(',
      '    colorMatrixLeft * colorL.rgb + colorMatrixRight * colorR.rgb,',
      '    0.,',
      '    1.',
      '  );',
      '  gl_FragColor = vec4(',
      '    dev(color.r), dev(color.g), dev(color.b),',
      '    max(colorL.a, colorR.a));',
      '}',
    ].join('\n')
  });

  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2, 2 ), material);
  scene.add(mesh);

  this.setSize = function(width, height) {
    renderer.setSize(width, height);

    const pixelRatio = renderer.getPixelRatio();

    renderTargetL.setSize(width * pixelRatio, height * pixelRatio);
    renderTargetR.setSize(width * pixelRatio, height * pixelRatio);
  };

  this.render = function(scene, camera) {
    scene.updateMatrixWorld();

    if (camera.parent === null) camera.updateMatrixWorld();

    stereo.update(camera);

    renderer.render(scene, stereo.cameraL, renderTargetL, true);
    renderer.render(scene, stereo.cameraR, renderTargetR, true);
    renderer.render(scene, camera);
  };

  this.dispose = function() {
    if (renderTargetL) renderTargetL.dispose();
    if (renderTargetR) renderTargetR.dispose();
  };
};
