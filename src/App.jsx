import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import {
  Bold, CalendarDays, Candy, Check, ChevronsDown, Coins, Copy, Droplets, Flame, Home, Italic, Menu, Moon,
  PartyPopper, PawPrint, Share2, Shirt, ShieldCheck, Sparkles, Star, Swords, TrendingDown, TrendingUp, Users, Wind, X, ArrowUp,
  Sun, HeartHandshake, Mountain, Sprout,
} from "lucide-react";

/* Deepawali 2026 — One Stock Academy
   npm i lenis lucide-react   (+ Tailwind v4 via @tailwindcss/vite)
   Type: Instrument Sans for everything, Instrument Serif italic for every italic.
   Smooth scroll: Lenis. Icons: lucide-react.
   Blocks inspired by bencho.dev (recreated, not copied): Jelly tabs, Arc ring, Progress tracker, Odds,
   Thinking loader, Format bar, Flap board, Image trail, ASCII wake. */

const TARGET = new Date("2026-11-07T18:30:00Z").getTime(); // 8 Nov 2026, 00:00 IST
const DAY0 = Date.parse("2026-11-05T18:30:00Z"); // 6 Nov 00:00 IST
const DAY_MS = 86400000;
const PALETTE = ["#ffd60a", "#ffbf24", "#ff9f1c", "#ff7a00", "#ff5a1f", "#ff3d54", "#fff3b0"];
const SERIF = `"Instrument Serif", Georgia, "Times New Roman", serif`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@1&display=swap');
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto!important}
.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}
.lenis.lenis-stopped{overflow:clip}
.dv{font-family:'Instrument Sans',system-ui,sans-serif;max-width:100vw;overflow-x:hidden}
.dv .fd{font-family:'Instrument Sans',system-ui,sans-serif;font-weight:700;letter-spacing:-.03em}
.dv .fm{font-family:'Instrument Sans',system-ui,sans-serif;font-weight:500;text-transform:uppercase}
.dv .italic{font-family:${SERIF};font-style:italic;font-weight:400;letter-spacing:-.01em;font-size:1.08em}
.dv .text-pop{animation:text-pop-shift 8s linear infinite;background:linear-gradient(100deg,#ffd60a,#ffbf24 20%,#ff9f1c 40%,#ff5a1f 62%,#ff3d54 82%,#ffd60a);-webkit-background-clip:text;background-clip:text;background-size:220% auto;-webkit-box-decoration-break:clone;box-decoration-break:clone;color:#0000;margin:0 -.2em;padding:0 .2em .2em}
@keyframes text-pop-shift{from{background-position:0% center}to{background-position:183.33% center}}
.dv .track{display:flex;width:max-content;animation:slide 45s linear infinite}
.dv .track.slow{animation-duration:80s}
@keyframes slide{to{transform:translateX(-50%)}}
.dv .flame{transform-origin:50% 100%;animation:flick 1.1s ease-in-out infinite alternate}
@keyframes flick{0%{transform:scale(1,1) rotate(-2deg)}100%{transform:scale(.92,1.1) rotate(2deg)}}
.dv .outline{color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.3)}
.dv .wipe{animation:wipe 1.3s cubic-bezier(.7,0,.2,1) forwards;transform-origin:center top}
@keyframes wipe{0%,45%{transform:scaleY(1)}100%{transform:scaleY(0)}}
.dv.fine,.dv.fine *{cursor:none}
.dv .glowpulse{animation:gp 3s ease-in-out infinite alternate}
@keyframes gp{from{opacity:.55}to{opacity:1}}
.dv .jelly{animation:jelly .65s ease-out}
@keyframes jelly{0%{transform:scale(1,1)}30%{transform:scale(1.14,.8)}60%{transform:scale(.95,1.1)}100%{transform:scale(1,1)}}
.dv .trail{animation:trail .9s ease-out forwards}
@keyframes trail{from{opacity:1;transform:translate(-50%,-50%) scale(.6)}to{opacity:0;transform:translate(-50%,-160%) scale(1.3) rotate(25deg)}}
.dv .dot{animation:dot 1s ease-in-out infinite}
@keyframes dot{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
.dv .shimmer{background:linear-gradient(90deg,#71717a 30%,#fff 50%,#71717a 70%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:shim 2s linear infinite}
@keyframes shim{from{background-position:200% center}to{background-position:-200% center}}
.dv .fadein{animation:fadein .4s ease-out}
@keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.dv .pulse-ring{animation:pr 1.6s ease-out infinite}
@keyframes pr{from{box-shadow:0 0 0 0 rgba(255,159,28,.6)}to{box-shadow:0 0 0 14px rgba(255,159,28,0)}}
.dv .flap{position:relative;display:inline-block;width:.8em;height:1.3em;perspective:260px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-weight:500;line-height:1.3em;color:#ffbf24}
.dv .flap .half{position:absolute;left:0;right:0;height:50%;overflow:hidden;background:#151515;border:1px solid rgba(255,255,255,.1);backface-visibility:hidden}
.dv .flap .half span{position:absolute;left:0;right:0;text-align:center;height:1.3em;line-height:1.3em}
.dv .flap .top{top:0;border-radius:8px 8px 0 0;transform-origin:50% 100%}
.dv .flap .top span{top:0}
.dv .flap .bot{bottom:0;border-radius:0 0 8px 8px;transform-origin:50% 0}
.dv .flap .bot span{bottom:0}
.dv .flap .fl1{animation:fl1 .3s ease-in forwards}
.dv .flap .fl2{transform:rotateX(90deg);animation:fl2 .3s .3s ease-out forwards}
@keyframes fl1{to{transform:rotateX(-90deg)}}
@keyframes fl2{to{transform:rotateX(0)}}
.dv .flap::after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:#050505;z-index:5}
.dv .asc{position:relative;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.dv .asc-canvas{display:block;color:#ffbf24}
@media(prefers-reduced-motion:reduce){.dv *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;

const wrap = "max-w-7xl mx-auto px-5 sm:px-10";
const sec = "relative z-20 py-16 sm:py-28";
const glass = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl transition-colors hover:bg-white/10 hover:border-orange-400/50";
const eyebrow = "fm text-xs tracking-widest text-orange-400 mb-4";
const h2c = "fd text-4xl sm:text-5xl lg:text-6xl leading-tight text-white";
const btn = "fm inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 text-xs tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400";
const btnSolid = `${btn} bg-stone-100 text-black hover:bg-white`;
const btnGhost = `${btn} border border-stone-100/30 text-stone-100 hover:border-stone-100 hover:bg-white/5`;

/* ---------- content ---------- */
const DAYS = [
  { id: "d1", tab: "Dhanteras", date: "Fri · 6 Nov", name: "Dhanteras", Icon: Coins, text: "The festival opens. Homes are cleaned, something small and lasting is bought, and the first lamps are lit for health and wealth.", todo: ["Clean and declutter the house", "Buy a utensil, a coin or gold", "Light the first diya outside the main door"] },
  { id: "d2", tab: "Choti Deepawali", date: "Sat · 7 Nov", name: "Choti Deepawali", Icon: Swords, text: "Naraka Chaturdashi marks Krishna's victory over Narakasura. Darkness is cleared before the big night.", todo: ["Take an early oil bath (abhyang snan)", "Draw rangoli at the entrance", "Light small diyas at dusk"] },
  { id: "d3", tab: "Lakshmi Puja", date: "Sun · 8 Nov", name: "Deepawali · Lakshmi Puja", Icon: Flame, text: "The main night. Lakshmi and Ganesh are worshipped, every doorway glows and the sky fills with light.", todo: ["Do Lakshmi–Ganesh puja after sunset", "Line every doorway with diyas", "Share sweets with family and neighbours"] },
  { id: "d4", tab: "Govardhan Puja", date: "Mon · 9 Nov", name: "Govardhan Puja", Icon: Mountain, text: "Annakut: a mountain of food offered in gratitude, recalling Krishna lifting Govardhan hill.", todo: ["Prepare many vegetarian dishes for Annakut", "Offer them together, then share", "Remember farmers and the land"] },
  { id: "d5", tab: "Bhai Dooj", date: "Tue · 10 Nov", name: "Bhai Dooj", Icon: HeartHandshake, text: "Siblings meet, sisters pray for their brothers and the long celebration closes with family.", todo: ["Sisters apply tilak and pray for brothers", "Brothers return with gifts", "Sit down for a family meal"] },
];
const WHY = [
  ["Chapter 01", "The return to Ayodhya", "Deepawali remembers Rama, Sita and Lakshmana coming home after exile. Ayodhya lit rows of lamps to welcome them, and the tradition of the diya was born.", "md:col-span-7", Home],
  ["Chapter 02", "Lakshmi arrives where there is light", "On the Amavasya night, homes are cleaned and lit so that Lakshmi, the goddess of prosperity, may enter. Light is the invitation.", "md:col-span-5", Coins],
  ["Chapter 03", "Good over evil", "Narakasura's defeat by Krishna, and Rama's victory over Ravana, are told as one story: darkness never has the last word.", "md:col-span-5", Swords],
  ["Chapter 04", "One festival, many faiths", "Sikhs celebrate Bandi Chhor Divas, Jains mark Mahavira's nirvana and many Buddhists in Nepal observe the lights too. The glow belongs to everyone.", "md:col-span-7", Users],
];
const MITHAI = [["Kaju Katli", 412], ["Gulab Jamun", 356], ["Besan Ladoo", 298], ["Jalebi", 201], ["Soan Papdi", 164], ["Motichoor Ladoo", 120]];
const PHASES = [
  ["Phase 01", "Clean the slate", "Close open loops: review last year's journal, delete bad habits, archive old setups."],
  ["Phase 02", "Light the lamp", "Write your process down. A rule you can see is a rule you can follow."],
  ["Phase 03", "Protect first", "Set risk per trade, daily loss limits and position size before anything else."],
  ["Phase 04", "Plan the new Samvat", "Pick 2–3 skills to build this year, not 20 stocks to chase."],
  ["Phase 05", "Stay patient", "Prosperity compounds slowly. Consistency beats one lucky Muhurat."],
];
const SAFE = [
  [Wind, "Choose green or low-noise crackers, or skip them and light more diyas."],
  [Droplets, "Keep a bucket of water or sand close by, and fireworks away from curtains and cars."],
  [ShieldCheck, "Light crackers outdoors, one at a time, with an adult supervising children."],
  [PawPrint, "Keep pets in a quiet, closed room with water, soft music and a familiar blanket."],
  [Shirt, "Wear cotton instead of loose synthetic fabric near flames and sparklers."],
  [Sprout, "Check on elderly neighbours and anyone with breathing issues before the evening begins."],
];

/* ---------- hooks ---------- */
function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

/* ---------- shared bits ---------- */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) { setOn(true); return; }
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); o.disconnect(); } }, { threshold: 0.1 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: on ? 1 : 0, filter: on ? "blur(0px)" : "blur(6px)", transform: on ? "none" : "translateY(36px)", transition: `all .8s cubic-bezier(.2,.7,.2,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

function Cursor() {
  const line = useRef(null), bar = useRef(null), ring = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const root = document.querySelector(".dv");
    if (root) root.classList.add("fine");
    setOn(true);
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf;
    const mv = (e) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      if (line.current) line.current.style.transform = `translateX(${x}px)`;
      if (bar.current) bar.current.style.transform = `translate(${x - 7}px,${y - 18}px)`;
      if (ring.current) ring.current.style.transform = `translate(${x - 13}px,${y - 13}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", mv);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", mv); if (root) root.classList.remove("fine"); };
  }, []);
  if (!on) return null;
  return (
    <div aria-hidden="true" className="fixed inset-0 z-50 pointer-events-none">
      <div ref={line} className="absolute top-0 left-0 bottom-0 w-px bg-orange-400/30" />
      <div ref={bar} className="absolute top-0 left-0 w-3.5 h-9 rounded-sm bg-orange-400 shadow-lg shadow-orange-500/40" />
      <div ref={ring} className="absolute top-0 left-0 w-6 h-6 rounded-full border border-orange-400/40" />
    </div>
  );
}

function Fireworks() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let W, H, raf, parts = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const burst = (x, y) => {
      const small = W < 640, n = (small ? 45 : 70) + Math.floor(Math.random() * 25);
      const base = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.15, s = (small ? 1 : 1.5) + Math.random() * (small ? 3 : 4.2);
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, d: 0.009 + Math.random() * 0.012, col: Math.random() < 0.7 ? base : PALETTE[Math.floor(Math.random() * PALETTE.length)], r: 1 + Math.random() * 1.6 });
      }
    };
    const onDown = (e) => { if (!e.target.closest("button,a,input,select,textarea,label,[role=button]")) burst(e.clientX, e.clientY); };
    const onEvt = () => { for (let i = 0; i < 6; i++) setTimeout(() => burst(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.5)), i * 220); };
    const auto = setInterval(() => burst(W * (0.12 + Math.random() * 0.76), H * (0.1 + Math.random() * 0.4)), 3000);
    const loop = () => {
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.05; p.life -= p.d;
        ctx.globalAlpha = Math.max(p.life, 0); ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1; raf = requestAnimationFrame(loop);
    };
    burst(W * 0.5, H * 0.3); loop();
    window.addEventListener("resize", resize); window.addEventListener("pointerdown", onDown); window.addEventListener("dv-burst", onEvt);
    return () => { cancelAnimationFrame(raf); clearInterval(auto); window.removeEventListener("resize", resize); window.removeEventListener("pointerdown", onDown); window.removeEventListener("dv-burst", onEvt); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full z-30 pointer-events-none" />;
}

