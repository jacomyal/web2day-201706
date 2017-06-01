import * as THREE from 'three';

// Source:
// https://github.com/deathbearbrown/learning-three-js-blogpost
export function makeTextSprite(message, opts = {}) {
  const position = opts.position;
  const fontFace = opts.fontFace || 'sans-serif';
  const fontSize = opts.fontSize || 30;

  // Create canvas:
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Get size data (height depends only on font size), and resize canvas:
  context.fillStyle = '#000';
  context.font = fontSize + 'px ' + fontFace;
  const metrics = context.measureText(message);
  canvas.width = metrics.width;
  canvas.height = fontSize;

  // Draw text:
  // (reset font, since it seems to disappear avec measureText...)
  context.font = fontSize + 'px ' + fontFace;
  context.fillText(message, 0, fontSize);

  // Use canvas content as THREE texture:
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
  });

  const width = metrics.width / 2;
  const height = fontSize / 2;
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(metrics.width / 2, fontSize / 2, 1);

  return sprite;
};
