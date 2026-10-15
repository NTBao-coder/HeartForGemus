(() => {
  'use strict';
  const layer = document.getElementById('falling-flowers');
  if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#edb69e', '#f5c6a5', '#e8899a', '#ffd5a9', '#d995b5'];
  const count = window.matchMedia('(max-width: 700px)').matches ? 10 : 16;

  for (let index = 0; index < count; index += 1) {
    const flower = document.createElement('span');
    flower.className = 'falling-flower';
    flower.style.setProperty('--left', `${Math.random() * 100}%`);
    flower.style.setProperty('--size', `${10 + Math.random() * 15}px`);
    flower.style.setProperty('--opacity', `${0.22 + Math.random() * 0.3}`);
    flower.style.setProperty('--duration', `${11 + Math.random() * 12}s`);
    flower.style.setProperty('--delay', `${Math.random() * -18}s`);
    flower.style.setProperty('--sway', `${-50 + Math.random() * 100}px`);
    flower.style.setProperty('--flower-color', colors[index % colors.length]);
    layer.append(flower);
  }

  let lastTrailAt = 0;
  function bloom(x, y, trail = false) {
    const burst = document.createElement('span');
    burst.className = trail ? 'touch-bloom touch-trail' : 'touch-bloom';
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    burst.style.setProperty('--bloom-color', colors[Math.floor(Math.random() * colors.length)]);
    burst.style.setProperty('--angle', `${Math.random() * 360}deg`);
    layer.append(burst);
    window.setTimeout(() => burst.remove(), trail ? 650 : 950);
  }

  document.addEventListener('pointerdown', event => {
    bloom(event.clientX, event.clientY);
  }, {passive: true});

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch') return;
    const now = performance.now();
    if (now - lastTrailAt < 90) return;
    lastTrailAt = now;
    bloom(event.clientX, event.clientY, true);
  }, {passive: true});
})();