function Diya({ lit, onClick, i, big }) {
  const k = `${i}${big ? "b" : ""}`;
  return (
    <button onClick={onClick} aria-pressed={lit} aria-label={`Diya ${i + 1}, ${lit ? "lit" : "unlit"}`}
      className={`relative w-full mx-auto aspect-square rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${big ? "max-w-xs" : "max-w-28"}`}>
      <svg viewBox="0 0 100 110" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id={`g${k}`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffd60a" stopOpacity=".9" /><stop offset="1" stopColor="#ff7a00" stopOpacity="0" /></radialGradient>
          <linearGradient id={`b${k}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ff9f1c" /><stop offset="1" stopColor="#8a2b00" /></linearGradient>
        </defs>
        {lit && <circle cx="50" cy="42" r="46" fill={`url(#g${k})`} className="glowpulse" />}
        <path d="M8 62 Q50 62 92 62 Q88 98 50 98 Q12 98 8 62Z" fill={`url(#b${k})`} stroke="rgba(255,255,255,.25)" />
        <path d="M30 62 Q50 54 70 62" fill="none" stroke="rgba(255,255,255,.35)" />
        {lit ? (
          <g className="flame" style={{ animationDelay: `${i * 0.13}s` }}>
            <path d="M50 18 Q64 38 50 56 Q36 38 50 18Z" fill="#ff7a00" />
            <path d="M50 30 Q58 42 50 54 Q42 42 50 30Z" fill="#ffd60a" />
          </g>
        ) : (<line x1="50" y1="52" x2="50" y2="60" stroke="#999" strokeWidth="2" />)}
      </svg>
    </button>
  );
}

/* ---------- blocks (bencho-style, recreated) ---------- */

/* ASCII wake
   A cube drawn in ink dots. The pointer drags a wake through it: right under the hand
   the characters thicken, along the path it came from they thin back out
   (@ to # to + to a dot) as the wake cools. Press and a ring goes out.
   Every cell holds one number; the hand adds to it along its path, the grid cools every
   frame, and the number picks a glyph off a ramp. The warm part shimmers, the cold field holds still. */
const AW = 360;
const AH = 240;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const RAMPS = {
  Classic: [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"],
  Blocks: [" ", "·", "░", "▒", "▓", "█"],
  Dots: [" ", "·", "•", "●"],
  Binary: [" ", ".", ":", "0", "1"],
};
const CUBE = 112;
const MONO = `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace`;
const COLD = 0.04;
const RING_S = 2.2;

/* dot size 0..1 for a point on an isometric cube: top brightest, left in half light, right in shade */
function cube(x, y, dark) {
  const lit = (v) => 0.35 + 0.65 * clamp(dark ? v : 1.09 - v, 0, 1);
  const R = CUBE;
  const c = Math.cos(Math.PI / 6) * R, h = R / 2;
  const T = [0, -R], UR = [c, -h], B = [0, R], LL = [-c, h], UL = [-c, -h];
  const along = (o, p, q) => {
    const ax = p[0] - o[0], ay = p[1] - o[1], bx = q[0] - o[0], by = q[1] - o[1];
    const dx = x - o[0], dy = y - o[1];
    const det = ax * by - ay * bx;
    return [(dx * by - dy * bx) / det, (ax * dy - ay * dx) / det];
  };
  const inside = ([s, t]) => s >= 0 && s <= 1 && t >= 0 && t <= 1;
  const seam = (v) => (v < 0.045 ? 1 : 0);
  const top = along(T, UR, UL);
  if (inside(top)) {
    const [s, t] = top;
    return seam(1 - s) || seam(1 - t) ? 1 : lit(0.96 - 0.1 * (s + t) / 2);
  }
  const left = along(UL, [0, 0], LL);
  if (inside(left)) {
    const [s, t] = left;
    return seam(s) ? 1 : lit(0.56 - 0.12 * t);
  }
  const right = along([0, 0], UR, B);
  if (inside(right)) {
    const [s, t] = right;
    return seam(s) || seam(t) ? 1 : lit(0.13 - 0.05 * s);
  }
  return 0;
}

/* stable 0..1 per cell per deal, so the shimmer holds for a few frames */
function hash(k, n) {
  let h = (k * 374761393 + n * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function AsciiWake({ glyphs = "Classic", size = 10, reach = 50, trail = 1.2, pull = 40, boost = 1 }) {
  const cv = useRef(null);
  const knobs = useRef({ glyphs, reach, trail, pull });
  const st = useRef({
    cols: 0, rows: 0, cw: 0, ch: 0, ox: 0, oy: 0, font: "",
    heat: new Float32Array(0), mask: new Float32Array(0),
    hx: -999, hy: -999, lx: NaN, ly: NaN, near: 0, inside: false,
    rings: [], deal: 0, tick: 0, raf: 0, ratio: 1,
  });

  const build = () => {
    const s = st.current, c = cv.current;
    if (!c) return;
    const r = Math.min(3, (window.devicePixelRatio || 1) * boost);
    s.ratio = r;
    c.width = Math.round(AW * r);
    c.height = Math.round(AH * r);
    const ink = getComputedStyle(c).color.match(/[\d.]+/g)?.map(Number) ?? [255, 191, 36];
    const dark = ink[0] * 0.299 + ink[1] * 0.587 + ink[2] * 0.114 > 128;
    s.ch = size * 0.82;
    s.cw = size * 0.62;
    s.cols = Math.floor(AW / s.cw - 0.5);
    s.rows = Math.floor(AH / s.ch);
    s.font = `500 ${size}px ${MONO}`;
    s.heat = new Float32Array(s.cols * s.rows);
    s.mask = new Float32Array(s.cols * s.rows);
    const ox = (s.ox = (AW - s.cols * s.cw) / 2), oy = (s.oy = (AH - s.rows * s.ch) / 2);
    for (let j = 0; j < s.rows; j++) {
      for (let i = 0; i < s.cols; i++) {
        const x = ox + (i + 0.5 + (j & 1) * 0.5) * s.cw - AW / 2, y = oy + (j + 0.5) * s.ch - AH / 2;
        s.mask[j * s.cols + i] = cube(x, y, dark);
      }
    }
  };

  const stamp = (x, y, rad, amt) => {
    const s = st.current;
    x -= s.ox; y -= s.oy;
    const c0 = Math.max(0, Math.floor((x - rad) / s.cw));
    const c1 = Math.min(s.cols - 1, Math.ceil((x + rad) / s.cw));
    const r0 = Math.max(0, Math.floor((y - rad) / s.ch));
    const r1 = Math.min(s.rows - 1, Math.ceil((y + rad) / s.ch));
    const R2 = rad * rad;
    for (let j = r0; j <= r1; j++) {
      const dy = (j + 0.5) * s.ch - y;
      for (let i = c0; i <= c1; i++) {
        const dx = (i + 0.5) * s.cw - x;
        const q = (dx * dx + dy * dy) / R2;
        if (q >= 1) continue;
        const t = 1 - q, k = j * s.cols + i;
        s.heat[k] = Math.min(1, s.heat[k] + amt * t * t);
      }
    }
  };

  const radius = () => 12 + (clamp(knobs.current.reach, 0, 100) / 100) * 58;

  const paint = () => {
    const s = st.current, c = cv.current;
    if (!c || !s.cols) return;
    const g = c.getContext("2d");
    g.setTransform(s.ratio, 0, 0, s.ratio, 0, 0);
    g.clearRect(0, 0, AW, AH);
    g.fillStyle = getComputedStyle(c).color;
    const dot = Math.min(s.cw, s.ch) * 0.44;
    g.font = s.font;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const ramp = RAMPS[knobs.current.glyphs] ?? RAMPS.Classic;
    const top = ramp.length - 1;
    const lean = (clamp(knobs.current.pull, 0, 100) / 100) * s.near;
    const rad = radius(), far = rad * 2, far2 = far * far, R2 = rad * rad;
    const rings = s.rings.map((r) => {
      const p = r.t / RING_S, e = 1 - Math.pow(1 - p, 3);
      return { x: r.x, y: r.y, R: 8 + e * 260, amp: 0.6 * (1 - p) * (1 - p) * Math.min(1, p * 6) };
    });
    for (let j = 0; j < s.rows; j++) {
      const y = s.oy + (j + 0.5) * s.ch;
      for (let i = 0; i < s.cols; i++) {
        const k = j * s.cols + i, m = s.mask[k];
        if (m <= 0) continue;
        const cx = s.ox + (i + 0.5 + (j & 1) * 0.5) * s.cw;
        let h = s.heat[k];
        if (s.near > 0.002) {
          const q = ((cx - s.hx) ** 2 + (y - s.hy) ** 2) / R2;
          if (q < 1) h = Math.max(h, 0.95 * s.near * (1 - q) * (1 - q));
        }
        for (const r of rings) {
          const d = (Math.hypot(cx - r.x, y - r.y) - r.R) / 24;
          if (d > -2.5 && d < 2.5) h += r.amp * Math.exp(-d * d);
        }
        h *= 0.55 + 0.45 * m;
        const v = Math.min(1, h);
        let u = v * top + 0.5;
        if (h > COLD) u += (hash(k, s.deal) - 0.5) * 1.6 * Math.min(1, h * 2);
        const idx = clamp(Math.floor(u), 1, top);
        let x = cx, yy = y;
        if (lean > 0.002) {
          const dx = s.hx - x, dy = s.hy - yy, d2 = dx * dx + dy * dy;
          if (d2 < far2) {
            const f = 1 - d2 / far2, d = Math.sqrt(d2) || 1;
            const mv = Math.min(d * 0.6, 14 * lean * f * f);
            x += (dx / d) * mv;
            yy += (dy / d) * mv;
          }
        }
        if (h <= COLD || idx === 1) {
          g.beginPath();
          g.arc(x, yy, Math.max(0.45, dot * Math.sqrt(m)), 0, Math.PI * 2);
          g.fill();
          continue;
        }
        g.fillText(ramp[idx], x, yy);
      }
    }
  };

  /* the loop runs only while the wake is warm or the hand is moving */
  const run = () => {
    const s = st.current;
    if (s.raf) return;
    let prev = performance.now();
    const step = (t) => {
      const dt = Math.min(0.05, (t - prev) / 1000);
      prev = t;
      const keep = Math.exp((-dt * 3) / Math.max(0.1, knobs.current.trail));
      let warm = 0;
      for (let k = 0; k < s.heat.length; k++) {
        const h = s.heat[k] * keep;
        s.heat[k] = h < 0.003 ? 0 : h;
        if (h > warm) warm = h;
      }
      s.rings = s.rings.filter((r) => (r.t += dt) < RING_S);
      s.near += ((s.inside ? 1 : 0) - s.near) * (1 - Math.pow(0.004, dt));
      s.tick += dt;
      if (s.tick > 0.07) { s.tick = 0; s.deal++; }
      paint();
      const still = warm === 0 && !s.rings.length && Math.abs((s.inside ? 1 : 0) - s.near) < 0.004;
      s.raf = still ? 0 : requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  };

  useEffect(() => { knobs.current = { glyphs, reach, trail, pull }; });
  useEffect(() => { build(); paint(); }, [size, boost]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { paint(); }, [glyphs]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { cancelAnimationFrame(st.current.raf); st.current.raf = 0; }, []);

  /* pointer in the block's own units, so a scaled stage still lines up */
  const where = (e) => {
    const r = e.currentTarget.getBoundingClientRect(), k = r.width / AW;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };
  const move = (e) => {
    const s = st.current, { x, y } = where(e), rad = radius();
    if (Number.isNaN(s.lx)) { s.lx = x; s.ly = y; }
    const d = Math.hypot(x - s.lx, y - s.ly), n = Math.max(1, Math.ceil(d / (rad / 3)));
    for (let k = 1; k <= n; k++) {
      const f = k / n;
      stamp(s.lx + (x - s.lx) * f, s.ly + (y - s.ly) * f, rad, 0.5);
    }
    s.lx = x; s.ly = y; s.hx = x; s.hy = y;
    s.inside = true;
    run();
  };

  return (
    <div className="asc" style={{ width: AW, height: AH }}
      onPointerEnter={(e) => { st.current.lx = NaN; move(e); }}
      onPointerMove={move}
      onPointerLeave={() => { const s = st.current; s.inside = false; s.lx = NaN; run(); }}
      onPointerDown={(e) => { const { x, y } = where(e); st.current.rings.push({ x, y, t: 0 }); run(); }}
      role="img" aria-label="A cube of dots that a pointer drags a wake through">
      <canvas ref={cv} className="asc-canvas" style={{ width: AW, height: AH }} aria-hidden="true" />
    </div>
  );
}

/* scales the fixed 360x240 block up to its container, and sharpens the canvas to match */
function AsciiStage() {
  const box = useRef(null);
  const [k, setK] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(([e]) => setK(Math.max(0.6, e.contentRect.width / AW)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="w-full" style={{ height: AH * k }}>
      <div style={{ width: AW, height: AH, transform: `scale(${k})`, transformOrigin: "0 0" }}>
        <AsciiWake boost={Math.min(3, Math.ceil(k * 2) / 2)} />
      </div>
    </div>
  );
}

/* Flap board */
function Flap({ v }) {
  const [cur, setCur] = useState(v), [prev, setPrev] = useState(v), [k, setK] = useState(0);
  useEffect(() => { if (v !== cur) { setPrev(cur); setCur(v); setK((x) => x + 1); } }, [v, cur]);
  return (
    <span className="flap" aria-hidden="true">
      <span className="half top"><span>{cur}</span></span>
      <span className="half bot"><span>{k ? prev : cur}</span></span>
      {k > 0 && <span key={`a${k}`} className="half top fl1"><span>{prev}</span></span>}
      {k > 0 && <span key={`b${k}`} className="half bot fl2"><span>{cur}</span></span>}
    </span>
  );
}
function FlapBoard({ now }) {
  const left = Math.max(0, TARGET - now), s = Math.floor(left / 1000);
  const parts = [["Days", Math.floor(s / 86400)], ["Hrs", Math.floor((s % 86400) / 3600)], ["Min", Math.floor((s % 3600) / 60)], ["Sec", s % 60]];
  if (left <= 0) return <div className={`${glass} px-6 py-4 inline-block`}><span className="fm text-xs tracking-widest text-pop">It's Deepawali — Shubh Deepawali!</span></div>;
  return (
    <div role="timer" aria-label="Countdown to Deepawali" className="flex gap-3 sm:gap-5">
      {parts.map(([l, n]) => {
        const d = String(n).padStart(2, "0");
        return (
          <div key={l} className="text-center">
            <div className="flex gap-1 text-3xl sm:text-5xl"><Flap v={d[0]} /><Flap v={d[1]} /></div>
            <p className="fm text-xs tracking-widest text-zinc-500 mt-2">{l}</p>
          </div>
        );
      })}
    </div>
  );
}

/* Image trail (icon trail) */
const TRAIL_ICONS = [Flame, Sparkles, Star];
function useTrail() {
  const [items, setItems] = useState([]);
  const last = useRef({ x: -999, y: -999 }), id = useRef(0);
  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (Math.hypot(x - last.current.x, y - last.current.y) < 56) return;
    last.current = { x, y };
    const n = id.current++;
    setItems((a) => [...a.slice(-14), { n, x, y, I: n % 3 }]);
    setTimeout(() => setItems((a) => a.filter((i) => i.n !== n)), 900);
  }, []);
  return [items, onMove];
}

/* Jelly tabs */
function JellyTabs({ options, value, onChange }) {
  const refs = useRef([]);
  const [box, setBox] = useState({ l: 0, w: 0 });
  const [jig, setJig] = useState(false);
  const idx = options.findIndex((o) => o.id === value);
  const measure = useCallback(() => { const el = refs.current[idx]; if (el) setBox({ l: el.offsetLeft, w: el.offsetWidth }); }, [idx]);
  useLayoutEffect(measure, [measure]);
  useEffect(() => { window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, [measure]);
  useEffect(() => { setJig(true); const t = setTimeout(() => setJig(false), 650); return () => clearTimeout(t); }, [value]);
  return (
    <div role="tablist" data-lenis-prevent-wheel className="relative inline-flex max-w-full overflow-x-auto p-1 rounded-full bg-white/5 border border-white/10">
      <span aria-hidden="true" className={`absolute top-1 bottom-1 rounded-full bg-orange-400 ${jig ? "jelly" : ""}`}
        style={{ left: box.l, width: box.w, transition: "left .55s cubic-bezier(.34,1.56,.64,1), width .55s cubic-bezier(.34,1.56,.64,1)" }} />
      {options.map((o, i) => (
        <button key={o.id} ref={(el) => (refs.current[i] = el)} role="tab" aria-selected={o.id === value} onClick={() => onChange(o.id)}
          className={`relative z-10 fm text-xs tracking-widest px-4 py-2.5 rounded-full whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${o.id === value ? "text-black" : "text-stone-100/70 hover:text-white"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* Progress tracker */
function ProgressTracker({ now, value, onPick }) {
  const cur = Math.min(4, Math.max(-1, Math.floor((now - DAY0) / DAY_MS)));
  const fill = cur < 0 ? 0 : Math.min(100, (cur / 4) * 100);
  return (
    <div className="relative">
      <div className="absolute left-5 right-5 top-5 h-px bg-white/10" />
      <div className="absolute left-5 top-5 h-px bg-orange-400 transition-all duration-1000" style={{ width: `calc((100% - 2.5rem) * ${fill / 100})` }} />
      <ol className="relative flex justify-between">
        {DAYS.map((d, i) => {
          const done = i < cur, now_ = i === cur, sel = d.id === value;
          return (
            <li key={d.id} className="flex flex-col items-center w-16 sm:w-28 text-center">
              <button onClick={() => onPick(d.id)} aria-label={`${d.name}, ${d.date}`}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${done ? "bg-orange-400 border-orange-400 text-black" : now_ ? "bg-neutral-950 border-orange-400 text-orange-300 pulse-ring" : "bg-neutral-950 border-white/20 text-zinc-500"} ${sel ? "ring-2 ring-white/40" : ""}`}>
                {done ? <Check className="w-4 h-4" /> : <d.Icon className="w-4 h-4" />}
              </button>
              <p className={`fm text-xs tracking-wider mt-3 ${sel ? "text-white" : "text-zinc-500"}`}>{d.date.split(" · ")[1]}</p>
              <p className="hidden sm:block text-xs text-zinc-500 mt-1">{done ? "Done" : now_ ? "Today" : "Upcoming"}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* Arc ring */
function ArcRing({ id, pct, value, label, sub }) {
  const r = 54, C = 2 * Math.PI * r, arc = C * 0.75, p = Math.max(0.002, Math.min(1, pct));
  return (
    <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full" style={{ transform: "rotate(135deg)" }}>
        <defs><linearGradient id={id} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffd60a" /><stop offset=".5" stopColor="#ff9f1c" /><stop offset="1" stopColor="#ff3d54" /></linearGradient></defs>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${arc} ${C}`} />
        <circle cx="70" cy="70" r={r} fill="none" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${arc * p} ${C}`} style={{ transition: "stroke-dasharray .9s cubic-bezier(.34,1.2,.4,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="fd text-4xl sm:text-5xl"><span className="text-pop">{value}</span></p>
        <p className="fm text-xs tracking-widest text-zinc-400 mt-1">{label}</p>
        <p className="text-xs text-zinc-500 mt-1">{sub}</p>
      </div>
    </div>
  );
}

/* Odds (poll) */
function Odds() {
  const [votes, setVotes] = useState(() => MITHAI.map((m) => m[1]));
  const [mine, setMine] = useState(-1);
  const total = votes.reduce((a, b) => a + b, 0);
  const vote = (i) => {
    if (mine === i) return;
    setVotes((v) => v.map((n, k) => (k === i ? n + 1 : k === mine ? n - 1 : n)));
    setMine(i);
  };
  const top = votes.indexOf(Math.max(...votes));
  return (
    <div className={`${glass} p-5 sm:p-8`}>
      <div className="grid gap-3">
        {MITHAI.map(([n], i) => {
          const pct = (votes[i] / total) * 100;
          return (
            <button key={n} onClick={() => vote(i)} aria-pressed={mine === i}
              className={`relative overflow-hidden text-left rounded-xl border px-4 py-3.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${mine === i ? "border-orange-400" : "border-white/10 hover:border-white/30"}`}>
              <span aria-hidden="true" className={`absolute inset-y-0 left-0 ${i === top ? "bg-orange-400/35" : "bg-white/10"}`} style={{ width: `${pct}%`, transition: "width .8s cubic-bezier(.34,1.2,.4,1)" }} />
              <span className="relative flex items-center justify-between gap-3">
                <span className="flex items-center gap-3"><Candy className={`w-4 h-4 ${i === top ? "text-orange-300" : "text-zinc-500"}`} /><span className="font-semibold text-sm sm:text-base">{n}</span>{mine === i && <Check className="w-4 h-4 text-orange-300" />}</span>
                <span className="fm text-sm text-stone-100/80">{pct.toFixed(0)}%</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="fm text-xs tracking-wider text-zinc-500 mt-4">Sample votes to start · tap to add or change yours</p>
    </div>
  );
}

/* Thinking loader */
function ThinkingLoader({ lines }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % lines.length), 2200); return () => clearInterval(t); }, [lines.length]);
  return (
    <div className="inline-flex items-center gap-3" role="status" aria-live="off">
      <span className="flex gap-1">{[0, 1, 2].map((k) => <span key={k} className="dot w-1.5 h-1.5 rounded-full bg-orange-400" style={{ animationDelay: `${k * 0.15}s` }} />)}</span>
      <span key={i} className="shimmer fadein fm text-xs tracking-widest">{lines[i]}</span>
    </div>
  );
}

/* Format bar */
function FormatBar({ fmt, setFmt, onCopy, copied, href }) {
  const T = ({ on, onClick, label, children }) => (
    <button onClick={onClick} aria-pressed={on} aria-label={label} title={label}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${on ? "bg-orange-400 text-black scale-105" : "text-stone-100/70 hover:bg-white/10"}`}>{children}</button>
  );
  return (
    <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
      <T on={fmt.b} onClick={() => setFmt({ ...fmt, b: !fmt.b })} label="Bold name"><Bold className="w-4 h-4" /></T>
      <T on={fmt.i} onClick={() => setFmt({ ...fmt, i: !fmt.i })} label="Italic name"><Italic className="w-4 h-4" /></T>
      <T on={fmt.g} onClick={() => setFmt({ ...fmt, g: !fmt.g })} label="Glow"><Sparkles className="w-4 h-4" /></T>
      <span className="w-px h-6 bg-white/15 mx-1" />
      <T onClick={onCopy} label="Copy message">{copied ? <Check className="w-4 h-4 text-orange-300" /> : <Copy className="w-4 h-4" />}</T>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" title="Share on WhatsApp"
        className="w-10 h-10 rounded-full flex items-center justify-center text-stone-100/70 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"><Share2 className="w-4 h-4" /></a>
    </div>
  );
}

/* ---------- chart quiz ---------- */
const ROUNDS = [
  { t: "The ceiling test", kind: "Resistance", level: 64, pre: [40, 46, 43, 50, 48, 56, 54, 61, 59, 63], post: [67, 73, 79, 85], ans: "up", why: "Price kept pushing into the same ceiling with higher lows. Buyers were getting stronger, and the ceiling finally gave way." },
  { t: "The floor test", kind: "Support", level: 59, pre: [80, 74, 77, 70, 72, 65, 67, 61, 63, 60], post: [54, 48, 44, 38], ans: "down", why: "Each bounce was weaker than the last (lower highs). A floor tested again and again eventually breaks." },
  { t: "The fake-out", kind: "Resistance", level: 54, pre: [30, 36, 34, 42, 40, 48, 46, 52, 57, 50], post: [46, 41, 43, 36], ans: "down", why: "Price poked above the line, but could not hold it and closed back inside. A failed breakout is often a trap." },
];
function ChartQuiz() {
  const [r, setR] = useState(0), [pick, setPick] = useState(null), [score, setScore] = useState(0), [done, setDone] = useState(false);
  const R = ROUNDS[r], all = [...R.pre, ...R.post], y = (v) => 210 - v * 2.1, preN = R.pre.length;
  const cs = all.map((c, i) => {
    const o = i ? all[i - 1] : all[0] - 4, hi = Math.max(o, c) + 2 + ((i * 7) % 4), lo = Math.min(o, c) - 2 - ((i * 5) % 4);
    return { o, c, hi: i === 8 && R.t === "The fake-out" ? 63 : hi, lo, up: c >= o };
  });
  const answer = (a) => { if (pick) return; setPick(a); if (a === R.ans) setScore((s) => s + 1); };
  const next = () => { if (r === ROUNDS.length - 1) setDone(true); else { setR(r + 1); setPick(null); } };
  const reset = () => { setR(0); setPick(null); setScore(0); setDone(false); };
  return (
    <div className="max-w-3xl mx-auto border border-white/10 bg-black/60 backdrop-blur-xl rounded-2xl p-5 sm:p-10">
      <div className="flex items-center justify-between mb-6 gap-3">
        <p className="fm text-xs tracking-widest text-orange-400">Round {done ? 3 : r + 1} of 3</p>
        <p className="fm text-xs tracking-widest text-zinc-500">Score {score}/3</p>
      </div>
      {done ? (
        <div className="text-center py-10">
          <p className="fd text-5xl text-white">{score}/3</p>
          <p className="fd text-2xl sm:text-3xl mt-4 text-white">{score === 3 ? <>Sharp eyes. <span className="text-pop italic">Muhurat-ready.</span></> : <>Every chart is a <span className="text-pop italic">lesson</span>.</>}</p>
          <button className={`${btnSolid} mt-8`} onClick={reset}>Play again</button>
        </div>
      ) : (
        <>
          <h3 className="fd text-2xl sm:text-3xl text-white mb-5">{R.t}</h3>
          <div className="border border-white/10 bg-neutral-950 rounded-xl mb-5 overflow-hidden">
            <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label={`Candlestick chart: ${R.kind} test`}>
              {[55, 110, 165].map((v) => <line key={v} x1="0" x2="400" y1={v} y2={v} stroke="rgba(255,255,255,.06)" strokeDasharray="3 6" />)}
              <line x1="0" x2="400" y1={y(R.level)} y2={y(R.level)} stroke="#ff9f1c" strokeDasharray="6 5" opacity=".8" />
              <text x="392" y={y(R.level) - 6} textAnchor="end" fill="#ff9f1c" fontSize="10" fontFamily="Instrument Sans, system-ui, sans-serif">{R.kind}</text>
              {cs.map((k, i) => {
                const x = 18 + i * 25.5, show = i < preN || pick, col = k.up ? "#ffbf24" : "#ff3d54";
                return (
                  <g key={i} style={{ opacity: show ? 1 : 0, transition: `opacity .4s ${i >= preN ? (i - preN) * 250 : 0}ms` }}>
                    <line x1={x} x2={x} y1={y(k.hi)} y2={y(k.lo)} stroke={col} strokeWidth="1.5" />
                    <rect x={x - 5} y={y(Math.max(k.o, k.c))} width="10" height={Math.max(Math.abs(y(k.o) - y(k.c)), 2)} fill={col} rx="1.5" />
                  </g>
                );
              })}
            </svg>
          </div>
          {!pick ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button onClick={() => answer("up")} className="fm flex items-center justify-center gap-2 border border-orange-400/40 bg-orange-400/10 text-orange-300 text-xs tracking-widest px-4 py-4 rounded-xl hover:bg-orange-400 hover:text-black transition-colors"><TrendingUp className="w-4 h-4" /> Breakout</button>
              <button onClick={() => answer("down")} className="fm flex items-center justify-center gap-2 border border-white/20 text-white text-xs tracking-widest px-4 py-4 rounded-xl hover:bg-white hover:text-black transition-colors"><TrendingDown className="w-4 h-4" /> Breakdown</button>
            </div>
          ) : (
            <div className="fadein">
              <p className="fd text-xl text-white">{pick === R.ans ? <span className="text-pop">Correct.</span> : "Not this time."} <span className="font-medium text-zinc-300 tracking-normal">It was a {R.ans === "up" ? "breakout" : "breakdown"}.</span></p>
              <p className="text-sm text-zinc-400 leading-relaxed mt-3">{R.why}</p>
              <button className={`${btnSolid} mt-6`} onClick={next}>{r === ROUNDS.length - 1 ? "See score" : "Next round"}</button>
            </div>
          )}
        </>
      )}
      <p className="fm text-xs tracking-wider text-zinc-600 mt-6 text-center">Illustrative patterns for learning · Not a prediction of any real security</p>
    </div>
  );
}

/* ---------- page ---------- */
export default function App() {
  const now = useNow(1000);
  const [lit, setLit] = useState(() => Array(9).fill(true));
  const [heroLit, setHeroLit] = useState(true);
  const [day, setDay] = useState(() => DAYS[Math.min(4, Math.max(0, Math.floor((Date.now() - DAY0) / DAY_MS)))].id);
  const [name, setName] = useState("");
  const [tone, setTone] = useState("warm");
  const [fmt, setFmt] = useState({ b: true, i: true, g: true });
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState(false);
  const [trail, onTrail] = useTrail();
  const count = lit.filter(Boolean).length;
  const toggle = (i) => setLit((l) => l.map((v, k) => (k === i ? !v : v)));
  const D = DAYS.find((d) => d.id === day);
  const festPct = Math.max(0, Math.min(1, (now - DAY0) / (5 * DAY_MS)));
  const daysLeft = Math.max(0, Math.ceil((TARGET - now) / DAY_MS));

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.1 });
    return () => lenis.destroy();
  }, []);

  const msg = useMemo(() => {
    const n = name.trim() ? `, ${name.trim()}` : "";
    if (tone === "trader") return `Happy Deepawali${n}! May the new Samvat bring you patience, discipline and a process you trust. — One Stock Academy`;
    if (tone === "short") return `Shubh Deepawali${n}!`;
    return `Wishing you and your family a very Happy Deepawali${n}! May your home glow with joy, health and prosperity.`;
  }, [name, tone]);
  const copy = async () => { try { await navigator.clipboard.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (e) { /* clipboard unavailable */ } };

  const wishes = ["Shubh Deepawali", "Happy Deepawali", "Light over darkness", "Prosperity · Patience · Peace", "Deepawali 2026", "Sunday · 8 November"];
  const loop = [...wishes, ...wishes];
  const words = ["Deepawali", "Diya", "Rangoli", "Mithai", "Lakshmi Puja", "Prosperity"];
  const words2 = [...words, ...words];
  const nav = [["#days", "Five days"], ["#diyas", "Light a diya"], ["#wake", "Play with light"], ["#traders", "Trader's Deepawali"], ["#quiz", "Chart quiz"], ["#wish", "Send a wish"]];
  const nameStyle = {
    fontFamily: fmt.i ? SERIF : undefined,
    fontSize: fmt.i ? "1.08em" : undefined,
    fontWeight: fmt.b ? 700 : 500,
    fontStyle: fmt.i ? "italic" : "normal",
    filter: fmt.g ? "drop-shadow(0 0 14px rgba(255,159,28,.7))" : "none",
  };

  return (
    <div className="dv relative min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      <style>{css}</style>
      <div aria-hidden="true" className="wipe fixed inset-0 z-50 bg-black flex items-center justify-center pointer-events-none">
        <span className="fm text-xs tracking-widest text-stone-100/60">Deepawali 2026</span>
      </div>
      <Cursor />
      <Fireworks />
      <div className="absolute -top-40 -right-40 w-96 h-96 sm:w-xl sm:h-144 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

      {/* NAV */}
      <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-white/10">
        <div className={`${wrap} h-16 flex items-center justify-between gap-3`}>
          <a href="#top" className="fd text-base sm:text-lg whitespace-nowrap">One Stock <span className="text-pop italic">Academy</span></a>
          <nav className="hidden lg:flex items-center gap-7 fm text-xs tracking-widest text-stone-100/60">
            {nav.map(([h, l]) => <a key={h} href={h} className="hover:text-white transition-colors">{l}</a>)}
          </nav>
          <div className="flex items-center gap-3">
            <a href="#diyas" className={`${btnSolid} !px-4 !py-2 sm:!px-5 sm:!py-2.5 whitespace-nowrap`}><Flame className="w-4 h-4" />Light a diya</a>
            <button onClick={() => setMenu(!menu)} aria-label="Toggle menu" aria-expanded={menu} className="lg:hidden w-10 h-10 border border-white/20 flex items-center justify-center rounded-lg">
              {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="lg:hidden border-t border-white/10 bg-neutral-950 px-5 py-4 flex flex-col gap-4 fm text-xs tracking-widest text-stone-100/70">
            {nav.map(([h, l]) => <a key={h} href={h} onClick={() => setMenu(false)}>{l}</a>)}
          </nav>
        )}
      </header>

      {/* 1 · HERO (flap board + icon trail) */}
      <section id="top" onPointerMove={onTrail} className="relative z-20 py-14 sm:py-24 lg:min-h-screen flex items-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10">
          {trail.map((t) => { const I = TRAIL_ICONS[t.I]; return <I key={t.n} className="trail absolute w-5 h-5 text-orange-300" style={{ left: t.x, top: t.y }} />; })}
        </div>
        <div className={`${wrap} w-full grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-20`}>
          <div className="lg:col-span-7">
            <p className={eyebrow}>Sunday · 8 November 2026 · Lakshmi Puja</p>
            <h1 className="fd text-5xl sm:text-7xl xl:text-8xl leading-none">
              <span className="block pb-2">Light up</span>
              <span className="block pb-2">Deepawali</span>
              <span className="block italic pb-3"><span className="text-pop">2026.</span></span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-stone-100/65">
              Five days of lamps, sweets and family. From all of us at One Stock Academy: close the old books, light the diyas and start the new year with a clearer process. Shubh Deepawali.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="#diyas" className={btnSolid}><Flame className="w-4 h-4" />Light a diya</a>
              <a href="#wish" className={btnGhost}><Share2 className="w-4 h-4" />Send a wish</a>
            </div>
            <div className="mt-10">
              <FlapBoard now={now} />
              <p className="fm text-xs tracking-wider text-zinc-500 mt-4">Counting down to 8 Nov 2026 (IST) · Move your cursor for sparks · Tap for fireworks</p>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-2 sm:-inset-3 border border-orange-400/30 rounded-3xl pointer-events-none" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/70 px-6 py-10 text-center">
              <div className="absolute inset-0 bg-linear-to-b from-orange-500/15 to-transparent pointer-events-none" />
              <Diya big i={99} lit={heroLit} onClick={() => setHeroLit(!heroLit)} />
              <p className="fd text-2xl mt-4 relative">{heroLit ? <>The lamp is <span className="text-pop italic">lit.</span></> : "Tap to light the lamp"}</p>
              <p className="fm text-xs tracking-widest text-zinc-500 mt-3 relative">Tap the diya to {heroLit ? "blow it out" : "light it"}</p>
            </div>
          </div>
        </div>
        <ChevronsDown aria-hidden="true" className="absolute bottom-5 left-1/2 w-5 h-5 text-white/30 z-20 hidden lg:block" />
      </section>

      {/* 2 · TICKER */}
      <div aria-hidden="true" className="relative z-20 border-y border-white/10 bg-black/70 py-3 overflow-hidden">
        <div className="track">
          {loop.map((w, i) => (<span key={i} className="fm text-xs tracking-widest whitespace-nowrap mx-5 inline-flex items-center">{w}<Flame className="w-3 h-3 text-orange-400 ml-5" /></span>))}
        </div>
      </div>

      {/* 3 · MARQUEE */}
      <div aria-hidden="true" className="relative z-20 py-8 sm:py-14 overflow-hidden select-none">
        <div className="track slow">
          {words2.map((w, i) => (
            <span key={i} className="flex items-center">
              <span className={`fd leading-none whitespace-nowrap text-6xl sm:text-8xl lg:text-9xl mx-4 sm:mx-6 ${i % 2 ? "outline" : "text-white/90"}`}>{w}</span>
              <Sparkles className="w-6 h-6 sm:w-9 sm:h-9 text-orange-400/80" />
            </span>
          ))}
        </div>
      </div>

      {/* 4 · STATS */}
      <section className="relative z-20 border-y border-white/10 overflow-hidden bg-linear-to-r from-orange-950/60 via-neutral-950 to-neutral-950">
        <div className={`${wrap} py-16 sm:py-28`}>
          <Reveal className="max-w-2xl mb-12">
            <p className={eyebrow}>The festival of lights</p>
            <h2 className={h2c}>Deepawali, the way India <span className="text-pop italic">lights the night</span></h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[[CalendarDays, "5 Days", "Dhanteras to Bhai Dooj"], [Moon, "1 Night", "Kartik Amavasya, the new-moon night"], [Sun, "8 Nov", "Lakshmi Puja · Sunday"], [Sparkles, "∞ Diyas", "Lit across India and the world"]].map(([I, a, b], i) => (
              <Reveal key={a} delay={i * 80}>
                <div className="bg-orange-500/10 backdrop-blur-xl border border-orange-400/25 rounded-xl p-5 sm:p-6 h-full hover:bg-orange-500/15 transition-colors">
                  <I className="w-6 h-6 text-orange-400 mb-4" strokeWidth={1.5} />
                  <p className="fd text-2xl sm:text-3xl text-white mb-1">{a}</p>
                  <p className="fm text-xs tracking-wider text-white/60 leading-relaxed">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · FIVE DAYS (progress tracker + jelly tabs) */}
      <section id="days" className={`${wrap} ${sec}`}>
        <Reveal className="max-w-2xl mb-12">
          <p className={eyebrow}>Deepawali calendar 2026</p>
          <h2 className={h2c}>Five days, <span className="text-pop italic">five stories</span></h2>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed">Dates follow the common panchang. Timings differ by city and tradition, so confirm with your local calendar or temple.</p>
        </Reveal>
        <Reveal>
          <div className={`${glass} p-5 sm:p-10`}>
            <ProgressTracker now={now} value={day} onPick={setDay} />
            <div className="mt-10 flex justify-center sm:justify-start">
              <JellyTabs value={day} onChange={setDay} options={DAYS.map((d) => ({ id: d.id, label: d.tab }))} />
            </div>
            <div key={D.id} className="fadein grid md:grid-cols-12 gap-6 mt-8">
              <div className="md:col-span-7">
                <D.Icon className="w-10 h-10 text-orange-400 mb-4" strokeWidth={1.5} />
                <p className="fm text-xs tracking-widest text-orange-400 mb-2">{D.date}</p>
                <h3 className="fd text-3xl sm:text-4xl text-white mb-3 leading-tight">{D.name}</h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-lg">{D.text}</p>
              </div>
              <ul className="md:col-span-5 grid gap-3 content-start">
                {D.todo.map((t) => (
                  <li key={t} className="flex gap-3 items-start rounded-xl border border-white/10 bg-black/30 p-4">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-orange-300" />
                    <span className="text-sm text-stone-100/80 leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 6 · DIYAS (all lit by default) */}
      <section id="diyas" className={`${wrap} ${sec} border-t border-white/10`}>
        <Reveal>
          <p className={eyebrow}>Your turn</p>
          <h2 className={`${h2c} max-w-3xl`}>Every lamp is lit. <span className="text-pop italic">Keep the glow.</span></h2>
          <p className="mt-4 max-w-lg text-zinc-400 leading-relaxed">All nine diyas start lit. Tap one to blow it out or light it again, and keep all nine glowing to hold on to your Deepawali blessing.</p>
        </Reveal>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-3 sm:gap-4 mt-10">
          {lit.map((v, i) => (<Diya key={i} i={i} lit={v} onClick={() => toggle(i)} />))}
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-8">
          <span className="fm text-xs tracking-widest text-zinc-400">{count}/9 lit</span>
          <button className={btnGhost} onClick={() => setLit(Array(9).fill(true))}>Light all</button>
          <button className={btnGhost} onClick={() => setLit(Array(9).fill(false))}>Blow out</button>
        </div>
        {count === 9 && (
          <div className={`${glass} fadein mt-8 p-6 sm:p-8`}>
            <p className="fd text-2xl sm:text-3xl leading-tight">May your year be <span className="text-pop italic">this bright.</span> Shubh Deepawali!</p>
          </div>
        )}
      </section>

      {/* 7 · GLOW METER (arc rings) */}
      <section id="glow" className="relative z-20 border-y border-white/10 bg-black/40">
        <div className={`${wrap} ${sec}`}>
          <Reveal className="max-w-2xl mb-12">
            <p className={eyebrow}>Glow meter</p>
            <h2 className={h2c}>How bright is <span className="text-pop italic">your Deepawali?</span></h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <Reveal><div className={`${glass} p-6 sm:p-8 text-center`}><ArcRing id="ar1" pct={count / 9} value={`${count}/9`} label="Diyas lit" sub="Tap the diyas above" /><p className="fm text-xs tracking-widest text-zinc-500 mt-4">Your glow</p></div></Reveal>
            <Reveal delay={80}><div className={`${glass} p-6 sm:p-8 text-center`}><ArcRing id="ar2" pct={festPct} value={`${Math.round(festPct * 100)}%`} label="Festival" sub="6 to 10 Nov, 5 days" /><p className="fm text-xs tracking-widest text-zinc-500 mt-4">Festival progress</p></div></Reveal>
            <Reveal delay={160}><div className={`${glass} p-6 sm:p-8 text-center`}><ArcRing id="ar3" pct={1 - daysLeft / 5} value={daysLeft > 0 ? daysLeft : "Today"} label={daysLeft > 0 ? "Days to go" : "Lakshmi Puja"} sub="Until 8 November" /><p className="fm text-xs tracking-widest text-zinc-500 mt-4">Countdown</p></div></Reveal>
          </div>
        </div>
      </section>

      {/* 8 · WHY WE CELEBRATE */}
      <section id="why" className={`${wrap} ${sec}`}>
        <Reveal className="max-w-2xl mb-12">
          <p className={eyebrow}>Why we celebrate</p>
          <h2 className={h2c}>One festival, <span className="text-pop italic">many legends</span></h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {WHY.map(([c, h, p, span, I], i) => (
            <Reveal key={c} className={span} delay={i * 80}>
              <div className={`${glass} p-6 sm:p-10 h-full`}>
                <div className="flex items-start justify-between"><span className="fm text-sm text-orange-400">{c}</span><I className="w-6 h-6 text-zinc-600" strokeWidth={1.5} /></div>
                <h3 className="fd text-2xl sm:text-3xl text-white mt-6 mb-3 leading-tight">{h}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 9 · ASCII WAKE */}
      <section id="wake" className="relative z-20 border-y border-white/10 bg-black/40 overflow-hidden">
        <div className={`${wrap} ${sec} grid lg:grid-cols-12 gap-10 items-center`}>
          <Reveal className="lg:col-span-5">
            <p className={eyebrow}>Play with light</p>
            <h2 className={h2c}>Drag a wake through <span className="text-pop italic">the glow</span></h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">Sweep across the cube and the dots catch fire, thickening under your hand and cooling in your wake. Press anywhere to send a ring of light outward.</p>
          </Reveal>
          <Reveal className="lg:col-span-7">
            <div className={`${glass} p-4 sm:p-6`}>
              <AsciiStage />
              <p className="fm text-xs tracking-wider text-zinc-500 mt-4 text-center">Drag to leave a wake · Press for a ring</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10 · MITHAI ODDS */}
      <section id="mithai" className={`${wrap} ${sec}`}>
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <Reveal className="lg:col-span-5">
            <p className={eyebrow}>The sweet side</p>
            <h2 className={h2c}>Which mithai <span className="text-pop italic">wins the box?</span></h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">Every Deepawali box has a favourite. Cast your vote and watch the odds move.</p>
          </Reveal>
          <Reveal className="lg:col-span-7"><Odds /></Reveal>
        </div>
      </section>

      {/* 11 · TRADER'S DEEPAWALI */}
      <section id="traders" className="relative z-20 border-y border-white/10 bg-black/40">
        <div className={`${wrap} ${sec}`}>
          <Reveal className="max-w-3xl mb-12">
            <p className={eyebrow}>A trader's Deepawali</p>
            <h2 className={h2c}>Start the new Samvat with <span className="text-pop italic">a process</span></h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">For many Indian traders and investors, Deepawali marks the start of a new financial year (Samvat). Here is a five-step reset you can do this week.</p>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-5 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden mb-6">
              {PHASES.map(([p, h, d]) => (
                <div key={p} className="p-6">
                  <p className="fm text-xs tracking-widest text-orange-400 mb-3">{p}</p>
                  <p className="fd text-lg text-white leading-snug mb-2">{h}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className={`${glass} p-6 sm:p-10 grid md:grid-cols-12 gap-6 items-center`}>
              <div className="md:col-span-8">
                <p className="fm text-xs tracking-widest text-orange-400 mb-3">Muhurat trading</p>
                <h3 className="fd text-2xl sm:text-3xl text-white mb-3 leading-tight">A symbolic session, not a signal</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-5">Many Indian exchanges hold a short Muhurat trading session on Deepawali evening to mark the new Samvat. The timing is announced by the exchanges every year, so check their official circulars. Treat it as tradition: liquidity and volatility can differ from a normal day, and your risk rules still apply.</p>
                <ThinkingLoader lines={["Reviewing last year's journal", "Checking risk per trade", "Writing the plan down", "Lighting the lamp"]} />
              </div>
              <div className="md:col-span-4 flex md:justify-end"><a href="#quiz" className={btnGhost}><TrendingUp className="w-4 h-4" />Test your chart reading</a></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 12 · CHART QUIZ */}
      <section id="quiz" className={`${wrap} ${sec}`}>
        <Reveal className="max-w-2xl mx-auto text-center mb-10">
          <p className={eyebrow}>Test yourself</p>
          <h2 className={h2c}>Can you read this chart?</h2>
          <p className="text-sm text-zinc-400 mt-4 leading-relaxed">Three chart situations. Call the move, then watch what the market did, the way our students learn every session.</p>
        </Reveal>
        <Reveal><ChartQuiz /></Reveal>
      </section>

      {/* 13 · CELEBRATE SAFELY */}
      <section id="safe" className="relative z-20 border-y border-white/10 bg-black/40">
        <div className={`${wrap} ${sec} grid lg:grid-cols-12 gap-10 items-start`}>
          <Reveal className="lg:col-span-5">
            <p className={eyebrow}>Celebrate safely</p>
            <h2 className={h2c}>Bright nights, <span className="text-pop italic">safe hands</span></h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">A good Deepawali ends with everyone, pets and neighbours included, happy and unhurt.</p>
          </Reveal>
          <div className="lg:col-span-7 grid gap-3 sm:gap-4">
            {SAFE.map(([I, s], i) => (
              <Reveal key={s} delay={i * 60}>
                <div className={`${glass} p-5 flex gap-4 items-start`}>
                  <span className="mt-0.5 w-9 h-9 shrink-0 rounded-full bg-orange-400/15 border border-orange-400/40 flex items-center justify-center"><I className="w-4 h-4 text-orange-300" /></span>
                  <p className="text-sm sm:text-base text-stone-100/80 leading-relaxed">{s}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 14 · WISH MAKER (jelly tabs + format bar) */}
      <section id="wish" className={`${sec} max-w-3xl mx-auto px-5 sm:px-10`}>
        <Reveal className="text-center mb-8">
          <p className={eyebrow}>Spread the light</p>
          <h2 className={h2c}>Send a <span className="text-pop italic">personal wish</span></h2>
        </Reveal>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type a friend's name" maxLength={32} aria-label="Friend's name"
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-400" />
        <div className="flex justify-center mt-4">
          <JellyTabs value={tone} onChange={setTone} options={[{ id: "warm", label: "Warm" }, { id: "trader", label: "Trader" }, { id: "short", label: "Short" }]} />
        </div>
        <div className="mt-5 rounded-2xl border border-orange-400/40 bg-linear-to-b from-orange-500/20 to-white/5 px-5 py-10 sm:px-10 sm:py-14 text-center">
          <p className="fm text-xs tracking-widest text-orange-400">Shubh Deepawali · 2026</p>
          <p className="fd leading-tight text-3xl sm:text-5xl mt-5 mb-4 break-words">
            Happy Deepawali{name.trim() ? "," : "!"}
            {name.trim() && (<><br /><span className="text-pop" style={nameStyle}>{name.trim()}</span></>)}
          </p>
          <p className="mx-auto max-w-md text-sm sm:text-base leading-relaxed text-stone-100/65">{msg}</p>
        </div>
        <div className="flex justify-center mt-6">
          <FormatBar fmt={fmt} setFmt={setFmt} onCopy={copy} copied={copied} href={`https://wa.me/?text=${encodeURIComponent(msg)}`} />
        </div>
      </section>

      {/* 15 · FINAL BLESSING */}
      <section className={`${wrap} ${sec}`}>
        <Reveal>
          <div className="relative bg-linear-to-br from-orange-500/20 via-white/5 to-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-16 lg:p-20 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />
            <div className="relative max-w-2xl">
              <p className={eyebrow}>From our family to yours</p>
              <h2 className="fd text-4xl sm:text-6xl leading-none mb-8">May your lamps stay lit.<br /><span className="text-pop italic">Shubh Deepawali.</span></h2>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className={btnSolid} onClick={() => window.dispatchEvent(new Event("dv-burst"))}><PartyPopper className="w-4 h-4" />Launch fireworks</button>
                <a href="#top" className={btnGhost}><ArrowUp className="w-4 h-4" />Back to top</a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/10 bg-neutral-950">
        <div className={`${wrap} py-14`}>
          <p className="fd text-xl mb-3">One Stock <span className="text-pop italic">Academy</span></p>
          <p className="text-sm text-stone-100/60 leading-relaxed max-w-md mb-10">Wishing every learner, mentor and market-watcher a bright, safe and prosperous Deepawali.</p>
          <div className={`${glass} p-5 sm:p-6`}>
            <p className="fm text-xs tracking-widest text-stone-100/40 mb-3">Risk disclosure</p>
            <p className="text-xs leading-relaxed text-stone-100/50">Trading and investing in securities markets involve substantial risk of loss. One Stock Academy provides education only — nothing on this site or in our classes is investment advice, a recommendation, or a promise of returns. We do not provide stock tips or trading signals. Past performance of any strategy taught does not guarantee future results. Please trade only with capital you can afford to lose and consult a SEBI-registered investment adviser for advice specific to your situation.</p>
          </div>
          <p aria-hidden="true" className="fd text-4xl sm:text-7xl lg:text-9xl text-white/5 text-center whitespace-nowrap mt-12 overflow-hidden select-none">Shubh Deepawali</p>
          <div className="fm text-xs tracking-wider text-stone-100/40 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2">
            <span>© 2026 One Stock Academy</span><span>Education · Not investment advice</span>
          </div>
        </div>
      </footer>
    </div>
  );
}