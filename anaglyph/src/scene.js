import * as THREE from 'three';
import { ORIGIN, SIZE } from './consts';

const DATA = [2, 5, 11, 3, 79];

// Initialize scene:
const scene = new THREE.Scene();

const light = new THREE.SpotLight();
light.castShadow = true;
light.position.set(-170, 300, 100);
scene.add(light);

const ambientLight = new THREE.PointLight(0x123456);
ambientLight.position.set(20, 150, -120);
scene.add(ambientLight);

// Add pie chart:
const total = DATA.reduce((a, b) => a + b);

let acc = 0;
DATA.forEach(val => {
  const angle = 2 * Math.PI * val / total;

  const material = new THREE.MeshPhongMaterial({
    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
  });

  const geometry = new THREE.Shape();
  geometry.moveTo(0, 0);
  geometry.arc(0, 0, 40, acc, acc + angle, false);
  geometry.lineTo(0, 0);

  const extruded = new THREE.ExtrudeGeometry(
    geometry,
    {
      amount: Math.random() * 40 + 10,
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

  const segment = new THREE.Mesh(extruded, material);
  segment.rotation.x = Math.PI / 2;

  scene.add(segment);

  acc += angle;
});

export default scene;
