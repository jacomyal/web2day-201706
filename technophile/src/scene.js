import * as THREE from 'three';
import camera from './camera';
import data from './data';
import { getCircleSprite } from './utils';
import { X, Y, Z, COLOR, ORIGIN, SIZE } from './consts';

// Find extrema:
const extrema = {};
[X, Y, Z].forEach(i => {
  extrema[i] = { min: Infinity, max: -Infinity };
});
data.rows.forEach(arr => {
  [X, Y, Z].forEach(i => {
    extrema[i].min = Math.min(extrema[i].min, arr[i]);
    extrema[i].max = Math.max(extrema[i].max, arr[i]);
  });
});

// Initialize scene:
const scene = new THREE.Scene();
scene.add(camera);

// Draw caption:
[0, 1, 2].forEach(dim => {
  const target = new THREE.Vector3(
    ...[0, 0, 0].map((_, i) => i === dim ? SIZE : 0)
  );

  const geom = new THREE.Geometry();
  geom.vertices.push(ORIGIN);
  geom.vertices.push(target);
  scene.add(
    new THREE.Line(
      geom,
      new THREE.LineBasicMaterial({ color: 0x000000 })
    )
  );
});

// Generate sprites:
const radius = 4;
const sprites = {};
data.cols[COLOR].values.forEach(({ id, color }) => {
  sprites[id] = getCircleSprite(radius, color);
});

// Draw particules:
data.rows.forEach(arr => {
  const sprite = new THREE.Sprite(sprites[arr[COLOR]]);
  sprite.position.set(
    arr[X] / extrema[X].max * SIZE,
    arr[Y] / extrema[Y].max * SIZE,
    arr[Z] / extrema[Z].max * SIZE
  );
  scene.add(sprite);
});

export default scene;
