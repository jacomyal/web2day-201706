import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import scene from './scene'
import wrapAnaglyph from './anaglyph'
import { CENTER, ORIGIN, VIEW_DISTANCE } from './consts';

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

// Initialize anaglyph effect:
const effect = new wrapAnaglyph(renderer);

// Deal with rendering:
function _render() {
  effect.render(scene, camera);
}

// Deal with autoresize:
function _resize() {
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  effect.setSize(width, height);
  _render();
}
window.addEventListener('resize', _resize);
_resize();

// Make the camera move:
function _moveCamera() {
  const t = +Date.now() * 2 * Math.PI / 5000;
  const direction = new Vector3(
    VIEW_DISTANCE * Math.cos(Math.cos(t) / 2 + Math.PI / 4),
    VIEW_DISTANCE * Math.sin(Math.cos(t) / 2 + Math.PI / 4),
    VIEW_DISTANCE * Math.cos(Math.cos(t) / 2)
  );
  const position = CENTER.clone().add(direction);

  camera.position.set(...position.toArray());
  camera.lookAt(CENTER);
  _render();

  requestAnimationFrame(_moveCamera);
}
_moveCamera();
