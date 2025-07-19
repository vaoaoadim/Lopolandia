let score = 0;
let combo = 0;
let comboTimeout;
let shieldCount = 1;
let freezeCount = 1;
let shieldActive = false;
let freezeActive = false;
let gameInterval;

const startBtn = document.getElementById('startBtn');
const shieldBtn = document.getElementById('shieldBtn');
const freezeBtn = document.getElementById('freezeBtn');
const scoreDisplay = document.getElementById('score');
const comboDisplay = document.getElementById('combo');
const bonusDisplay = document.getElementById('bonus');
const gameArea = document.getElementById('gameArea');
const endScreen = document.getElementById('endScreen');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

function startGame() {
  score = 0;
  combo = 0;
  shieldCount = 1;
  freezeCount = 1;
  shieldActive = false;
  freezeActive = false;
  scoreDisplay.textContent = score;
  comboDisplay.textContent = `Комбо: ${combo}`;
  bonusDisplay.textContent = '';
  endScreen.style.display = 'none';
  startBtn.disabled = true;
  shieldBtn.disabled = false;
  freezeBtn.disabled = false;

  clearInterval(gameInterval);
  gameArea.innerHTML = '';

  gameInterval = setInterval(() => {
    if (!freezeActive) {
      createBubble();
    }
  }, 800);
}

function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');

  const size = Math.random() * 40 + 40;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  const x = Math.random() * (gameArea.clientWidth - size);
  const y = Math.random() * (gameArea.clientHeight - size);
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;

  const isBomb = Math.random() < 0.1;
  if (isBomb) {
    bubble.classList.add('bomb');
  }

  gameArea.appendChild(bubble);

  const lifeTime = Math.random() * 1000 + 1500;

  bubble.addEventListener('click', () => {
    if (isBomb) {
      if (shieldActive) {
        bubble.classList.add('pop');
        setTimeout(() => {
          if (gameArea.contains(bubble)) gameArea.removeChild(bubble);
        }, 300);
        addBonus('freeze');
        shieldActive = false;
        startBtn.disabled = false;
        shieldBtn.disabled = shieldCount === 0;
        freezeBtn.disabled = freezeCount === 0;
        startBtn.textContent = 'Старт';
      } else {
        endGame(true);
      }
      return;
    }

    gameArea.removeChild(bubble);
    score++;
    combo++;
    scoreDisplay.textContent = score;
    comboDisplay.textContent = `Комбо: ${combo}`;

    clearTimeout(comboTimeout);
    comboTimeout = setTimeout(() => {
      resetCombo();
    }, 3000);

    if (combo % 10 === 0) {
      addBonus();
    }
  });

  setTimeout(() => {
    if (gameArea.contains(bubble)) {
      gameArea.removeChild(bubble);
    }
  }, lifeTime);
}

function resetCombo() {
  combo = 0;
  comboDisplay.textContent = `Комбо: ${combo}`;
}

function addBonus(type) {
  if (type === 'freeze') {
    freezeCount++;
    freezeBtn.textContent = `Заморозка (${freezeCount})`;
    bonusDisplay.textContent = 'Бонус: заморозка';
  } else {
    const bonus = Math.random() < 0.5 ? 'shield' : 'freeze';
    if (bonus === 'shield') {
      shieldCount++;
      shieldBtn.textContent = `Щит (${shieldCount})`;
      bonusDisplay.textContent = 'Бонус: щит';
    } else {
      freezeCount++;
      freezeBtn.textContent = `Заморозка (${freezeCount})`;
      bonusDisplay.textContent = 'Бонус: заморозка';
    }
  }
  setTimeout(() => {
    bonusDisplay.textContent = '';
  }, 2000);
}

function useShield() {
  if (shieldCount > 0 && !shieldActive) {
    shieldActive = true;
    shieldCount--;
    shieldBtn.textContent = `Щит (${shieldCount})`;
    startBtn.disabled = true;
    shieldBtn.disabled = true;
    freezeBtn.disabled = true;
    startBtn.textContent = 'Щит активен';
  }
}

function useFreeze() {
  if (freezeCount > 0 && !freezeActive) {
    freezeActive = true;
    freezeCount--;
    freezeBtn.textContent = `Заморозка (${freezeCount})`;
    shieldBtn.disabled = true;
    freezeBtn.disabled = true;
    startBtn.textContent = 'Заморожено';

    setTimeout(() => {
      freezeActive = false;
      startBtn.textContent = 'Старт';
      startBtn.disabled = false;
      shieldBtn.disabled = shieldCount === 0;
      freezeBtn.disabled = freezeCount === 0;
    }, 5000);
  }
}

function endGame(isBomb = false) {
  clearInterval(gameInterval);
  gameArea.innerHTML = '';
  endScreen.style.display = 'flex';
  finalScore.textContent = isBomb ? `Взорвался! Счёт: ${score}` : `Счёт: ${score}`;
}

restartBtn.addEventListener('click', startGame);
startBtn.addEventListener('click', startGame);
shieldBtn.addEventListener('click', useShield);
freezeBtn.addEventListener('click', useFreeze);
