import { BuiltinGame } from './embeddedGames';

export const MORE_ENGINES: Record<string, BuiltinGame> = {
  'basket-random': {
    id: 'basket-random',
    title: 'Basket Random & Basketball Stars',
    category: 'Sports',
    description: 'Aim, shoot, and sink physics-based jump shots and 3-pointers into the basketball hoop.',
    instructions: 'Press Space or Click to leap and shoot the basketball. Time your shot release at the peak of the jump to sink swishes.',
    controls: 'Spacebar or Click to jump & shoot.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#070b0e; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  canvas { background:#b45309; border:3px solid #f97316; border-radius:12px; box-shadow:0 0 30px rgba(249,115,22,0.3); }
</style>
</head>
<body>
  <canvas id="c" width="480" height="340"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let p = {x: 80, y: 240, vy: 0, grounded: true, hasBall: true};
  let ball = {x: 80, y: 220, vx: 0, vy: 0, shot: false};
  let rim = {x: 400, y: 150, w: 35};
  let score = 0;
  let streak = 0;

  function loop() {
    // Court
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Floor
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(0, 270, canvas.width, 70);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 270); ctx.lineTo(canvas.width, 270); ctx.stroke();

    // Hoop backboard & rim
    ctx.fillStyle = '#fff';
    ctx.fillRect(435, 100, 8, 90);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(rim.x, rim.y, rim.w, 5); // rim
    // Net
    ctx.strokeStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(rim.x, rim.y);
    ctx.lineTo(rim.x + 8, rim.y + 25);
    ctx.lineTo(rim.x + rim.w - 8, rim.y + 25);
    ctx.lineTo(rim.x + rim.w, rim.y);
    ctx.stroke();

    // Player physics
    p.vy += 0.8;
    p.y += p.vy;
    if (p.y >= 240) {
      p.y = 240; p.vy = 0; p.grounded = true;
    }

    // Ball physics
    if (!ball.shot) {
      ball.x = p.x + 14;
      ball.y = p.y - 18;
    } else {
      ball.vx *= 0.99;
      ball.vy += 0.45;
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Rim collision & swish check
      if (ball.x > rim.x && ball.x < rim.x + rim.w && ball.y >= rim.y && ball.y <= rim.y + 12 && ball.vy > 0) {
        score += 2;
        streak++;
        resetBall();
      }

      // Ground bounce
      if (ball.y > 260) {
        ball.y = 260;
        ball.vy *= -0.6;
        if (Math.abs(ball.vy) < 1) resetBall();
      }
    }

    // Draw Player
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(p.x, p.y - 30, 16, 30);
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(p.x + 8, p.y - 38, 8, 0, Math.PI * 2); ctx.fill();

    // Draw Basketball
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
    ctx.stroke();

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 18px monospace';
    ctx.fillText('SCORE: ' + score, 20, 35);
    ctx.fillText('STREAK: ' + streak, 20, 60);

    requestAnimationFrame(loop);
  }

  function shoot() {
    if (p.grounded) {
      p.vy = -12;
      p.grounded = false;
      setTimeout(() => {
        if (!ball.shot) {
          ball.shot = true;
          ball.vx = 7.5;
          ball.vy = -9.5;
        }
      }, 220);
    }
  }

  function resetBall() {
    setTimeout(() => {
      ball.shot = false;
    }, 400);
  }

  window.addEventListener('keydown', e => {
    if (e.code === 'Space') shoot();
  });
  canvas.addEventListener('click', shoot);

  loop();
</script>
</body>
</html>`
  },

  'geometry-dash': {
    id: 'geometry-dash',
    title: 'Geometry Dash Neon',
    category: 'Platformer',
    description: 'Jump through dangerous geometric spikes and jump pads in sync with intense rhythms.',
    instructions: 'Tap Space or Click to jump. Clear hazardous triangle spikes and make it to 100% completion.',
    controls: 'Spacebar or Left Click to jump.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#070b0e; color:#10b981; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  canvas { background:#1e1b4b; border:2px solid #8b5cf6; border-radius:12px; box-shadow:0 0 30px rgba(139,92,246,0.3); }
</style>
</head>
<body>
  <canvas id="c" width="460" height="280"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let player = {x: 60, y: 190, vy: 0, rot: 0, grounded: true};
  let spikes = [];
  let score = 0;
  let running = true;
  let speed = 5.2;

  function init() {
    player = {x: 60, y: 190, vy: 0, rot: 0, grounded: true};
    spikes = [];
    score = 0;
    running = true;
    for(let i=1; i<20; i++) {
      spikes.push({
        x: 400 + i * (140 + Math.random() * 80),
        w: 24,
        h: 26
      });
    }
  }

  function loop() {
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Floor
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(0, 216, canvas.width, 64);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 216); ctx.lineTo(canvas.width, 216); ctx.stroke();

    if (running) {
      score += 0.2;
      player.vy += 0.9;
      player.y += player.vy;
      if (!player.grounded) player.rot += 0.12;
      else player.rot = 0;

      if (player.y >= 190) {
        player.y = 190;
        player.vy = 0;
        player.grounded = true;
      }

      // Spikes
      spikes.forEach(s => {
        s.x -= speed;

        // Collision check
        if (s.x > player.x - 12 && s.x < player.x + 22 && player.y + 24 > 216 - s.h) {
          running = false;
        }

        // Draw Spike
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(s.x, 216);
        ctx.lineTo(s.x + s.w/2, 216 - s.h);
        ctx.lineTo(s.x + s.w, 216);
        ctx.fill();
      });
    }

    // Draw Player Cube
    ctx.save();
    ctx.translate(player.x + 13, player.y + 13);
    ctx.rotate(player.rot);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-13, -13, 26, 26);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-6, -6, 12, 12);
    ctx.fillStyle = '#000';
    ctx.fillRect(-2, -2, 4, 4);
    ctx.restore();

    // Progress bar
    let pct = Math.min(100, Math.floor(score));
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(20, 20, (canvas.width - 40) * (pct / 100), 8);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(20, 20, canvas.width - 40, 8);
    ctx.fillStyle = '#fff';
    ctx.font = '700 12px monospace';
    ctx.fillText(pct + '%', canvas.width / 2 - 10, 16);

    if (!running) {
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.fillRect(80, 80, 300, 120);
      ctx.fillStyle = '#ef4444';
      ctx.font = '700 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CRASHED! ' + pct + '%', canvas.width/2, 125);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('Press SPACE to Restart', canvas.width/2, 160);
      ctx.textAlign = 'left';
    }

    requestAnimationFrame(loop);
  }

  function jump() {
    if (running && player.grounded) {
      player.vy = -13.5;
      player.grounded = false;
    } else if (!running) {
      init();
    }
  }

  window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      e.preventDefault();
      jump();
    }
  });
  canvas.addEventListener('click', jump);

  init();
  loop();
</script>
</body>
</html>`
  },

  'subway-surfers': {
    id: 'subway-surfers',
    title: 'Subway Surfers London',
    category: 'Platformer',
    description: 'Sprint through 3 railway tracks, dodge trains and road blocks, and snatch gold coins.',
    instructions: 'Use A/D or Left/Right arrows to switch lanes. Use W or Up arrow to jump over barriers. S or Down arrow to slide.',
    controls: 'Left/Right = Change Lane, Up = Jump, Down = Slide.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#070b0e; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  canvas { background:#0f172a; border:2px solid #38bdf8; border-radius:12px; box-shadow:0 0 25px rgba(56,189,248,0.3); }
</style>
</head>
<body>
  <canvas id="c" width="380" height="520"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const lanes = [100, 190, 280];
  let currentLane = 1;
  let player = {x: 190, y: 440, vy: 0, jumping: false, sliding: false};
  let obstacles = [];
  let coins = [];
  let score = 0;
  let speed = 6;
  let running = true;

  function init() {
    currentLane = 1;
    player = {x: 190, y: 440, vy: 0, jumping: false, sliding: false};
    obstacles = [];
    coins = [];
    score = 0;
    running = true;
  }

  function loop() {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // 3 Railway Lanes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(145, 0); ctx.lineTo(145, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(235, 0); ctx.lineTo(235, canvas.height); ctx.stroke();

    // Track Ties
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    let offset = (score * 8) % 40;
    for(let y=offset; y<canvas.height; y+=40) {
      ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(320, y); ctx.stroke();
    }

    if (running) {
      score += 1;
      // Lane easing
      player.x += (lanes[currentLane] - player.x) * 0.25;

      // Jump physics
      if (player.jumping) {
        player.vy += 0.8;
        player.y += player.vy;
        if (player.y >= 440) {
          player.y = 440; player.jumping = false; player.vy = 0;
        }
      }

      // Spawning
      if (Math.random() < 0.035) {
        let laneIdx = Math.floor(Math.random() * 3);
        obstacles.push({
          x: lanes[laneIdx] - 25,
          y: -80,
          w: 50,
          h: 40,
          lane: laneIdx
        });
      }

      // Obstacles update
      for(let i=obstacles.length-1; i>=0; i--) {
        let o = obstacles[i];
        o.y += speed;

        // Collision
        if (o.lane === currentLane && o.y > 400 && o.y < 460 && !player.jumping) {
          running = false;
        }

        // Draw obstacle (train/barrier)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(o.x + 5, o.y + 10, o.w - 10, 10);

        if (o.y > canvas.height + 60) obstacles.splice(i, 1);
      }
    }

    // Draw Player
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(player.x - 14, player.y - (player.sliding ? 15 : 30), 28, player.sliding ? 15 : 30);
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(player.x, player.y - (player.sliding ? 22 : 38), 8, 0, Math.PI*2); ctx.fill();

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '700 16px monospace';
    ctx.fillText('METERS: ' + score, 20, 30);

    if (!running) {
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.fillRect(50, 180, 280, 120);
      ctx.fillStyle = '#ef4444';
      ctx.font = '700 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BUSTED BY INSPECTOR', canvas.width/2, 225);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('Press SPACE to Run Again', canvas.width/2, 260);
      ctx.textAlign = 'left';
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', e => {
    if (!running && e.code === 'Space') return init();
    if (!running) return;

    if ((e.key === 'ArrowLeft' || e.key === 'a') && currentLane > 0) currentLane--;
    else if ((e.key === 'ArrowRight' || e.key === 'd') && currentLane < 2) currentLane++;
    else if ((e.key === 'ArrowUp' || e.key === 'w' || e.code === 'Space') && !player.jumping) {
      player.jumping = true;
      player.vy = -12;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      player.sliding = true;
      setTimeout(() => player.sliding = false, 600);
    }
  });

  init();
  loop();
