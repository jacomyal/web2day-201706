import * as THREE from 'three';
import { ORIGIN, SIZE, VIEW_DISTANCE } from './consts';

const DATA = Array(Math.floor(20 * Math.random()) + 2)
  .join('.')
  .split('.')
  .map(() => Math.random())
  .sort((a, b) => b - a);

// Initialize scene:
const scene = new THREE.Scene();

const light = new THREE.SpotLight();
light.castShadow = true;
light.position.set(0 , VIEW_DISTANCE , VIEW_DISTANCE );
scene.add(light);

const ambientLight = new THREE.PointLight(0x123456);
ambientLight.position.set(VIEW_DISTANCE , 0 , VIEW_DISTANCE );
scene.add(ambientLight);

// Add pie chart:
const total = DATA.reduce((a, b) => a + b);

let acc = Math.PI * 3 / 4;
DATA.forEach(val => {
  const angle = 2 * Math.PI * val / total;
  const dx = 2 * Math.cos(acc + angle / 2);
  const dy = 2 * Math.sin(acc + angle / 2);

  const material = new THREE.MeshPhongMaterial({
    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
  });

  const geometry = new THREE.Shape();
  geometry.moveTo(dx, dy);
  geometry.arc(0, 0, SIZE, acc, acc + angle, false);
  geometry.lineTo(dx, dy);

  const extruded = new THREE.ExtrudeGeometry(
    geometry,
    {
      amount: val * SIZE,
      bevelEnabled: false,
      curveSegments: 50,
      steps: 2,
    }
  );
  extruded.dynamic = true
  extruded.verticesNeedUpdate = true;
  extruded.normalsNeedUpdate = true;
  extruded.computeFaceNormals();
  extruded.computeBoundingSphere();

  const slice = new THREE.Mesh(extruded, material);

  scene.add(slice);

  acc += angle;
});

export default scene;
