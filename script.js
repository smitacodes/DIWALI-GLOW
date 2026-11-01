const senderInput = document.getElementById("sender");
const receiverInput = document.getElementById("receiver");
const messageInput = document.getElementById("customMessage");
const resultBox = document.getElementById("personalResult");
const resultTo = document.getElementById("resultTo");
const resultMessage = document.getElementById("resultMessage");
const resultFrom = document.getElementById("resultFrom");
const shareNote = document.getElementById("shareNote");

function createGreeting() {
  const sender = senderInput.value.trim() || "A friend";
  const receiver = receiverInput.value.trim();
  const custom = messageInput.value.trim();
  const message = custom || "May your home glow with happiness, your heart shine with love, and your days sparkle with new hopes. Wishing you a joyful and prosperous Diwali!";
  resultTo.textContent = receiver ? `Dear ${receiver},` : "A special wish for you,";
  resultMessage.textContent = message;
  resultFrom.textContent = `With warm wishes, ${sender}`;
  resultBox.hidden = false;
  shareNote.textContent = "";
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function getShareText() {
  const to = resultTo.textContent;
  const greeting = resultMessage.textContent;
  const from = resultFrom.textContent;
  return `${to}\n\n✨ Happy Diwali! ✨\n${greeting}\n\n${from}\n\n🪔 Celebrate the festival of lights!`;
}

document.getElementById("createBtn").addEventListener("click", createGreeting);

document.getElementById("shareBtn").addEventListener("click", async () => {
  const text = getShareText();
  if (navigator.share) {
    try {
      await navigator.share({ title: "My Diwali Greeting", text });
      shareNote.textContent = "Your greeting is ready to share!";
    } catch (error) {
      if (error.name !== "AbortError") shareNote.textContent = "Sharing was not available. You can copy your greeting instead.";
    }
  } else if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      shareNote.textContent = "Greeting copied! Paste it into WhatsApp or a message.";
    } catch {
      shareNote.textContent = "Please select and copy the greeting text.";
    }
  } else {
    shareNote.textContent = "Sharing is supported when this website is published online. You can copy the greeting text manually.";
  }
});

// Small original festive melody made with browser tones; no music file or copyrighted song.
let audioContext = null;
let musicTimer = null;
let noteIndex = 0;
const musicButton = document.getElementById("musicBtn");
const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];

function playNote(frequency) {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.45);
}
async function toggleMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
    musicButton.innerHTML = "♫ <span>Play music</span>";
    musicButton.setAttribute("aria-pressed", "false");
    return;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    musicButton.querySelector("span").textContent = "Music unavailable";
    return;
  }
  audioContext = audioContext || new AudioCtx();
  if (audioContext.state === "suspended") await audioContext.resume();
  playNote(notes[noteIndex++ % notes.length]);
  musicTimer = setInterval(() => playNote(notes[noteIndex++ % notes.length]), 480);
  musicButton.innerHTML = "♫ <span>Pause music</span>";
  musicButton.setAttribute("aria-pressed", "true");
}
musicButton.addEventListener("click", toggleMusic);

// Gentle canvas fireworks.
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let width = 0, height = 0, lastBurst = 0;
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function burst(x, y) {
  const colors = ["#ffd778", "#ff9d9d", "#b8a4ff", "#fff0b5", "#ffbd69"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const count = 34;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 0.8 + Math.random() * 2.1;
    particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 55 + Math.random() * 20, maxLife: 75, color,
      size: 1 + Math.random() * 1.5
    });
  }
}
function animateFireworks(time) {
  ctx.clearRect(0, 0, width, height);
  if (time - lastBurst > 1500 && Math.random() > 0.25) {
    burst(width * (0.12 + Math.random() * 0.76), height * (0.12 + Math.random() * 0.42));
    lastBurst = time;
  }
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.012; p.vx *= 0.99; p.life--;
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateFireworks);
}
requestAnimationFrame(animateFireworks);
