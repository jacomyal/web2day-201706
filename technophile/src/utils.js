import * as THREE from 'three';

export function getCircleSprite(radius, color) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = radius * 2;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, radius * 2, radius * 2);
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();

  const texture = new THREE.Texture(
    ctx.getImageData(0, 0, radius * 2, radius * 2)
  );
  texture.needsUpdate = true;
  return new THREE.SpriteMaterial({
    color,
    map: texture,
  });
}
