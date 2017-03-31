import { PerspectiveCamera } from 'three';
import { ORIGIN, SIZE } from './consts';

const camera = new PerspectiveCamera(45, 1, 0.1, 10000);
camera.up.set(0, 0, 1);

export default camera;
