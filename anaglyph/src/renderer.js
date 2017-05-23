import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import scene from './scene'
import { SIZE, CENTER, ORIGIN } from './consts';

// No body scrolling:
document.body.style.overflow = 'hidden';
document.body.style.margin = 0;
document.body.style.padding = 0;

// Initialize DOM container:
const container = document.getElementById('app');
container.style.position = 'absolute';
['top', 'left', 'right', 'bottom'].forEach(str => container.style[str] = 0);

// Initialize renderer:
const renderer = new WebGLRenderer({ alpha: true });
container.appendChild(renderer.domElement);

// Initialize camera:
const camera = new PerspectiveCamera(45, 1, 0.1, 10000);
camera.up.set(0, 0, 1);
scene.add(camera);

// Deal with rendering:
function _render() {
  renderer.clear();
  renderer.render(scene, camera);
}

// Deal with autoresize:
function _resize() {
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  _render();
}
window.addEventListener('resize', _resize);
_resize();

// Make the camera move:
function _moveCamera() {
  const t = +Date.now() * 2 * Math.PI / 5000;
  const direction = new Vector3(
    SIZE * 1.5 * Math.cos(Math.cos(t) / 2 + Math.PI / 4),
    SIZE * 1.5 * Math.sin(Math.cos(t) / 2 + Math.PI / 4),
    SIZE
  );
  const position = CENTER.clone().add(direction);

  camera.position.set(...position.toArray());
  camera.lookAt(CENTER);
  _render();

  requestAnimationFrame(_moveCamera);
}
_moveCamera();

export default renderer;
