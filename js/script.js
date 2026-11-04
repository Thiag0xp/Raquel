/* ================= EDITE AQUI ================= */
const CONFIG = {
  // Mensagem digitada na primeira cena
  cartaInicial: [
    "Oi, Raquel.",
    "Faz 7 anos que a gente se conhece.",
    "Sete anos de conversa, de risada e de vida acontecendo."
  ],
  // Quantos corações pegar na missão
  metaCoracoes: 7,
  // Número com DDI para receber a resposta no WhatsApp (ex.: "5511999999999").
  // Deixe vazio para esconder o botão.
  whatsapp: "",
  mensagemWhatsapp: "Eu disse SIM! 💍 Daqui a um tempo, sim!"
};
/* ============================================== */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 30) : ms));
const rand = (a, b) => a + Math.random() * (b - a);

const scenes = $$(".scene");
const audio = $("#audio"), musicBtn = $("#musicBtn");
let current = -1, token = 0;

/* ---------- Progresso ---------- */
const progress = $("#progress");
for (let i = 1; i < scenes.length; i++) progress.appendChild(document.createElement("span"));
function updateProgress() {
  progress.classList.toggle("off", current === 0);
  $$("span", progress).forEach((s, i) => {
    s.classList.toggle("on", i + 1 < current);
    s.classList.toggle("now", i + 1 === current);
  });
}

/* ---------- Navegação ---------- */
const enters = [enter0, enter1, enter2, enter3, enter4, enter5, enter6];
function go(n) {
  token++;
  current = n;
  scenes.forEach((s, i) => s.classList.toggle("active", i === n));
  $$(".next", scenes[n]).forEach((b) => b.id !== "waBtn" && b.classList.remove("show"));
  updateProgress();
  scenes[n].scrollTop = 0;
  enters[n](token);
}
const showNext = (n) => { const b = $(".next", scenes[n]); b && b.classList.add("show"); };
document.addEventListener("click", (e) => {
  const b = e.target.closest(".next");
  if (b && b.tagName === "BUTTON") go(current + 1);
});

async function reveal(scene, t, gap = 600) {
  const items = $$(".rv", scene);
  items.forEach((i) => i.classList.remove("in"));
  for (const it of items) {
    await sleep(gap);
    if (t !== token) return false;
    it.classList.add("in");
  }
  return true;
}

/* ---------- 0 · Envelope ---------- */
const envelope = $("#envelope");
function enter0() { envelope.classList.remove("open"); envelope.disabled = false; }
envelope.addEventListener("click", async () => {
  envelope.disabled = true;
  envelope.classList.add("open");
  startMusic();
  const t = token;
  await sleep(2000);
  if (t === token) go(1);
});

/* ---------- 1 · Mensagem digitada ---------- */
async function enter1(t) {
  const box = $("#lines1");
  box.innerHTML = "";
  for (const [i, txt] of CONFIG.cartaInicial.entries()) {
    const el = document.createElement("p");
    el.className = "line" + (i === 0 ? " first" : "");
    box.appendChild(el);
    el.classList.add("typing");
    await sleep(500);
    for (let k = 1; k <= txt.length; k++) {
      if (t !== token) return;
      el.textContent = reduce ? txt : txt.slice(0, k);
      if (reduce) break;
      await sleep(i === 0 ? 70 : 44);
    }
    el.classList.remove("typing");
    await sleep(700);
  }
  if (t === token) showNext(1);
}

/* ---------- 2 · Sete anos ---------- */
const yearsBox = $("#years");
for (let i = 1; i <= 7; i++) {
  yearsBox.insertAdjacentHTML("beforeend", `<div class="year"><b>♥</b><small>ano ${i}</small></div>`);
}
async function enter2(t) {
  $$(".year").forEach((y) => y.classList.remove("lit"));
  $$(".rv", scenes[2]).forEach((i) => i.classList.remove("in"));
  await sleep(900);
  for (const y of $$(".year")) {
    if (t !== token) return;
    y.classList.add("lit");
    await sleep(650);
  }
  await sleep(500);
  if (t !== token) return;
  $("#tlA").classList.add("in");
  await sleep(1600);
  if (t !== token) return;
  $("#tlB").classList.add("in");
  await sleep(1400);
  if (t === token) showNext(2);
}

