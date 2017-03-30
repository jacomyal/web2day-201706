import * as THREE from 'three';
import camera from './camera';

const scene = new THREE.Scene();
scene.add(camera);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(
    50,
    16,
    16
  ),
  new THREE.MeshLambertMaterial({
    color: 0xCC0000
  })
);
sphere.position.z = -300;
scene.add(sphere);

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(pointLight);

export default scene;
