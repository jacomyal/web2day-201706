import DATA from '../assets/data.json';

const MAX_X = Math.max(...DATA.map(([vx, vy]) => vx));
const MAX_Y = Math.max(...DATA.map(([vx, vy]) => vy));
const POINTS = document.getElementById('points');

// Créé un point pour chaque individu :
DATA.forEach(([ vx, vy ]) => {
  const point = document.createElement('div');
  point.classList.add('point');
  point.style.left = (vx / MAX_X * 100) + '%';
  point.style.bottom = (vy / MAX_Y * 100) + '%';

  POINTS.appendChild(point);
})