/* ---------- 3 · Coração de partículas ---------- */
const hc = $("#heart"), hctx = hc.getContext("2d");
let parts = [], W = 0, H = 0, pointer = null, heartRunning = false;
const COLORS = ["#ff5c8a", "#ff7a9c", "#ffb3c6", "#ffe3ec", "#f6d9a8"];
const heartPoint = (t) => ({
  x: 16 * Math.pow(Math.sin(t), 3),
  y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
});
function buildHeart() {
  const r = hc.getBoundingClientRect();
  W = r.width; H = r.height;
  hc.width = W * devicePixelRatio; hc.height = H * devicePixelRatio;
  hctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const N = innerWidth < 600 ? 900 : 1500, sc = Math.min(W / 38, H / 34);
  parts = [];
  for (let i = 0; i < N; i++) {
    const outline = Math.random() < 0.55;
    const k = outline ? 1 + (Math.random() - 0.5) * 0.06 : Math.sqrt(Math.random());
    const p = heartPoint(Math.random() * Math.PI * 2);
    const hx = p.x * sc * k, hy = p.y * sc * k + sc * 0.5;
    const a = Math.random() * 6.283, d = Math.max(W, H) * rand(0.6, 1.4);
    parts.push({
      hx, hy, x: reduce ? hx : Math.cos(a) * d, y: reduce ? hy : Math.sin(a) * d,
      r: rand(0.8, 2.4), c: COLORS[(Math.random() * COLORS.length) | 0], ph: Math.random() * 6.28
    });
  }
}
function heartLoop(t) {
  if (current !== 3) { heartRunning = false; return; }
  hctx.clearRect(0, 0, W, H);
  hctx.save(); hctx.translate(W / 2, H / 2);
  const bt = (t / 1000) * 1.7;
  const beat = reduce ? 1 : 1 + 0.07 * Math.pow(Math.max(0, Math.sin(bt * Math.PI)), 6) + 0.03 * Math.sin(bt * 6.283);
  hctx.globalCompositeOperation = "lighter";
  for (const p of parts) {
    const tx = p.hx * beat + (reduce ? 0 : Math.sin(t / 900 + p.ph) * 1.2);
    const ty = p.hy * beat + (reduce ? 0 : Math.cos(t / 1100 + p.ph) * 1.2);
    p.x += (tx - p.x) * 0.045; p.y += (ty - p.y) * 0.045;
    if (pointer) {
      const dx = p.x - pointer.x, dy = p.y - pointer.y, d = Math.hypot(dx, dy);
      if (d < 60 && d > 0) { p.x += (dx / d) * (60 - d) * 0.25; p.y += (dy / d) * (60 - d) * 0.25; }
    }
    hctx.globalAlpha = 0.78; hctx.fillStyle = p.c;
    hctx.beginPath(); hctx.arc(p.x, p.y, p.r, 0, 6.283); hctx.fill();
  }
  hctx.restore();
  requestAnimationFrame(heartLoop);
}
const setPointer = (e) => {
  const r = hc.getBoundingClientRect();
  pointer = { x: e.clientX - r.left - W / 2, y: e.clientY - r.top - H / 2 };
};
hc.addEventListener("pointermove", setPointer);
hc.addEventListener("pointerdown", setPointer);
hc.addEventListener("pointerleave", () => (pointer = null));
hc.addEventListener("pointerup", () => (pointer = null));

async function enter3(t) {
  buildHeart();
  if (!heartRunning) { heartRunning = true; requestAnimationFrame(heartLoop); }
  await sleep(1800);
  if (t !== token) return;
  await reveal(scenes[3], t, 900);
  await sleep(900);
  if (t === token) showNext(3);
}

/* ---------- 4 · Missão dos corações ---------- */
const arena = $("#arena"), meter = $("#meter"), skip = $("#skipGame");
let caught = 0;
function renderMeter() {
  meter.innerHTML = "";
  for (let i = 0; i < CONFIG.metaCoracoes; i++) {
    const s = document.createElement("span"); s.textContent = "♥";
    if (i < caught) s.className = "on";
    meter.appendChild(s);
  }
}
function spawnDrop(t) {
  const d = document.createElement("button");
  const gold = Math.random() < 0.18;
  d.className = "drop" + (gold ? " gold" : "");
  d.textContent = "♥";
  d.setAttribute("aria-label", "Pegar coração");
  const size = rand(44, 72);
  d.style.fontSize = size + "px";
  d.style.left = rand(4, Math.max(10, 100 - (size / innerWidth) * 100 - 6)) + "%";
  d.style.animationDuration = rand(5.5, 8.5) + "s";
  d.style.setProperty("--rot", rand(-40, 40) + "deg");
  const grab = (e) => {
    e.preventDefault();
    if (d.classList.contains("caught") || t !== token) return;
    d.classList.add("caught");
    caught++; renderMeter();
    setTimeout(() => d.remove(), 400);
    if (caught >= CONFIG.metaCoracoes) finishGame(t);
  };
  d.addEventListener("pointerdown", grab);
  d.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") grab(e); });
  d.addEventListener("animationend", () => d.remove());
  arena.appendChild(d);
}
async function finishGame(t) {
  $("#gameMsg").textContent = "Missão cumprida, Raquel! Agora vem a parte importante.";
  skip.classList.remove("show");
  $$(".drop:not(.caught)", arena).forEach((d) => d.remove());
  await sleep(1200);
  if (t === token) showNext(4);
}
async function enter4(t) {
  arena.innerHTML = ""; caught = 0; renderMeter();
  $("#gameMsg").textContent = `Uma missãozinha antes da pergunta: pega ${CONFIG.metaCoracoes} corações.`;
  skip.classList.remove("show");
  setTimeout(() => { if (t === token && caught < CONFIG.metaCoracoes) skip.classList.add("show"); }, 16000);
  await sleep(900);
  while (t === token && caught < CONFIG.metaCoracoes) {
    spawnDrop(t);
    await sleep(rand(650, 1100));
  }
}
skip.addEventListener("click", () => go(5));

