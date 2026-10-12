/* Particle heart, based on the original heart-2010 MVP. */
(() => {
  'use strict';
  const stage = document.getElementById('stage');
  const labels = document.getElementById('heart-labels');
  function fallback() {
    stage.classList.add('fallback');
    window.gemusHeart = { setMembers(members, select) {
      labels.replaceChildren();
      members.forEach(m => { const b = document.createElement('button'); b.className = 'star-label'; b.textContent = m.name; b.onclick = () => select(m); labels.append(b); });
    } };
    ['zoom-in','zoom-out','zoom-reset'].forEach(id => { document.getElementById(id).disabled = true; });
  }
  if (!window.THREE) { fallback(); return; }
  const S = 9.5;
  const isMobile = matchMedia('(pointer: coarse)').matches || innerWidth < 700;
  const PARTICLE_COUNT = isMobile ? 3200 : 5800;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  try {
  // ====== 2. Cảnh 3D ======
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  stage.appendChild(renderer.domElement);

  var heartGroup = new THREE.Group();
  scene.add(heartGroup);

  function fitCamera() {
    var w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Trái tim phải lọt hẳn vào màn hình, kể cả khi cầm điện thoại dọc
    var tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    var halfH = S * 1.28, halfW = S * 1.32;
    camera.position.set(0, 0, Math.max(halfH / tanHalf, halfW / (tanHalf * camera.aspect)));
  }
  fitCamera();
  window.addEventListener('resize', fitCamera);
  new ResizeObserver(fitCamera).observe(stage);

  // ====== 3. Hình trái tim 3D ======
  // Phương trình trái tim 3 chiều: bên trong khi f <= 0.
  // Ở đây z là chiều đứng, y là chiều sâu (sẽ đổi trục khi đặt vào cảnh).
  function heartF(x, y, z) {
    var a = x * x + 2.25 * y * y + z * z - 1;
    return a * a * a - x * x * z * z * z - 0.1125 * y * y * z * z * z;
  }
  function rand(min, max) { return min + Math.random() * (max - min); }

  // Hạt phủ đầy khối tim
  var positions = new Float32Array(PARTICLE_COUNT * 3);
  var colors = new Float32Array(PARTICLE_COUNT * 3);
  var cRose = new THREE.Color('#ff6f9c'), cPeach = new THREE.Color('#ffc9a8'), tmpC = new THREE.Color();
  var n = 0;
  while (n < PARTICLE_COUNT) {
    var x = rand(-1.3, 1.3), y = rand(-1.1, 1.1), z = rand(-1.2, 1.3);
    var f = heartF(x, y, z);
    if (f > 0) continue;
    if (n % 5 < 3 && f < -0.12) continue;   // 3/5 số hạt nằm sát bề mặt để rõ hình tim
    positions[n * 3]     = x * S;
    positions[n * 3 + 1] = z * S;     // chiều đứng của tim là trục Y của Three.js
    positions[n * 3 + 2] = y * S;
    tmpC.copy(cRose).lerp(cPeach, Math.random() * 0.55).multiplyScalar(0.8 + Math.random() * 0.2);
    colors[n * 3] = tmpC.r; colors[n * 3 + 1] = tmpC.g; colors[n * 3 + 2] = tmpC.b;
    n++;
  }

  // Hình tròn mềm cho mỗi hạt (vẽ bằng canvas, không cần file ảnh)
  function makeDotTexture() {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d');
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  var particles = new THREE.Points(geo, new THREE.PointsMaterial({
    size: isMobile ? 0.27 : 0.23,
    map: makeDotTexture(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  heartGroup.add(particles);


  let zoom = 1.08, touched = false, focusedId = null;
  const stars = [], projected = new THREE.Vector3(), world = new THREE.Vector3();
  window.gemusHeart = { setMembers(members, select) {
    labels.replaceChildren(); stars.length = 0;
    const candidates = [];
    // Fixed seed keeps member positions stable across reloads and device sizes.
    let seed = 2010;
    const random = () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed/4294967296; };
    for (let attempt = 0; candidates.length < 1200 && attempt < 200000; attempt++) {
      const x = random()*2.6-1.3, y = random()*2.2-1.1, z = random()*2.5-1.2;
      const f = heartF(x,y,z);
      if (f <= 0 && f > -0.035) candidates.push(new THREE.Vector3(x*S,z*S,y*S));
    }
    const chosen = [];
    members.forEach((member, index) => {
      let best = candidates[0], distance = -1;
      candidates.forEach(p => {
        const d = chosen.length ? Math.min(...chosen.map(q => p.distanceToSquared(q))) : p.y;
        if (d > distance) { distance = d; best = p; }
      });
      const point = best.clone(); chosen.push(point);
      const button = document.createElement('button'); button.className = 'star-label';
      button.setAttribute('aria-label', 'Mở thiệp của ' + member.name);
      const dot = document.createElement('span'); dot.className = 'star-dot'; dot.setAttribute('aria-hidden', 'true');
      const name = document.createElement('span'); name.className = 'star-name'; name.textContent = member.name;
      button.append(dot, name);
      button.addEventListener('click', () => { touched = true; select(member); });
      button.addEventListener('focus', () => { touched = true; });
      labels.append(button); stars.push({ point, button, name, id:index, member, wasVisible:false });
    });
  }, focusMember(id) {
    const star = stars.find(s => s.member.id === id);
    if (!star) return false;
    focusedId = star.id; touched = true; zoom = 1.5;
    heartGroup.quaternion.setFromUnitVectors(star.point.clone().normalize(), new THREE.Vector3(0,0,1));
    stars.forEach(s => s.button.classList.toggle('is-selected', s === star));
    return true;
  } };
  function setZoom(value) { zoom = Math.max(0.7, Math.min(2.6, value)); touched = true; }
  document.getElementById('zoom-in').onclick = () => setZoom(zoom * 1.2);
  document.getElementById('zoom-out').onclick = () => setZoom(zoom / 1.2);
  document.getElementById('zoom-reset').onclick = () => { zoom = 1.08; focusedId = null; heartGroup.rotation.set(0, 0, 0); touched = true; stars.forEach(s => s.button.classList.remove('is-selected')); };
  const pointers = new Map();
  let travel = 0, pinched = false, suppressClick = false;
  const distance = () => { const [a,b] = [...pointers.values()]; return Math.hypot(a.x-b.x,a.y-b.y); };
  stage.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!pointers.size) { travel = 0; pinched = false; suppressClick = false; }
    touched = true;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    // Capture on the original button so a genuine tap keeps its click target.
    e.target.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    const previous = pointers.get(e.pointerId); if (!previous) return;
    const oldDistance = pointers.size >= 2 ? distance() : 0;
    const dx = e.clientX-previous.x, dy = e.clientY-previous.y;
    travel += Math.abs(dx) + Math.abs(dy);
    pointers.set(e.pointerId, {x:e.clientX,y:e.clientY});
    if (pointers.size >= 2) { pinched = true; if (oldDistance > 0) setZoom(zoom * distance()/oldDistance); }
    else {
      heartGroup.rotation.y += dx * 0.006;
      heartGroup.rotation.x = Math.max(-0.8, Math.min(0.8, heartGroup.rotation.x + dy * 0.004));
    }
  });
  const end = e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    suppressClick = pinched || travel > 8 || e.type === 'pointercancel';
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('lostpointercapture', end);
  stage.addEventListener('click', e => { if (suppressClick && e.detail !== 0) { e.preventDefault(); e.stopPropagation(); } }, true);
  stage.addEventListener('wheel', e => { e.preventDefault(); setZoom(zoom * Math.exp(-e.deltaY * 0.001)); }, {passive:false});

  const clock = new THREE.Clock();
  let elapsed = 0;
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (document.hidden || document.body.dataset.view === 'letter') return;
    elapsed += dt;
    if (!motion.matches && !touched && !pointers.size) heartGroup.rotation.y += dt * 0.10;
    heartGroup.scale.setScalar(zoom * (motion.matches ? 1 : 1 + Math.sin(elapsed * 1.5) * 0.018));
    heartGroup.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    const width = stage.clientWidth, height = stage.clientHeight;
    const candidates = [];
    stars.forEach(star => {
      world.copy(star.point).applyMatrix4(heartGroup.matrixWorld);
      projected.copy(world).project(camera);
      if (world.z > 0 && projected.z > -1 && projected.z < 1) {
        candidates.push({id:star.id, x:(projected.x+1)*width/2, y:(1-projected.y)*height/2,
          depth:world.z, priority:star.id === focusedId || document.activeElement === star.button ? 100 : star.wasVisible ? 1 : 0});
      }
    });
    const packed = new Map(GemusLayout.packStars(candidates,width,height,isMobile?124:144).map(p => [p.id,p]));
    stars.forEach(star => {
      const p = packed.get(star.id);
      star.button.hidden = !p; star.wasVisible = !!p;
      if (!p) return;
      star.button.style.left = p.x+'px'; star.button.style.top = p.y+'px';
      star.button.style.zIndex = String(Math.round(p.depth+100));
      star.name.hidden = !p.label;
      if (p.label) {
        star.name.style.left = (p.label.x-p.x+22)+'px';
        star.name.style.top = (p.label.y-p.y+22)+'px';
        star.name.style.width = p.label.w+'px';
      }
    });
    renderer.render(scene, camera);
  }
  animate();
  } catch (error) {
    stage.querySelector('canvas')?.remove();
    fallback();
    console.warn('3D unavailable; showing the static heart.', error);
  }
})();
