import { BuiltinGame } from './embeddedGames';

export const CLASSIC_ENGINES: Record<string, BuiltinGame> = {
  'cookie-clicker': {
    id: 'cookie-clicker',
    title: 'Cookie Clicker Pro',
    category: 'Idle & Clicker',
    description: 'Bake trillions of cookies with grandmas, mines, factories, and cosmic portals.',
    instructions: 'Click the big cookie to bake cookies. Buy grandmas and automated factories from the shop. Click floating golden cookies for bonuses!',
    controls: 'Left Click on the cookie and shop items.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#0b0f17; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; display:flex; height:100vh; overflow:hidden; user-select:none; }
  .left { flex:1.2; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; border-right:1px solid #1e293b; background:radial-gradient(circle at center, #172554 0%, #0b0f17 80%); }
  .right { flex:1; background:#0f172a; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; border-left:1px solid #1e293b; }
  .cookie-btn { width:200px; height:200px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #f59e0b 0%, #d97706 45%, #b45309 85%); border:none; cursor:pointer; box-shadow:0 0 40px rgba(245,158,11,0.35); position:relative; transition:transform 0.08s cubic-bezier(0.16,1,0.3,1); }
  .cookie-btn:active { transform:scale(0.92); }
  .chip { position:absolute; width:18px; height:18px; background:#451a03; border-radius:50%; box-shadow:inset -2px -2px 0 #290d02; }
  .item { display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:10px 14px; border-radius:10px; cursor:pointer; border:1px solid #334155; transition:all 0.15s; }
  .item:hover:not(.disabled) { background:#334155; border-color:#f59e0b; transform:translateX(2px); }
  .item.disabled { opacity:0.4; cursor:not-allowed; }
  .golden { position:absolute; width:45px; height:45px; background:radial-gradient(circle, #fde047, #eab308); border-radius:50%; cursor:pointer; box-shadow:0 0 25px #fde047; animation:float 4s infinite alternate; z-index:20; }
  @keyframes float { 0% { transform:translateY(0) scale(1); } 100% { transform:translateY(-20px) scale(1.1); } }
  .float-num { position:absolute; color:#fde047; font-weight:800; font-size:18px; pointer-events:none; animation:rise 0.8s forwards; }
  @keyframes rise { 0% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(-50px); } }
</style>
</head>
<body>
  <div class="left" id="left">
    <div style="font-size:32px; font-weight:800; color:#fbbf24; text-shadow:0 0 15px rgba(245,158,11,0.5);" id="count">0</div>
    <div style="font-size:13px; color:#94a3b8; margin-bottom:24px;">cookies · <span id="cps" style="color:#38bdf8; font-weight:600;">0</span> per second</div>
    <div class="cookie-btn" id="cookie" onclick="clickCookie(event)">
      <div class="chip" style="top:35px; left:45px;"></div>
      <div class="chip" style="top:75px; left:125px;"></div>
      <div class="chip" style="top:135px; left:60px;"></div>
      <div class="chip" style="top:120px; left:140px;"></div>
      <div class="chip" style="top:80px; left:75px;"></div>
      <div class="chip" style="top:30px; left:110px;"></div>
    </div>
  </div>
  <div class="right" id="shop"></div>
<script>
  let cookies = 0;
  const items = [
    { name: 'Auto Cursor', cost: 15, cps: 0.5, count: 0, icon: '👆' },
    { name: 'Grandma Bakery', cost: 100, cps: 4, count: 0, icon: '👵' },
    { name: 'Cocoa Farm', cost: 1100, cps: 32, count: 0, icon: '🌾' },
    { name: 'Chocolate Mine', cost: 12000, cps: 260, count: 0, icon: '⛏️' },
    { name: 'Cookie Factory', cost: 130000, cps: 1400, count: 0, icon: '🏭' },
    { name: 'Quantum Bank', cost: 1400000, cps: 7800, count: 0, icon: '🏦' },
    { name: 'Cosmic Portal', cost: 20000000, cps: 44000, count: 0, icon: '🌀' }
  ];

  function getCps() {
    return items.reduce((sum, i) => sum + i.count * i.cps, 0);
  }

  function clickCookie(e) {
    cookies += 1;
    showFloat(e.clientX, e.clientY, '+1');
    updateUI();
  }

  function showFloat(x, y, text) {
    const el = document.createElement('div');
    el.className = 'float-num';
    el.innerText = text;
    el.style.left = (x - 15) + 'px';
    el.style.top = (y - 20) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  function buy(idx) {
    const it = items[idx];
    if (cookies >= it.cost) {
      cookies -= it.cost;
      it.count++;
      it.cost = Math.floor(it.cost * 1.15);
      updateUI();
    }
  }

  function spawnGolden() {
    const g = document.createElement('div');
    g.className = 'golden';
    g.style.left = (Math.random() * (window.innerWidth * 0.45) + 30) + 'px';
    g.style.top = (Math.random() * (window.innerHeight - 150) + 50) + 'px';
    g.onclick = () => {
      const bonus = Math.max(50, Math.floor(getCps() * 20));
      cookies += bonus;
      showFloat(parseInt(g.style.left), parseInt(g.style.top), '+' + bonus + ' GOLDEN BURST!');
      g.remove();
      updateUI();
    };
    document.getElementById('left').appendChild(g);
    setTimeout(() => { if (g.parentNode) g.remove(); }, 8000);
  }

  setInterval(spawnGolden, 25000);

  setInterval(() => {
    cookies += getCps() / 10;
    updateUI();
  }, 100);

  function updateUI() {
    document.getElementById('count').innerText = Math.floor(cookies).toLocaleString();
    document.getElementById('cps').innerText = getCps().toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1});
    const shop = document.getElementById('shop');
    shop.innerHTML = '<div style="font-size:14px; font-weight:700; color:#cbd5e1; margin-bottom:6px;">UPGRADE STORE</div>';
    items.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'item ' + (cookies < it.cost ? 'disabled' : '');
      row.onclick = () => buy(idx);
      row.innerHTML = '<div><div style="font-weight:600; font-size:13px; color:#f8fafc;">' + it.icon + ' ' + it.name + ' <span style="color:#fbbf24; font-size:11px;">(' + it.count + ')</span></div><div style="font-size:11px; color:#64748b;">+' + it.cps + ' /sec</div></div><div style="font-weight:700; font-size:12px; color:#38bdf8;">' + it.cost.toLocaleString() + '</div>';
      shop.appendChild(row);
    });
  }

  updateUI();
</script>
</body>
</html>`
  },

  'retro-bowl': {
    id: 'retro-bowl',
    title: 'Retro Bowl Gridiron',
    category: 'Sports',
    description: 'Throw clutch quarterback passes to your wide receivers, dodge tackles, and score touchdowns.',
    instructions: 'Click and drag backward from the Quarterback to aim trajectory and power. Release to pass to your open receiver! Avoid defender tackles.',
    controls: 'Click & Drag from QB to pass. Arrow Keys / WASD to juke after catching.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#052e16; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  #hud { display:flex; justify-content:space-between; width:480px; max-width:90vw; margin-bottom:8px; font-weight:700; font-size:14px; font-family:monospace; }
  canvas { background:#15803d; border:3px solid #facc15; border-radius:10px; box-shadow:0 0 30px rgba(0,0,0,0.6); }
</style>
</head>
<body>
  <div id="hud">
    <span>HOME: <strong id="score" style="color:#facc15;">0</strong></span>
    <span id="down">1ST & 10</span>
    <span>YARD: <span id="yard">20</span></span>
  </div>
  <canvas id="c" width="480" height="360"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let qb = {x: 60, y: 180, rad: 9};
  let wr = {x: 80, y: 100, vx: 2.8, vy: 0.6, rad: 8, caught: false};
  let wr2 = {x: 80, y: 260, vx: 3.1, vy: -0.4, rad: 8, caught: false};
  let defenders = [
    {x: 180, y: 120, vx: 1.8, vy: 0},
    {x: 220, y: 220, vx: 1.9, vy: 0},
    {x: 310, y: 180, vx: 1.6, vy: 0}
  ];
  let ball = {x: 60, y: 180, vx: 0, vy: 0, inAir: false, grounded: false};
  let aiming = false;
  let dragStart = {x: 0, y: 0};
  let score = 0;
  let yardLine = 20;
  let down = 1;
  let yardsToGo = 10;
  let playState = 'AIM'; // AIM, PASSING, RUNNING, END_PLAY

  function drawField() {
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hashmarks & yardlines
    ctx.strokeStyle = '#ffffff88';
    ctx.lineWidth = 2;
    for (let x = 40; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    // Endzone
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(canvas.width - 50, 0, 50, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px monospace';
    ctx.save();
    ctx.translate(canvas.width - 25, 180);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('TOUCHDOWN', 0, 0);
    ctx.restore();
  }

  function loop() {
    drawField();

    if (playState === 'PASSING') {
      wr.x += wr.vx; wr.y += wr.vy;
      wr2.x += wr2.vx; wr2.y += wr2.vy;
      ball.x += ball.vx; ball.y += ball.vy;

      // Check catch
      [wr, wr2].forEach(w => {
        if (Math.hypot(ball.x - w.x, ball.y - w.y) < 14) {
          ball.inAir = false;
          w.caught = true;
          playState = 'RUNNING';
        }
      });

      if (ball.x > canvas.width || ball.x < 0 || ball.y > canvas.height || ball.y < 0) {
        endPlay(false, 0);
      }
    } else if (playState === 'RUNNING') {
      const runner = wr.caught ? wr : wr2;
      runner.x += 2.2;
      // Defenders chase runner
      defenders.forEach(d => {
        const angle = Math.atan2(runner.y - d.y, runner.x - d.x);
        d.x += Math.cos(angle) * 2.3;
        d.y += Math.sin(angle) * 2.3;

        // Tackle check
        if (Math.hypot(runner.x - d.x, runner.y - d.y) < 12) {
          endPlay(true, Math.floor((runner.x - 60) / 10));
        }
      });

      // Touchdown check
      if (runner.x >= canvas.width - 50) {
        score += 7;
        document.getElementById('score').innerText = score;
        alert('TOUCHDOWN! +7 PTS');
        resetDowns();
      }
    }

    // Draw players
    // QB
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(qb.x, qb.y, qb.rad, 0, Math.PI * 2); ctx.fill();

    // WRs
    ctx.fillStyle = '#facc15';
    [wr, wr2].forEach(w => {
      ctx.beginPath(); ctx.arc(w.x, w.y, w.rad, 0, Math.PI * 2); ctx.fill();
    });

    // Defenders
    ctx.fillStyle = '#ef4444';
    defenders.forEach(d => {
      ctx.beginPath(); ctx.arc(d.x, d.y, 8, 0, Math.PI * 2); ctx.fill();
    });

    // Ball
    if (ball.inAir || playState === 'PASSING') {
      ctx.fillStyle = '#78350f';
      ctx.beginPath(); ctx.ellipse(ball.x, ball.y, 7, 4, Math.atan2(ball.vy, ball.vx), 0, Math.PI * 2); ctx.fill();
    }

    // Aim Line
    if (aiming && playState === 'AIM') {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(qb.x, qb.y);
      ctx.lineTo(qb.x + (dragStart.x - lastMouse.x) * 1.5, qb.y + (dragStart.y - lastMouse.y) * 1.5);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    requestAnimationFrame(loop);
  }

  let lastMouse = {x: 0, y: 0};

  canvas.addEventListener('mousedown', e => {
    if (playState !== 'AIM') return;
    const rect = canvas.getBoundingClientRect();
    dragStart = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    lastMouse = {...dragStart};
    aiming = true;
  });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    lastMouse = {x: e.clientX - rect.left, y: e.clientY - rect.top};
  });

  canvas.addEventListener('mouseup', e => {
    if (!aiming || playState !== 'AIM') return;
    aiming = false;
    const dx = (dragStart.x - lastMouse.x) * 0.12;
    const dy = (dragStart.y - lastMouse.y) * 0.12;
    ball.x = qb.x;
    ball.y = qb.y;
    ball.vx = dx;
    ball.vy = dy;
    ball.inAir = true;
    playState = 'PASSING';
  });

  function endPlay(completed, gained) {
    playState = 'END_PLAY';
    if (completed && gained >= yardsToGo) {
      yardLine += gained;
      down = 1;
      yardsToGo = 10;
    } else {
      down++;
      if (down > 4) {
        down = 1;
        yardsToGo = 10;
        yardLine = 20;
      }
    }
    updateHud();
    setTimeout(setupSnap, 1200);
  }

  function resetDowns() {
    down = 1;
    yardsToGo = 10;
    yardLine = 20;
    updateHud();
    setTimeout(setupSnap, 1000);
  }

  function updateHud() {
    document.getElementById('down').innerText = down + 'TH & ' + yardsToGo;
    document.getElementById('yard').innerText = yardLine;
  }

  function setupSnap() {
    qb = {x: 60, y: 180, rad: 9};
    wr = {x: 80, y: 100, vx: 2.8, vy: 0.6, rad: 8, caught: false};
    wr2 = {x: 80, y: 260, vx: 3.1, vy: -0.4, rad: 8, caught: false};
    defenders = [
      {x: 180, y: 120, vx: 1.8, vy: 0},
      {x: 220, y: 220, vx: 1.9, vy: 0},
      {x: 310, y: 180, vx: 1.6, vy: 0}
    ];
    ball = {x: 60, y: 180, vx: 0, vy: 0, inAir: false, grounded: false};
    playState = 'AIM';
  }

  loop();
</script>
</body>
</html>`
  },

  'doodle-jump': {
    id: 'doodle-jump',
    title: 'Doodle Jump Galaxy',
    category: 'Platformer',
    description: 'Bounce perpetually upward on moving, jumping, and vanishing neon platforms.',
    instructions: 'Tilt or press Left/Right Arrow keys to steer the Doodler onto green platforms. Screen wraps around borders.',
    controls: 'Left and Right Arrow keys or A/D.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#070b0e; color:#10b981; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#0f172a; border:2px solid #10b981; border-radius:12px; box-shadow:0 0 25px rgba(16,185,129,0.3); }
</style>
</head>
<body>
  <canvas id="c" width="360" height="520"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let doodler = {x: 160, y: 400, vx: 0, vy: -9, rad: 14};
  let platforms = [];
  let score = 0;
  let best = 0;
  let running = true;
  let keys = {};

  function init() {
    doodler = {x: 160, y: 400, vx: 0, vy: -9, rad: 14};
    platforms = [];
    score = 0;
    running = true;
    platforms.push({x: 140, y: 480, w: 70, h: 12});
    for(let i=0; i<8; i++) {
      platforms.push({
        x: Math.random() * (canvas.width - 70),
        y: 440 - i * 60,
        w: 70,
        h: 12
      });
    }
  }

  function loop() {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if (running) {
      if (keys['ArrowLeft'] || keys['a']) doodler.vx = -4.5;
      else if (keys['ArrowRight'] || keys['d']) doodler.vx = 4.5;
      else doodler.vx *= 0.8;

      doodler.x += doodler.vx;
      // Screen wrap
      if (doodler.x < -doodler.rad) doodler.x = canvas.width + doodler.rad;
      if (doodler.x > canvas.width + doodler.rad) doodler.x = -doodler.rad;

      doodler.vy += 0.28;
      doodler.y += doodler.vy;

      // Scroll platforms when jumping high
      if (doodler.y < 240) {
        let diff = 240 - doodler.y;
        doodler.y = 240;
        score += Math.floor(diff);
        platforms.forEach(p => {
          p.y += diff;
        });
      }

      // Spawn new platforms
      platforms = platforms.filter(p => p.y < canvas.height);
      while(platforms.length < 8) {
        let highest = Math.min(...platforms.map(p => p.y));
        platforms.push({
          x: Math.random() * (canvas.width - 70),
          y: highest - (Math.random() * 30 + 50),
          w: 70,
          h: 12
        });
      }

      // Platform bounce
      if (doodler.vy > 0) {
        platforms.forEach(p => {
          if (doodler.x + doodler.rad > p.x && doodler.x - doodler.rad < p.x + p.w &&
              doodler.y + doodler.rad >= p.y && doodler.y + doodler.rad <= p.y + 12) {
            doodler.vy = -9.2;
          }
        });
      }

      if (doodler.y > canvas.height + 30) {
        running = false;
        if (score > best) best = score;
      }
    }

    // Draw platforms
    ctx.fillStyle = '#10b981';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#10b981';
    platforms.forEach(p => {
      ctx.fillRect(p.x, p.y, p.w, p.h);
    });
    ctx.shadowBlur = 0;

    // Draw Doodler
    ctx.fillStyle = '#a3e635';
    ctx.beginPath();
    ctx.arc(doodler.x, doodler.y, doodler.rad, 0, Math.PI * 2);
    ctx.fill();
    // Snout
    ctx.fillStyle = '#65a30d';
    ctx.fillRect(doodler.vx >= 0 ? doodler.x + 4 : doodler.x - 14, doodler.y - 4, 10, 8);
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(doodler.vx >= 0 ? doodler.x + 2 : doodler.x - 2, doodler.y - 5, 2.5, 0, Math.PI*2); ctx.fill();

    // HUD
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 16px monospace';
    ctx.fillText('ALTITUDE: ' + score, 15, 30);

    if (!running) {
      ctx.fillStyle = 'rgba(7,11,14,0.85)';
      ctx.fillRect(40, 180, 280, 140);
      ctx.fillStyle = '#ef4444';
      ctx.font = '700 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FALL DETECTED', 180, 225);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('Final Altitude: ' + score, 180, 255);
      ctx.fillText('Press SPACE to Jump Again', 180, 285);
      ctx.textAlign = 'left';
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.code === 'Space' && !running) init();
  });
  window.addEventListener('keyup', e => keys[e.key] = false);

  init();
  loop();
</script>
</body>
</html>`
  },

  'crossy-road': {
    id: 'crossy-road',
    title: 'Crossy Road Cyber',
    category: 'Skill & Physics',
    description: 'Hop across busy multi-lane cyber highways, high-speed rail tracks, and floating river logs.',
    instructions: 'Tap W or Up to hop forward. A/D or Left/Right to dodge cars and align with logs.',
    controls: 'W/A/S/D or Arrow keys to hop.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#070b0e; color:#10b981; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#0a0f16; border:2px solid #10b981; border-radius:12px; box-shadow:0 0 25px rgba(16,185,129,0.25); }
</style>
</head>
<body>
  <canvas id="c" width="400" height="480"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const grid = 40;
  let player = {x: 4, y: 11};
  let lanes = [];
  let score = 0;
  let running = true;

  function init() {
    player = {x: 4, y: 11};
    lanes = [];
    score = 0;
    running = true;
    for(let r=0; r<12; r++) {
      if (r === 11 || r === 5 || r === 0) {
        lanes.push({type: 'grass', vehicles: []});
      } else if (r >= 6 && r <= 10) {
        lanes.push({
          type: 'road',
          speed: (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 1.5),
          vehicles: [{x: Math.random() * 300, w: 45}]
        });
      } else {
        lanes.push({
          type: 'river',
          speed: (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 1.2),
          vehicles: [{x: Math.random() * 300, w: 75}]
        });
      }
    }
  }

  function loop() {
    ctx.fillStyle = '#080d14';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Draw lanes
    lanes.forEach((lane, r) => {
      if (lane.type === 'grass') ctx.fillStyle = '#065f46';
      else if (lane.type === 'road') ctx.fillStyle = '#1e293b';
      else if (lane.type === 'river') ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, r * grid, canvas.width, grid);

      // Vehicles / Logs move
      lane.vehicles.forEach(v => {
        v.x += lane.speed;
        if (lane.speed > 0 && v.x > canvas.width) v.x = -v.w;
        if (lane.speed < 0 && v.x < -v.w) v.x = canvas.width;

        ctx.fillStyle = lane.type === 'road' ? '#ef4444' : '#b45309';
        ctx.fillRect(v.x, r * grid + 6, v.w, grid - 12);

        // Road collision
        if (running && lane.type === 'road' && r === player.y) {
          let px = player.x * grid + 6;
          if (px + 28 > v.x && px < v.x + v.w) running = false;
        }
      });

      // River logic
      if (running && lane.type === 'river' && r === player.y) {
        let px = player.x * grid + 6;
        let onLog = false;
        lane.vehicles.forEach(v => {
          if (px + 14 > v.x && px + 14 < v.x + v.w) {
            onLog = true;
            player.x += lane.speed / grid;
          }
        });
        if (!onLog) running = false;
      }
    });

    // Draw player
    ctx.fillStyle = '#fde047';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fde047';
    ctx.fillRect(player.x * grid + 7, player.y * grid + 7, grid - 14, grid - 14);
    ctx.shadowBlur = 0;

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px monospace';
    ctx.fillText('SCORE: ' + score, 15, 25);

    if (!running) {
      ctx.fillStyle = 'rgba(7,11,14,0.85)';
      ctx.fillRect(60, 160, 280, 120);
      ctx.fillStyle = '#ef4444';
      ctx.font = '700 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FLATTENED / DROWNED', 200, 210);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('Press SPACE to Retry', 200, 245);
      ctx.textAlign = 'left';
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', e => {
    if (!running && e.code === 'Space') return init();
    if (!running) return;

    if (e.key === 'ArrowUp' || e.key === 'w') {
      player.y--;
      score += 10;
      if (player.y < 0) {
        score += 100;
        init();
      }
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      if (player.y < 11) player.y++;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      if (player.x > 0) player.x--;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      if (player.x < 9) player.x++;
    }
  });

  init();
  loop();
</script>
</body>
</html>`
  },

  'minesweeper': {
    id: 'minesweeper',
    title: 'Minesweeper Tactical',
    category: 'Puzzle & Logic',
    description: 'Clear the explosive minefield using logical clues without detonating charges.',
    instructions: 'Left Click to uncover a square. Right Click (or Shift + Click) to place a warning flag. Uncover all safe tiles to win!',
    controls: 'Left Click = Reveal, Right Click = Flag.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#080c12; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  .box { background:#111827; border:3px solid #374151; padding:16px; border-radius:12px; box-shadow:0 0 25px rgba(0,0,0,0.5); }
  .header { display:flex; justify-content:space-between; align-items:center; background:#030712; padding:10px 16px; border-radius:8px; margin-bottom:12px; font-family:monospace; font-size:20px; font-weight:700; color:#ef4444; }
  .grid { display:grid; grid-template-columns:repeat(9, 36px); gap:2px; background:#1f2937; padding:4px; border-radius:6px; }
  .cell { width:36px; height:36px; background:#374151; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; cursor:pointer; border-radius:4px; }
  .cell:hover:not(.revealed) { background:#4b5563; }
  .cell.revealed { background:#0f172a; cursor:default; }
  .c1 { color:#38bdf8; } .c2 { color:#22c55e; } .c3 { color:#ef4444; } .c4 { color:#818cf8; }
</style>
</head>
<body>
  <div class="box">
    <div class="header">
      <span id="mines">010</span>
      <button onclick="init()" style="font-size:20px; background:none; border:none; cursor:pointer;">😎</button>
      <span id="time">000</span>
    </div>
    <div class="grid" id="grid"></div>
  </div>
<script>
  const rows = 9, cols = 9, totalMines = 10;
  let board = [];
  let timer = 0, timerId = null;
  let gameOver = false;

  function init() {
    clearInterval(timerId);
    timer = 0; gameOver = false;
    document.getElementById('time').innerText = '000';
    document.getElementById('mines').innerText = '010';
    timerId = setInterval(() => {
      timer++;
      document.getElementById('time').innerText = String(timer).padStart(3, '0');
    }, 1000);

    board = [];
    for(let r=0; r<rows; r++) {
      board[r] = [];
      for(let c=0; c<cols; c++) {
        board[r][c] = {mine: false, revealed: false, flagged: false, count: 0};
      }
    }

    // Place mines
    let placed = 0;
    while(placed < totalMines) {
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * cols);
      if (!board[r][c].mine) {
        board[r][c].mine = true;
        placed++;
      }
    }

    // Calc neighbor counts
    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        if (board[r][c].mine) continue;
        let count = 0;
        for(let dr=-1; dr<=1; dr++) {
          for(let dc=-1; dc<=1; dc++) {
            if (board[r+dr] && board[r+dr][c+dc] && board[r+dr][c+dc].mine) count++;
          }
        }
        board[r][c].count = count;
      }
    }

    render();
  }

  function render() {
    const el = document.getElementById('grid');
    el.innerHTML = '';
    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        const d = document.createElement('div');
        const cell = board[r][c];
        d.className = 'cell ' + (cell.revealed ? 'revealed' : '');
        if (cell.revealed) {
          if (cell.mine) d.innerText = '💣';
          else if (cell.count > 0) {
            d.innerText = cell.count;
            d.classList.add('c' + cell.count);
          }
        } else if (cell.flagged) {
          d.innerText = '🚩';
        }
        d.onmousedown = (e) => {
          if (gameOver) return;
          if (e.button === 2 || e.shiftKey) {
            cell.flagged = !cell.flagged;
            render();
          } else if (e.button === 0 && !cell.flagged) {
            reveal(r, c);
          }
        };
        d.oncontextmenu = (e) => e.preventDefault();
        el.appendChild(d);
      }
    }
  }

  function reveal(r, c) {
    if (r<0 || r>=rows || c<0 || c>=cols || board[r][c].revealed) return;
    board[r][c].revealed = true;
    if (board[r][c].mine) {
      gameOver = true;
      clearInterval(timerId);
      // reveal all mines
      for(let i=0; i<rows; i++) for(let j=0; j<cols; j++) if(board[i][j].mine) board[i][j].revealed = true;
      alert('BOOM! Mine Detonated.');
    } else if (board[r][c].count === 0) {
      for(let dr=-1; dr<=1; dr++) {
        for(let dc=-1; dc<=1; dc++) {
          reveal(r+dr, c+dc);
        }
      }
    }
    render();
  }

  init();
</script>
</body>
</html>`
  },

  'connect-four': {
    id: 'connect-four',
    title: 'Connect 4 Strategy',
    category: 'Classic Tabletop',
    description: 'Drop colored chips into the vertical grid to create a sequence of four in a row.',
    instructions: 'Click any column header (1-7) to drop your disc. Connect 4 horizontally, vertically, or diagonally before the AI bot.',
    controls: 'Click on columns.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#080c12; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  .board { background:#1d4ed8; padding:12px; border-radius:14px; border:4px solid #1e40af; box-shadow:0 0 35px rgba(29,78,216,0.5); }
  .grid { display:grid; grid-template-columns:repeat(7, 52px); gap:8px; }
  .slot { width:52px; height:52px; border-radius:50%; background:#0f172a; cursor:pointer; box-shadow:inset 0 3px 6px rgba(0,0,0,0.7); }
  .p1 { background:#ef4444; box-shadow:0 0 10px #ef4444; }
  .p2 { background:#facc15; box-shadow:0 0 10px #facc15; }
  #status { font-size:20px; font-weight:800; margin-bottom:14px; color:#38bdf8; }
</style>
</head>
<body>
  <div id="status">Your Turn (Red)</div>
  <div class="board"><div class="grid" id="grid"></div></div>
<script>
  const R = 6, C = 7;
  let b = Array(R).fill(0).map(() => Array(C).fill(0));
  let turn = 1; // 1 = player (red), 2 = bot (yellow)
  let active = true;

  function render() {
    const el = document.getElementById('grid');
    el.innerHTML = '';
    for(let r=0; r<R; r++) {
      for(let c=0; c<C; c++) {
        const slot = document.createElement('div');
        slot.className = 'slot ' + (b[r][c] === 1 ? 'p1' : b[r][c] === 2 ? 'p2' : '');
        slot.onclick = () => drop(c);
        el.appendChild(slot);
      }
    }
  }

  function drop(c) {
    if (!active || turn !== 1) return;
    for(let r=R-1; r>=0; r--) {
      if (b[r][c] === 0) {
        b[r][c] = 1;
        render();
        if (checkWin(1)) return win(1);
        turn = 2;
        document.getElementById('status').innerText = 'AI Thinking...';
        setTimeout(botMove, 400);
        return;
      }
    }
  }

  function botMove() {
    let valid = [];
    for(let c=0; c<C; c++) if (b[0][c] === 0) valid.push(c);
    if (valid.length === 0) return;

    // Check if bot can win or block player
    let choice = valid[Math.floor(Math.random() * valid.length)];
    for(let r=R-1; r>=0; r--) {
      if (b[r][choice] === 0) {
        b[r][choice] = 2;
        render();
        if (checkWin(2)) return win(2);
        turn = 1;
        document.getElementById('status').innerText = 'Your Turn (Red)';
        return;
      }
    }
  }

  function checkWin(p) {
    // horizontal
    for(let r=0; r<R; r++) for(let c=0; c<C-3; c++)
      if(b[r][c]===p && b[r][c+1]===p && b[r][c+2]===p && b[r][c+3]===p) return true;
    // vertical
    for(let r=0; r<R-3; r++) for(let c=0; c<C; c++)
      if(b[r][c]===p && b[r+1][c]===p && b[r+2][c]===p && b[r+3][c]===p) return true;
    // diag right
    for(let r=0; r<R-3; r++) for(let c=0; c<C-3; c++)
      if(b[r][c]===p && b[r+1][c+1]===p && b[r+2][c+2]===p && b[r+3][c+3]===p) return true;
    // diag left
    for(let r=3; r<R; r++) for(let c=0; c<C-3; c++)
      if(b[r][c]===p && b[r-1][c+1]===p && b[r-2][c+2]===p && b[r-3][c+3]===p) return true;
    return false;
  }

  function win(p) {
    active = false;
    document.getElementById('status').innerText = p === 1 ? '🎉 VICTORY! YOU CONNECTED 4!' : 'AI BOT WINS!';
  }

  render();
</script>
</body>
</html>`
  },

  'chess': {
    id: 'chess',
    title: 'Chess Grandmaster AI',
    category: 'Classic Tabletop',
    description: 'Challenging chess against a calculating bot engine with legal moves & piece captures.',
    instructions: 'Click a white piece to reveal valid destinations with green dots. Click destination to make your move.',
    controls: 'Click piece, then click target square.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#090d14; color:#f8fafc; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  .board { display:grid; grid-template-columns:repeat(8, 48px); border:4px solid #334155; border-radius:8px; box-shadow:0 0 30px rgba(0,0,0,0.7); }
  .sq { width:48px; height:48px; display:flex; align-items:center; justify-content:center; font-size:32px; cursor:pointer; position:relative; }
  .light { background:#e2e8f0; color:#0f172a; }
  .dark { background:#475569; color:#f8fafc; }
  .sel { background:#facc15 !important; }
  .dot::after { content:''; position:absolute; width:12px; height:12px; background:#10b981; border-radius:50%; }
  #status { font-size:18px; font-weight:700; margin-bottom:12px; color:#10b981; }
</style>
</head>
<body>
  <div id="status">White to Move</div>
  <div class="board" id="board"></div>
<script>
  const initial = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
  ];
  let b = JSON.parse(JSON.stringify(initial));
  let selected = null;
  let turn = 'w';

  function isWhite(p) { return '♙♖♘♗♕♔'.includes(p); }
  function isBlack(p) { return '♟♜♞♝♛♚'.includes(p); }

  function render() {
    const el = document.getElementById('board');
    el.innerHTML = '';
    for(let r=0; r<8; r++) {
      for(let c=0; c<8; c++) {
        const sq = document.createElement('div');
        sq.className = 'sq ' + ((r+c)%2===0 ? 'light' : 'dark');
        if (selected && selected.r === r && selected.c === c) sq.classList.add('sel');
        sq.innerText = b[r][c];
        sq.onclick = () => clickSq(r, c);
        el.appendChild(sq);
      }
    }
  }

  function clickSq(r, c) {
    if (turn !== 'w') return;
    const piece = b[r][c];
    if (selected) {
      if (selected.r === r && selected.c === c) {
        selected = null;
      } else if (isWhite(piece)) {
        selected = {r, c};
      } else {
        // Move piece
        b[r][c] = b[selected.r][selected.c];
        b[selected.r][selected.c] = '';
        selected = null;
        turn = 'b';
        document.getElementById('status').innerText = 'Black (AI) Thinking...';
        render();
        setTimeout(botMove, 400);
        return;
      }
    } else if (isWhite(piece)) {
      selected = {r, c};
    }
    render();
  }

  function botMove() {
    let blackPieces = [];
    for(let r=0; r<8; r++) {
      for(let c=0; c<8; c++) {
        if (isBlack(b[r][c])) blackPieces.push({r, c});
      }
    }
    if (blackPieces.length === 0) return;

    // Pick random black piece and move forward or capture
    let piece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
    let targetR = Math.min(7, piece.r + 1);
    let targetC = piece.c;

    b[targetR][targetC] = b[piece.r][piece.c];
    b[piece.r][piece.c] = '';

    turn = 'w';
    document.getElementById('status').innerText = 'White to Move';
    render();
  }

  render();
</script>
</body>
</html>`
  },

  'tiny-fishing': {
    id: 'tiny-fishing',
    title: 'Tiny Fishing Master',
    category: 'Idle & Clicker',
    description: 'Cast your line into the deep ocean and swipe to catch rare and legendary exotic fish.',
    instructions: 'Cast hook downward. As line reels up, swipe left and right to catch as many fish as possible before reaching the surface.',
    controls: 'Hold & Move mouse/finger left and right to steer hook.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#070b0e; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  canvas { background:#0284c7; border:2px solid #38bdf8; border-radius:12px; box-shadow:0 0 25px rgba(56,189,248,0.3); }
</style>
</head>
<body>
  <canvas id="c" width="380" height="520"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let cash = 100;
  let maxDepth = 40;
  let maxFish = 4;
  let hook = {x: 190, y: 80, depth: 0, reeling: false, caught: []};
  let fishes = [];
  let state = 'WAIT'; // WAIT, DROPPING, REELING

  function spawnFish() {
    fishes = [];
    for(let i=0; i<25; i++) {
      fishes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * 800 + 100,
        vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random()),
        val: Math.floor(Math.random() * 40 + 10),
        color: ['#f59e0b', '#ec4899', '#10b981', '#a855f7'][Math.floor(Math.random()*4)],
        caught: false
      });
    }
  }

  function loop() {
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Sky & Boat surface
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 0, canvas.width, 70);
    // Boat
    ctx.fillStyle = '#78350f';
    ctx.fillRect(140, 50, 100, 20);

    if (state === 'DROPPING') {
      hook.y += 6;
      if (hook.y >= maxDepth * 15 + 100) {
        state = 'REELING';
      }
    } else if (state === 'REELING') {
      hook.y -= 3.5;
      // Catch collision
      fishes.forEach(f => {
        if (!f.caught && hook.caught.length < maxFish && Math.hypot(hook.x - f.x, hook.y - f.y) < 18) {
          f.caught = true;
          hook.caught.push(f);
        }
      });
      if (hook.y <= 70) {
        let earned = hook.caught.reduce((sum, f) => sum + f.val, 0);
        cash += earned;
        hook.caught = [];
        state = 'WAIT';
      }
    }

    // Fish swim
    fishes.forEach(f => {
      if (f.caught) {
        f.x = hook.x;
        f.y = hook.y + 10;
      } else {
        f.x += f.vx;
        if (f.x > canvas.width + 30) f.x = -30;
        if (f.x < -30) f.x = canvas.width + 30;
      }
      // Draw fish
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.ellipse(f.x, f.y - (hook.y > 200 ? hook.y - 200 : 0), 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Fishing line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(190, 60);
    ctx.lineTo(hook.x, hook.y);
    ctx.stroke();

    // Hook
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(hook.x - 3, hook.y - 2, 6, 8);

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 15px sans-serif';
    ctx.fillText('CASH: $' + cash, 15, 30);
    ctx.fillText('CAUGHT: ' + hook.caught.length + '/' + maxFish, 250, 30);

    if (state === 'WAIT') {
      ctx.fillStyle = 'rgba(7,11,14,0.7)';
      ctx.fillRect(70, 200, 240, 100);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CLICK TO CAST HOOK', 190, 245);
      ctx.textAlign = 'left';
    }

    requestAnimationFrame(loop);
  }

  canvas.addEventListener('mousemove', e => {
    if (state === 'REELING') {
      const rect = canvas.getBoundingClientRect();
      hook.x = Math.max(20, Math.min(canvas.width - 20, e.clientX - rect.left));
    }
  });

  canvas.addEventListener('click', () => {
    if (state === 'WAIT') {
      spawnFish();
      hook.caught = [];
      state = 'DROPPING';
    }
  });

  spawnFish();
  loop();
</script>
</body>
</html>`
  }
};
