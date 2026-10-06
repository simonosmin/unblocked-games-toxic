import React, { useState } from 'react';
import { Search, Code2, Play, RotateCcw, Copy, Check, ExternalLink, FileCode, Sparkles } from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  category: 'html' | 'css' | 'js' | 'all';
  description: string;
  html: string;
  css: string;
  js: string;
}

const SAMPLE_PROJECTS: CodeSnippet[] = [
  {
    id: 'matrix-canvas',
    title: 'Matrix Digital Rain Simulation',
    category: 'all',
    description: 'Falling green Japanese Katakana and binary matrix code streams in HTML5 canvas.',
    html: `<canvas id="matrix"></canvas>`,
    css: `body { margin: 0; background: #000; overflow: hidden; }
canvas { display: block; }`,
    js: `const c = document.getElementById('matrix');
const ctx = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;
const chars = '0123456789ABCDEF01アイウエオカキクケコサシスセソタチツテト';
const fontSize = 14;
const columns = c.width / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';
  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(draw, 33);`
  },
  {
    id: '3d-cube',
    title: '3D Cyber Rotating Cube',
    category: 'css',
    description: 'Pure CSS 3D perspective cube with toxic emerald glow and smooth continuous rotation.',
    html: `<div class="scene">
  <div class="cube">
    <div class="face front">TOXIC</div>
    <div class="face back">HTML5</div>
    <div class="face right">CSS3</div>
    <div class="face left">JS</div>
    <div class="face top">2026</div>
    <div class="face bottom">DEV</div>
  </div>
</div>`,
    css: `body { margin: 0; background: #080c10; height: 100vh; display: flex; align-items: center; justify-content: center; perspective: 800px; font-family: sans-serif; }
.scene { width: 140px; height: 140px; }
.cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; animation: spin 8s infinite linear; }
.face { position: absolute; width: 140px; height: 140px; border: 2px solid #10b981; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; color: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.3); }
.front  { transform: rotateY(0deg) translateZ(70px); }
.back   { transform: rotateY(180deg) translateZ(70px); }
.right  { transform: rotateY(90deg) translateZ(70px); }
.left   { transform: rotateY(-90deg) translateZ(70px); }
.top    { transform: rotateX(90deg) translateZ(70px); }
.bottom { transform: rotateX(-90deg) translateZ(70px); }
@keyframes spin { 0% { transform: rotateX(0deg) rotateY(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg); } }`,
    js: `// Interactive mouse tilt
document.addEventListener('mousemove', (e) => {
  const x = (window.innerWidth / 2 - e.pageX) / 20;
  const y = (window.innerHeight / 2 - e.pageY) / 20;
  const cube = document.querySelector('.cube');
  if (cube) cube.style.transform = \`rotateX(\${y}deg) rotateY(\${-x}deg)\`;
});`
  },
  {
    id: 'particle-fireworks',
    title: 'Neon Physics Fireworks',
    category: 'js',
    description: 'Explosive multi-particle physics simulation triggered on mouse clicks and taps.',
    html: `<div id="hint">Click or tap anywhere on the screen!</div><canvas id="canvas"></canvas>`,
    css: `body { margin: 0; background: #06090e; overflow: hidden; font-family: sans-serif; }
#hint { position: absolute; top: 16px; left: 16px; color: #64748b; font-size: 13px; pointer-events: none; }
canvas { display: block; }`,
    js: `const c = document.getElementById('canvas');
const ctx = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;
let particles = [];

function createExplosion(x, y) {
  const colors = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#a855f7'];
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      size: Math.random() * 3 + 2
    });
  }
}

window.addEventListener('click', e => createExplosion(e.clientX, e.clientY));

function render() {
  ctx.fillStyle = 'rgba(6, 9, 14, 0.2)';
  ctx.fillRect(0, 0, c.width, c.height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.alpha -= p.decay;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    } else {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
  requestAnimationFrame(render);
}
render();
// Initial burst
createExplosion(c.width / 2, c.height / 2);`
  },
  {
    id: 'neon-calc',
    title: 'Neon Cyber Calculator',
    category: 'html',
    description: 'Fully functional modern glassmorphic math calculator with real-time expression evaluation.',
    html: `<div class="calc">
  <div id="display">0</div>
  <div class="keys">
    <button class="op" onclick="clearD()">C</button>
    <button class="op" onclick="press('/')">/</button>
    <button class="op" onclick="press('*')">*</button>
    <button class="op" onclick="del()">DEL</button>
    <button onclick="press('7')">7</button>
    <button onclick="press('8')">8</button>
    <button onclick="press('9')">9</button>
    <button class="op" onclick="press('-')">-</button>
    <button onclick="press('4')">4</button>
    <button onclick="press('5')">5</button>
    <button onclick="press('6')">6</button>
    <button class="op" onclick="press('+')">+</button>
    <button onclick="press('1')">1</button>
    <button onclick="press('2')">2</button>
    <button onclick="press('3')">3</button>
    <button class="equal" onclick="calc()">=</button>
    <button onclick="press('0')" style="grid-column: span 2;">0</button>
    <button onclick="press('.')">.</button>
  </div>
</div>`,
    css: `body { margin: 0; background: #070b0e; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
.calc { background: #111827; border: 2px solid #10b981; padding: 20px; border-radius: 16px; box-shadow: 0 0 25px rgba(16, 185, 129, 0.2); width: 260px; }
#display { background: #0b0f14; border: 1px solid #1f2937; color: #10b981; font-size: 28px; text-align: right; padding: 14px; border-radius: 8px; margin-bottom: 16px; font-family: monospace; word-break: break-all; }
.keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
button { background: #1f2937; border: 1px solid #374151; color: #f9fafb; font-size: 18px; font-weight: bold; padding: 14px; border-radius: 8px; cursor: pointer; transition: all 0.1s; }
button:hover { background: #374151; }
button.op { color: #38bdf8; }
button.equal { background: #10b981; color: #070b0e; grid-row: span 2; }
button.equal:hover { background: #34d399; }`,
    js: `let exp = '';
function press(val) {
  if (exp === '0' && val !== '.') exp = '';
  exp += val;
  document.getElementById('display').innerText = exp;
}
function clearD() {
  exp = '0';
  document.getElementById('display').innerText = exp;
}
function del() {
  exp = exp.slice(0, -1) || '0';
  document.getElementById('display').innerText = exp;
}
function calc() {
  try {
    exp = String(Function('"use strict";return (' + exp + ')')());
    document.getElementById('display').innerText = exp;
  } catch(e) {
    document.getElementById('display').innerText = 'ERROR';
    exp = '';
  }
}`
  }
];

