import * as THREE from 'three';
import { makeTextSprite } from './text';
import { ORIGIN, SIZE, FOCAL } from './consts';

// Red-less colors set:
const COLORS = [
  '#02f3b8',
  '#7fbcfb',
  '#62ff70',
  '#afc0ac',
  '#60cc5c',
  '#00cebb',
  '#abffc6',
];

const DATA = [
  {
    label: 'webgl',
    value: 5330000,
  },
  {
    label: 'd3.js',
    value: 13900000,
  },
  {
    label: 'nantes',
    value: 99800000,
  },
  {
    label: 'camembert',
    value: 14700000,
  },
  {
    label: 'web2day',
    value: 93200,
  },
].map(({ label, value }, i) => ({
  value,
  label,
  color: COLORS[i % COLORS.length],
}))
.sort((a, b) => b.value - a.value);

// Initialize scene:
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const light = new THREE.SpotLight();
light.castShadow = true;
light.position.set(0, FOCAL, FOCAL);
scene.add(light);

const ambientLight = new THREE.PointLight(0x123456);
ambientLight.position.set(FOCAL, 0, FOCAL);
scene.add(ambientLight);

// Add pie chart:
const max = Math.max(...DATA.map(a => a.value));
const total = DATA.map(a => a.value).reduce((a, b) => a + b);
let acc = Math.PI * 3 / 4;

DATA.forEach(({ value, color, label }) => {
  // Slice angle and delay vector:
  const angle = 2 * Math.PI * value / total;
  const dx = 30 * Math.cos(acc + angle / 2);
  const dy = 30 * Math.sin(acc + angle / 2);

  // Slice mesh:
  const material = new THREE.MeshPhongMaterial({ color });
  const geometry = new THREE.Shape();
  geometry.moveTo(dx, dy);
  geometry.arc(0, 0, SIZE, acc, acc + angle, false);
  geometry.lineTo(dx, dy);

  const extruded = new THREE.ExtrudeGeometry(
    geometry,
    { amount: value * SIZE / 2 / max + SIZE / 2 }
  );

  const slice = new THREE.Mesh(extruded, material);
  scene.add(slice);

  // Label:
  const text = makeTextSprite(label);
  text.position.set(
    SIZE * Math.cos(acc + angle / 2),
    SIZE * Math.sin(acc + angle / 2),
    value * SIZE / 2 / max + SIZE / 2 + 50
  );
  scene.add(text);

  acc += angle;
});

export default scene;
