import { WebGLRenderer } from 'three';
import camera from './camera';
import scene from './scene'

// No body scrolling:
document.body.style.overflow = 'hidden';
document.body.style.margin = 0;
document.body.style.padding = 0;

// Initialize DOM container:
const container = document.getElementById('app');
container.style.position = 'absolute';
container.style.background = '#fc0';
['top', 'left', 'right', 'bottom'].forEach(str => container.style[str] = 0);

// Initialize renderer:
const renderer = new WebGLRenderer();
container.appendChild(renderer.domElement);

// Deal with rendering:
function _render() {
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

export default renderer;
