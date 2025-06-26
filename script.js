const popSoundUrl = "https://actions.google.com/sounds/v1/cartoon/pop.ogg";

const bubbleContainer = document.getElementById('bubble-container');
const counterDisplay = document.getElementById('counter');
const resetBtn = document.getElementById('reset-btn');

let poppedCount = 0;
let bubbleGeneratorTimeout;

const colors = ['#00bfff', '#ff69b4', '#7fff00', '#ff4500', '#ffa500', '#9370db', '#40e0d0'];
const popAudio = new Audio(popSoundUrl);
popAudio.volume = 0.3;

// Unlock audio on first user interaction to avoid autoplay blocking
function unlockAudio() {
  popAudio.play().then(() => {
    popAudio.pause();
    popAudio.currentTime = 0;
    window.removeEventListener('click', unlockAudio);
  }).catch(() => {
    // Ignore errors if any
  });
}
// Listen for any first click on the page to unlock audio playback
window.addEventListener('click', unlockAudio);

function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');

  const size = Math.random() * 50 + 30;
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';

  bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  const containerWidth = bubbleContainer.clientWidth;
  const x = Math.random() * (containerWidth - size);
  bubble.style.left = x + 'px';
  bubble.style.top = (bubbleContainer.clientHeight + size) + 'px';

  bubbleContainer.appendChild(bubble);

  const duration = 20000 + Math.random() * 15000;
  const startTime = performance.now();

  bubble._animation = {startTime, duration, size, x};

  bubble.addEventListener('click', () => {
    popBubble(bubble);
  });
}

function popBubble(bubble) {
  const sound = popAudio.cloneNode();
  sound.play();

  poppedCount++;
  counterDisplay.textContent = `Popped Bubbles: ${poppedCount}`;

  bubble.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  bubble.style.transform = 'scale(1.5)';
  bubble.style.opacity = '0';

  setTimeout(() => {
    bubble.remove();
  }, 300);
}

function animateBubbles(time = performance.now()) {
  const bubbles = bubbleContainer.querySelectorAll('.bubble');
  bubbles.forEach(bubble => {
    const anim = bubble._animation;
    if (!anim) return;

    const elapsed = time - anim.startTime;
    if (elapsed >= anim.duration) {
      bubble.remove();
      return;
    }

    const containerHeight = bubbleContainer.clientHeight;
    const progress = elapsed / anim.duration;
    const y = containerHeight + anim.size - progress * (containerHeight + anim.size * 2);

    bubble.style.top = y + 'px';

    const oscillation = Math.sin(progress * 2 * Math.PI * 2) * 20;
    bubble.style.left = (anim.x + oscillation) + 'px';
  });

  requestAnimationFrame(animateBubbles);
}

function bubbleGenerator() {
  createBubble();
  bubbleGeneratorTimeout = setTimeout(bubbleGenerator, 500);
}

resetBtn.addEventListener('click', () => {
  // Reset counter
  poppedCount = 0;
  counterDisplay.textContent = `Popped Bubbles: ${poppedCount}`;

  // Remove all bubbles
  bubbleContainer.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
});

bubbleGenerator();
animateBubbles();