export const SearchEngine: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'editor'>('search');
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(SAMPLE_PROJECTS[0]);
  const [editorTab, setEditorTab] = useState<'html' | 'css' | 'js'>('html');
  const [codeHtml, setCodeHtml] = useState(SAMPLE_PROJECTS[0].html);
  const [codeCss, setCodeCss] = useState(SAMPLE_PROJECTS[0].css);
  const [codeJs, setCodeJs] = useState(SAMPLE_PROJECTS[0].js);
  const [copied, setCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'html' | 'css' | 'js'>('all');

  const handleSelectSnippet = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setCodeHtml(snippet.html);
    setCodeCss(snippet.css);
    setCodeJs(snippet.js);
    setActiveTab('editor');
  };

  const getCombinedCode = () => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${codeCss}
</style>
</head>
<body>
${codeHtml}
<script>
${codeJs}
</script>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCombinedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Launch search query into DuckDuckGo / web search in sandbox or tab
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
    window.open(url, '_blank');
  };

  const filteredSnippets = SAMPLE_PROJECTS.filter(s => {
    const matchesFilter = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesQuery = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="flex flex-col h-full bg-[#0b0f14] text-slate-100 rounded-xl border border-emerald-500/20 shadow-2xl overflow-hidden select-none">
      {/* Search Header Bar */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#070b0f] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-xl font-cursive text-emerald-400 font-bold tracking-wide">
            toxic search
          </div>
          <div className="text-xs text-slate-500">
            Web & Code Sandbox
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'search' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            File & Web Search
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'editor' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            HTML / CSS / JS Sandbox
          </button>
        </div>
      </div>

      {activeTab === 'search' ? (
        <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
          {/* Main Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search code snippets, HTML/CSS/JS files, or query anything..."
              className="w-full bg-[#111822] border border-slate-800 rounded-xl py-3.5 pl-12 pr-28 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Search Web <ExternalLink className="w-3 h-3" />
            </button>
          </form>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 mb-6 text-xs">
            <span className="text-slate-500">Filter Files:</span>
            {(['all', 'html', 'css', 'js'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-md uppercase font-semibold transition-colors ${
                  categoryFilter === cat ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Code Files & Sandbox Library Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSnippets.map(snippet => (
              <div
                key={snippet.id}
                onClick={() => handleSelectSnippet(snippet)}
                className="bg-[#101620] border border-slate-800 hover:border-emerald-500/50 p-5 rounded-xl cursor-pointer transition-all hover:bg-[#131c28] group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {snippet.title}
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {snippet.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {snippet.description}
                </p>
                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium pt-3 border-t border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 fill-emerald-400" /> Run in Sandbox
                  </span>
                  <span className="text-slate-500 text-[11px]">HTML / CSS / JS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Live Editor & Sandbox Split View */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Code Editor */}
          <div className="w-full md:w-1/2 flex flex-col border-r border-slate-800 bg-[#0d1219]">
            {/* Editor Tab Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#090d13]">
              <div className="flex gap-1">
                {(['html', 'css', 'js'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setEditorTab(tab)}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-colors ${
                      editorTab === tab ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    .{tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
                  title="Copy Full Code"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => {
                    setCodeHtml(selectedSnippet.html);
                    setCodeCss(selectedSnippet.css);
                    setCodeJs(selectedSnippet.js);
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
                  title="Reset Code"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="flex-1 p-3 font-mono text-xs">
              {editorTab === 'html' && (
                <textarea
                  value={codeHtml}
                  onChange={e => setCodeHtml(e.target.value)}
                  className="w-full h-full bg-transparent text-emerald-300 resize-none focus:outline-none leading-relaxed font-mono"
                  placeholder="<!-- Write HTML here -->"
                  spellCheck={false}
                />
              )}
              {editorTab === 'css' && (
                <textarea
                  value={codeCss}
                  onChange={e => setCodeCss(e.target.value)}
                  className="w-full h-full bg-transparent text-sky-300 resize-none focus:outline-none leading-relaxed font-mono"
                  placeholder="/* Write CSS here */"
                  spellCheck={false}
                />
              )}
              {editorTab === 'js' && (
                <textarea
                  value={codeJs}
                  onChange={e => setCodeJs(e.target.value)}
                  className="w-full h-full bg-transparent text-amber-300 resize-none focus:outline-none leading-relaxed font-mono"
                  placeholder="// Write JavaScript here"
                  spellCheck={false}
                />
              )}
            </div>
          </div>

          {/* Right Live Iframe Sandbox */}
          <div className="w-full md:w-1/2 flex flex-col bg-[#070a0f]">
            <div className="px-4 py-2 border-b border-slate-800 bg-[#090d13] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <Code2 className="w-3.5 h-3.5" /> Live Sandboxed Preview
              </span>
              <span>Sandboxed Execution</span>
            </div>
            <div className="flex-1 bg-black p-0 overflow-hidden relative">
              <iframe
                title="Sandbox Preview"
                srcDoc={getCombinedCode()}
                sandbox="allow-scripts"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