/* ---------- 5 · A pergunta ---------- */
const yesBtn = $("#yesBtn"), noBtn = $("#noBtn");
const NO_TEXTS = ["Preciso pensar", "Tem certeza? 🥺", "Olha de novo…", "Pensa com carinho", "Última chance 😏", "Você sabe que quer ♥"];
let attempts = 0, ph = null;
function resetProposal() {
  attempts = 0;
  noBtn.classList.remove("flying");
  noBtn.style.left = noBtn.style.top = "";
  noBtn.textContent = NO_TEXTS[0];
  yesBtn.style.setProperty("--grow", 1);
  if (ph) { ph.remove(); ph = null; }
}
function moveNo() {
  if (!noBtn.classList.contains("flying")) {
    const r = noBtn.getBoundingClientRect();
    ph = document.createElement("span");
    ph.style.cssText = `display:inline-block;width:${r.width}px;height:${r.height}px`;
    noBtn.parentNode.insertBefore(ph, noBtn);
    noBtn.style.left = r.left + "px"; noBtn.style.top = r.top + "px";
    noBtn.classList.add("flying");
    void noBtn.offsetWidth;
  }
  attempts++;
  noBtn.textContent = NO_TEXTS[Math.min(attempts, NO_TEXTS.length - 1)];
  yesBtn.style.setProperty("--grow", Math.min(1 + attempts * 0.14, 1.75));
  const pad = 14, bw = noBtn.offsetWidth, bh = noBtn.offsetHeight, y = yesBtn.getBoundingClientRect();
  let x, yy, tries = 0;
  do {
    x = rand(pad, innerWidth - bw - pad);
    yy = rand(pad + 30, innerHeight - bh - pad);
    tries++;
  } while (tries < 12 && x < y.right + 20 && x + bw > y.left - 20 && yy < y.bottom + 20 && yy + bh > y.top - 20);
  noBtn.style.left = x + "px"; noBtn.style.top = yy + "px";
}
noBtn.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") moveNo(); });
noBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); moveNo(); });
noBtn.addEventListener("click", (e) => { e.preventDefault(); if (e.detail === 0) moveNo(); });
yesBtn.addEventListener("click", () => go(6));
async function enter5(t) {
  resetProposal();
  await reveal(scenes[5], t, 800);
}