</script>
</body>
</html>`
  },

  'wordle': {
    id: 'wordle',
    title: 'Wordle Guess Master',
    category: 'Puzzle & Logic',
    description: 'Crack the secret 5-letter hidden word in 6 attempts using color-coded hints.',
    instructions: 'Type 5-letter words and hit Enter. Green = correct letter & spot, Yellow = correct letter wrong spot, Gray = not in word.',
    controls: 'Keyboard typing + Enter + Backspace.',
    htmlCode: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#070b0e; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; user-select:none; }
  .grid { display:grid; grid-template-rows:repeat(6, 1fr); gap:6px; margin-bottom:20px; }
  .row { display:grid; grid-template-columns:repeat(5, 52px); gap:6px; }
  .tile { width:52px; height:52px; border:2px solid #334155; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; border-radius:6px; text-transform:uppercase; }
  .correct { background:#16a34a; border-color:#16a34a; }
  .present { background:#ca8a04; border-color:#ca8a04; }
  .absent { background:#334155; border-color:#334155; }
  #msg { height:24px; font-weight:700; color:#38bdf8; margin-bottom:12px; }
</style>
</head>
<body>
  <div style="font-size:24px; font-weight:800; color:#10b981; margin-bottom:8px;">WORDLE</div>
  <div id="msg">Type a 5-letter word</div>
  <div class="grid" id="grid"></div>
<script>
  const WORDS = ['APPLE', 'BRAIN', 'CLOUD', 'DREAM', 'EARTH', 'FLAME', 'GHOST', 'HEART', 'LIGHT', 'MUSIC', 'OCEAN', 'PIXEL', 'RIVER', 'SPACE', 'TIGER', 'WATER'];
  const SECRET = WORDS[Math.floor(Math.random() * WORDS.length)];
  let guesses = [];
  let current = '';
  let done = false;

  function render() {
    const g = document.getElementById('grid');
    g.innerHTML = '';
    for(let r=0; r<6; r++) {
      const row = document.createElement('div');
      row.className = 'row';
      const word = guesses[r] || (r === guesses.length ? current : '');
      for(let c=0; c<5; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        const letter = word[c] || '';
        tile.innerText = letter;

        if (r < guesses.length) {
          if (SECRET[c] === letter) tile.classList.add('correct');
          else if (SECRET.includes(letter)) tile.classList.add('present');
          else tile.classList.add('absent');
        }
        row.appendChild(tile);
      }
      g.appendChild(row);
    }
  }

  window.addEventListener('keydown', e => {
    if (done) return;
    if (e.key === 'Backspace') {
      current = current.slice(0, -1);
      render();
    } else if (e.key === 'Enter') {
      if (current.length === 5) {
        guesses.push(current);
        if (current === SECRET) {
          done = true;
          document.getElementById('msg').innerText = '🎉 BRILLIANT! YOU GUESSED IT!';
        } else if (guesses.length === 6) {
          done = true;
          document.getElementById('msg').innerText = 'GAME OVER. Word was: ' + SECRET;
        }
        current = '';
        render();
      }
    } else if (/^[a-zA-Z]$/.test(e.key) && current.length < 5) {
      current += e.key.toUpperCase();
      render();
    }
  });

  render();
</script>
</body>
</html>`
  }
};
