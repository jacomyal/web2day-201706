import * as THREE from 'three';
import { ORIGIN, SIZE, FOCAL } from './consts';

const DATA = Array(Math.floor(20 * Math.random()) + 2)
  .join('.')
  .split('.')
  .map((_, i) => ({
    value: Math.random(),
    label: 'Valeur ' + i,
    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
  }))
  .sort((a, b) => b.value - a.value);

// Initialize scene:
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const light = new THREE.SpotLight();
light.castShadow = true;
light.position.set(0, FOCAL, FOCAL );
scene.add(light);

const ambientLight = new THREE.PointLight(0x123456);
ambientLight.position.set(FOCAL, 0, FOCAL );
scene.add(ambientLight);

// Add pie chart:
const total = DATA.map(a => a.value).reduce((a, b) => a + b);

let acc = Math.PI * 3 / 4;
DATA.forEach(({ value, color }) => {
  const angle = 2 * Math.PI * value / total;
  const dx = 30 * Math.cos(acc + angle / 2);
  const dy = 30 * Math.sin(acc + angle / 2);

  const material = new THREE.MeshPhongMaterial({ color });

  const geometry = new THREE.Shape();
  geometry.moveTo(dx, dy);
  geometry.arc(0, 0, SIZE, acc, acc + angle, false);
  geometry.lineTo(dx, dy);

  const extruded = new THREE.ExtrudeGeometry(
    geometry,
    {
      amount: value * SIZE,
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