/* ---------- 6 · Sim ---------- */
const wa = $("#waBtn");
if (CONFIG.whatsapp) {
  wa.hidden = false;
  wa.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagemWhatsapp)}`;
}
async function enter6(t) {
  await sleep(500);
  if (t !== token) return;
  burst(reduce ? 30 : 140);
  rain(9000);
  await reveal(scenes[6], t, 900);
}
$("#again").addEventListener("click", () => go(0));

/* ---------- Confete ---------- */
const cf = $("#confetti"), cctx = cf.getContext("2d");
let bits = [], cfRunning = false;
const CF_COLORS = ["#ff5c8a", "#ffb3c6", "#ffe3ec", "#f6d9a8", "#ff8a6b", "#c9a7ff"];
function sizeConfetti() {
  cf.width = innerWidth * devicePixelRatio; cf.height = innerHeight * devicePixelRatio;
  cctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
function addBit(x, y, vx, vy) {
  bits.push({ x, y, vx, vy, rot: rand(0, 6.28), vr: rand(-0.2, 0.2), s: rand(14, 32),
    ch: Math.random() < 0.72 ? "♥" : "✦", c: CF_COLORS[(Math.random() * CF_COLORS.length) | 0] });
  if (!cfRunning) { cfRunning = true; requestAnimationFrame(cfLoop); }
}
function burst(n) {
  for (let i = 0; i < n; i++) addBit(innerWidth / 2, innerHeight * 0.45, rand(-9, 9), rand(-17, -4));
}
function rain(ms) {
  const end = performance.now() + ms;
  (function tick() {
    if (performance.now() > end) return;
    addBit(rand(0, innerWidth), -30, rand(-1, 1), rand(1.5, 3.5));
    setTimeout(tick, reduce ? 400 : 110);
  })();
}
function cfLoop() {
  cctx.clearRect(0, 0, innerWidth, innerHeight);
  bits = bits.filter((b) => b.y < innerHeight + 50);
  for (const b of bits) {
    b.vy += 0.17; b.vx *= 0.995; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
    cctx.save(); cctx.translate(b.x, b.y); cctx.rotate(b.rot);
    cctx.fillStyle = b.c; cctx.font = b.s + "px serif"; cctx.textAlign = "center";
    cctx.fillText(b.ch, 0, 0); cctx.restore();
  }
  if (bits.length) requestAnimationFrame(cfLoop); else cfRunning = false;
}

/* ---------- Música ---------- */
let audioOk = true;
audio.addEventListener("error", () => { audioOk = false; musicBtn.hidden = true; });
function setMusicUI(on) {
  musicBtn.classList.toggle("paused", !on);
  musicBtn.setAttribute("aria-label", on ? "Pausar música" : "Tocar música");
}
function startMusic() {
  musicBtn.hidden = !audioOk;
  if (!audioOk || !audio.paused) return;
  audio.volume = 0;
  audio.play().then(() => {
    setMusicUI(true);
    let v = 0;
    const f = setInterval(() => { v = Math.min(0.7, v + 0.05); audio.volume = v; if (v >= 0.7) clearInterval(f); }, 150);
  }).catch(() => setMusicUI(false));
}
musicBtn.addEventListener("click", () => {
  if (audio.paused) { audio.volume = 0.7; audio.play().then(() => setMusicUI(true)).catch(() => {}); }
  else { audio.pause(); setMusicUI(false); }
});

/* ---------- Céu: estrelas e corações flutuando ---------- */
const sky = $("#sky"), sctx = sky.getContext("2d");
let stars = [], floaters = [];
const newFloater = (initial) => ({
  x: rand(0, innerWidth), y: initial ? rand(0, innerHeight) : innerHeight + 30,
  s: rand(10, 30), v: rand(0.25, 0.7), a: rand(0.07, 0.25), d: rand(0, 6.28)
});
function initSky() {
  sky.width = innerWidth * devicePixelRatio; sky.height = innerHeight * devicePixelRatio;
  sctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  stars = Array.from({ length: innerWidth < 600 ? 70 : 130 }, () => ({
    x: rand(0, innerWidth), y: rand(0, innerHeight), r: rand(0.4, 1.4), ph: rand(0, 6.28), sp: rand(0.0005, 0.002)
  }));
  floaters = Array.from({ length: innerWidth < 600 ? 12 : 22 }, () => newFloater(true));
}
function skyLoop(t) {
  sctx.clearRect(0, 0, innerWidth, innerHeight);
  sctx.fillStyle = "#fff";
  for (const s of stars) {
    sctx.globalAlpha = 0.25 + 0.65 * Math.abs(Math.sin(t * s.sp + s.ph));
    sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, 6.283); sctx.fill();
  }
  sctx.fillStyle = "#ff5c8a";
  for (const f of floaters) {
    if (!reduce) { f.y -= f.v; f.x += Math.sin(t / 1800 + f.d) * 0.3; }
    if (f.y < -40) Object.assign(f, newFloater(false));
    sctx.globalAlpha = f.a; sctx.font = f.s + "px serif"; sctx.fillText("♥", f.x, f.y);
  }
  sctx.globalAlpha = 1;
  requestAnimationFrame(skyLoop);
}

/* Toque na tela solta um coraçãozinho */
document.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button,a") || current === 4 || current === 0) return;
  const h = document.createElement("span");
  h.className = "tapheart"; h.textContent = "♥";
  h.style.left = e.clientX + "px"; h.style.top = e.clientY + "px";
  h.style.fontSize = rand(18, 34) + "px"; h.style.setProperty("--dx", rand(-40, 40) + "px");
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1400);
});

addEventListener("resize", () => {
  initSky(); sizeConfetti();
  if (current === 3) buildHeart();
});
initSky(); sizeConfetti();
requestAnimationFrame(skyLoop);
go(0);

/* Abre já tocando: tenta tocar ao carregar; se o navegador bloquear,
   toca no primeiro toque/clique/tecla em qualquer lugar da página. */
(function autoplay() {
  const events = ["pointerdown", "touchstart", "keydown", "click"];
  const unlock = () => { events.forEach((ev) => removeEventListener(ev, unlock, true)); startMusic(); };
  audio.volume = 0.7;
  const p = audio.play();
  if (p && p.then) {
    p.then(() => { setMusicUI(true); musicBtn.hidden = false; })
     .catch(() => events.forEach((ev) => addEventListener(ev, unlock, true)));
  }
})();
