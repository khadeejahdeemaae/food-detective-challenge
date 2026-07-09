const categories = [
  { id: "bakery", label: "🥐 Bakery" },
  { id: "fruits", label: "🍎 Fruits" },
  { id: "vegetables", label: "🥦 Vegetables" },
  { id: "meat", label: "🥩 Meat & Eggs" },
  { id: "beverage", label: "🥛 Beverage" }
];

const foods = [
  { word: "Apple", emoji: "🍎", category: "fruits" },
  { word: "Banana", emoji: "🍌", category: "fruits" },
  { word: "Orange", emoji: "🍊", category: "fruits" },
  { word: "Grapes", emoji: "🍇", category: "fruits" },
  { word: "Watermelon", emoji: "🍉", category: "fruits" },
  { word: "Strawberry", emoji: "🍓", category: "fruits" },
  { word: "Pineapple", emoji: "🍍", category: "fruits" },
  { word: "Mango", emoji: "🥭", category: "fruits" },
  { word: "Cherry", emoji: "🍒", category: "fruits" },
  { word: "Peach", emoji: "🍑", category: "fruits" },
  { word: "Bread", emoji: "🍞", category: "bakery" },
  { word: "Cake", emoji: "🍰", category: "bakery" },
  { word: "Cookies", emoji: "🍪", category: "bakery" },
  { word: "Croissant", emoji: "🥐", category: "bakery" },
  { word: "Pancakes", emoji: "🥞", category: "bakery" },
  { word: "Doughnut", emoji: "🍩", category: "bakery" },
  { word: "Pretzel", emoji: "🥨", category: "bakery" },
  { word: "Rice", emoji: "🍚", category: "bakery" },
  { word: "Noodles", emoji: "🍜", category: "bakery" },
  { word: "Sandwich", emoji: "🥪", category: "bakery" },
  { word: "Milk", emoji: "🥛", category: "beverage" },
  { word: "Water", emoji: "💧", category: "beverage" },
  { word: "Juice", emoji: "🧃", category: "beverage" },
  { word: "Tea", emoji: "🍵", category: "beverage" },
  { word: "Coffee", emoji: "☕", category: "beverage" },
  { word: "Smoothie", emoji: "🥤", category: "beverage" },
  { word: "Lemonade", emoji: "🍋", category: "beverage" },
  { word: "Hot Chocolate", emoji: "🍫", category: "beverage" },
  { word: "Egg", emoji: "🥚", category: "meat" },
  { word: "Fish", emoji: "🐟", category: "meat" },
  { word: "Chicken", emoji: "🍗", category: "meat" },
  { word: "Meat", emoji: "🥩", category: "meat" },
  { word: "Cheese", emoji: "🧀", category: "meat" },
  { word: "Shrimp", emoji: "🍤", category: "meat" },
  { word: "Sausage", emoji: "🌭", category: "meat" },
  { word: "Carrot", emoji: "🥕", category: "vegetables" },
  { word: "Broccoli", emoji: "🥦", category: "vegetables" },
  { word: "Potato", emoji: "🥔", category: "vegetables" },
  { word: "Corn", emoji: "🌽", category: "vegetables" },
  { word: "Lettuce", emoji: "🥬", category: "vegetables" },
  { word: "Salad", emoji: "🥗", category: "vegetables" },
  { word: "Tomato", emoji: "🍅", category: "vegetables" },
  { word: "Cucumber", emoji: "🥒", category: "vegetables" },
  { word: "Mushroom", emoji: "🍄", category: "vegetables" },
  { word: "Onion", emoji: "🧅", category: "vegetables" }
];

const screens = {
  start: document.querySelector("#startScreen"),
  rules: document.querySelector("#rulesScreen"),
  game: document.querySelector("#gameScreen"),
  feedback: document.querySelector("#feedbackScreen"),
  end: document.querySelector("#endScreen")
};

const state = {
  groupIndex: 0,
  score: 0,
  roundIndex: 0,
  deck: [],
  answers: [],
  submitted: false,
  timeLeft: 20,
  timerId: null,
  acceptingAnswers: false,
  musicOn: false,
  musicTimerId: null,
  audio: null
};

const scoreList = document.querySelector("#scoreList");
const roundCounter = document.querySelector("#roundCounter");
const currentGroupBadge = document.querySelector("#currentGroupBadge");
const foodPicture = document.querySelector("#foodPicture");
const foodWord = document.querySelector("#foodWord");
const answerButtons = document.querySelector("#answerButtons");
const feedbackCard = document.querySelector("#feedbackCard");
const feedbackTitle = document.querySelector("#feedbackTitle");
const feedbackText = document.querySelector("#feedbackText");
const feedbackCategory = document.querySelector("#feedbackCategory");
const feedbackPoints = document.querySelector("#feedbackPoints");
const rankingList = document.querySelector("#rankingList");
const celebrationLayer = document.querySelector("#celebrationLayer");
const submitStatus = document.querySelector("#submitStatus");
const timerBadge = document.querySelector("#timerBadge");
const musicToggleBtn = document.querySelector("#musicToggleBtn");
const shareFacebookBtn = document.querySelector("#shareFacebookBtn");

document.querySelector("#startGameBtn").addEventListener("click", () => showScreen("rules"));
document.querySelector("#startMissionBtn").addEventListener("click", startMission);
document.querySelector("#playAgainBtn").addEventListener("click", resetGame);
musicToggleBtn.addEventListener("click", toggleMusic);
shareFacebookBtn.addEventListener("click", shareOnFacebook);

document.querySelectorAll(".group-choice").forEach((button) => {
  button.addEventListener("click", () => {
    state.groupIndex = Number(button.dataset.group);
    document.querySelectorAll(".group-choice").forEach((choice) => choice.classList.remove("selected"));
    button.classList.add("selected");
  });
});

function showScreen(name) {
  Object.entries(screens).forEach(([screenName, element]) => {
    const isActive = screenName === name;
    element.classList.toggle("screen-active", isActive);
    element.setAttribute("aria-hidden", String(!isActive));
  });
}

function startMission() {
  state.score = 0;
  state.roundIndex = 0;
  state.answers = [];
  state.submitted = false;
  state.deck = buildShortDeck();
  if (!state.musicOn) {
    startMusic();
  }
  renderScoreboard();
  renderQuestion();
  showScreen("game");
}

function resetGame() {
  stopTimer();
  clearCelebration();
  showScreen("start");
}

function buildShortDeck() {
  const selectedFoods = categories.flatMap((category) => {
    const categoryFoods = foods.filter((food) => food.category === category.id);
    return shuffle([...categoryFoods]).slice(0, 5);
  });

  return shuffle(selectedFoods);
}

function renderScoreboard() {
  scoreList.innerHTML = "";

  for (let index = 0; index < 6; index += 1) {
    const row = document.createElement("div");
    row.className = `score-row ${index === state.groupIndex ? "active" : ""}`;
    row.innerHTML = `
      <span>Group ${index + 1}</span>
      <strong>${index === state.groupIndex ? state.score : "-"}</strong>
    `;
    scoreList.appendChild(row);
  }
}

function renderQuestion() {
  const question = state.deck[state.roundIndex];
  roundCounter.textContent = `Round ${state.roundIndex + 1} / ${state.deck.length}`;
  currentGroupBadge.textContent = `Group ${state.groupIndex + 1}`;
  foodPicture.textContent = question.emoji;
  foodWord.textContent = question.word;
  answerButtons.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.dataset.category = category.id;
    button.textContent = category.label;
    button.addEventListener("click", () => checkAnswer(category.id));
    answerButtons.appendChild(button);
  });

  renderScoreboard();
  startTimer();
}

function checkAnswer(categoryId) {
  if (!state.acceptingAnswers) {
    return;
  }

  stopTimer();
  const question = state.deck[state.roundIndex];
  const correctCategory = categories.find((category) => category.id === question.category);
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const isCorrect = categoryId === question.category;

  if (isCorrect) {
    state.score += 10;
    playHappySound();
    launchConfetti(42);
  }

  state.answers.push({
    word: question.word,
    correctCategory: correctCategory.label,
    selectedCategory: selectedCategory.label,
    isCorrect
  });

  showAnswerFeedback({
    question,
    correctCategory,
    isCorrect,
    title: isCorrect ? "🎉 Excellent!" : "Oops!",
    points: isCorrect ? "+10 Points" : "0 Points"
  });
}

function handleTimeUp() {
  if (!state.acceptingAnswers) {
    return;
  }

  stopTimer();
  const question = state.deck[state.roundIndex];
  const correctCategory = categories.find((category) => category.id === question.category);

  state.answers.push({
    word: question.word,
    correctCategory: correctCategory.label,
    selectedCategory: "Time Up",
    isCorrect: false
  });

  playTimeUpSound();
  showAnswerFeedback({
    question,
    correctCategory,
    isCorrect: false,
    title: "⏰ Time's Up!",
    points: "0 Points"
  });
}

function showAnswerFeedback({ question, correctCategory, isCorrect, title, points }) {
  feedbackCard.classList.toggle("wrong", !isCorrect);
  feedbackTitle.textContent = title;
  feedbackText.textContent = `${question.word} belongs to`;
  feedbackCategory.textContent = correctCategory.label;
  feedbackPoints.textContent = points;
  showScreen("feedback");

  window.setTimeout(() => {
    clearCelebration();
    nextTurn();
  }, isCorrect ? 1600 : 1400);
}

function nextTurn() {
  state.roundIndex += 1;

  if (state.roundIndex >= state.deck.length) {
    showEndScreen();
    return;
  }

  renderQuestion();
  showScreen("game");
}

function showEndScreen() {
  stopTimer();
  renderScoreboard();
  renderRankings();
  launchFireworks();
  showScreen("end");
  submitScore();
}

function startTimer() {
  stopTimer();
  state.timeLeft = 20;
  state.acceptingAnswers = true;
  updateTimerBadge();

  state.timerId = window.setInterval(() => {
    state.timeLeft -= 1;
    updateTimerBadge();

    if (state.timeLeft <= 0) {
      handleTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  state.acceptingAnswers = false;

  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimerBadge() {
  if (!timerBadge) {
    return;
  }

  timerBadge.textContent = `⏱ ${state.timeLeft}`;
  timerBadge.classList.toggle("timer-warning", state.timeLeft <= 10 && state.timeLeft > 5);
  timerBadge.classList.toggle("timer-danger", state.timeLeft <= 5);
}

function getAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return null;
  }

  if (!state.audio) {
    state.audio = new AudioContext();
  }

  return state.audio;
}

function startMusic() {
  const audio = getAudio();

  if (!audio) {
    return;
  }

  state.musicOn = true;
  musicToggleBtn.textContent = "🔊 Music";

  if (state.musicTimerId) {
    return;
  }

  playMusicLoop();
  state.musicTimerId = window.setInterval(playMusicLoop, 3600);
}

function stopMusic() {
  state.musicOn = false;
  musicToggleBtn.textContent = "🔇 Music";

  if (state.musicTimerId) {
    window.clearInterval(state.musicTimerId);
    state.musicTimerId = null;
  }
}

function toggleMusic() {
  if (state.musicOn) {
    stopMusic();
  } else {
    startMusic();
  }
}

function playMusicLoop() {
  if (!state.musicOn) {
    return;
  }

  const audio = getAudio();

  if (!audio) {
    return;
  }

  const melody = [392, 440, 523.25, 440, 392, 329.63, 392, 523.25];

  melody.forEach((note, index) => {
    playTone(note, 0.16, audio.currentTime + index * 0.42, 0.035, "sine");
  });
}

function playTone(frequency, duration, startTime, volume = 0.1, type = "triangle") {
  const audio = getAudio();

  if (!audio) {
    return;
  }

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

function renderRankings() {
  const maxScore = state.deck.length * 10;
  rankingList.innerHTML = `
    <div class="ranking-row">
      <span>🏁 Your Group</span>
      <span>Group ${state.groupIndex + 1}</span>
      <strong>${state.score} / ${maxScore}</strong>
    </div>
    <div class="ranking-row">
      <span>✅ Correct</span>
      <span>${state.answers.filter((answer) => answer.isCorrect).length} answers</span>
      <strong>${Math.round((state.score / maxScore) * 100)}%</strong>
    </div>
  `;
}

async function submitScore() {
  if (state.submitted || !submitStatus) {
    return;
  }

  state.submitted = true;
  submitStatus.textContent = "กำลังส่งคะแนนไปที่หน้าจอครู...";

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group: state.groupIndex + 1,
        score: state.score,
        total: state.deck.length * 10,
        correct: state.answers.filter((answer) => answer.isCorrect).length,
        totalQuestions: state.deck.length,
        answers: state.answers,
        finishedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error("Score submit failed");
    }

    submitStatus.textContent = "ส่งคะแนนไปที่หน้าจอครูแล้ว";
  } catch (error) {
    submitStatus.textContent = "ยังส่งคะแนนไม่ได้ กรุณาเปิดเกมผ่านลิงก์จากเครื่องครู";
  }
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function playHappySound() {
  const audio = getAudio();

  if (!audio) {
    return;
  }

  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((note, index) => {
    playTone(note, 0.18, audio.currentTime + index * 0.09, 0.16, "triangle");
  });
}

function playTimeUpSound() {
  const audio = getAudio();

  if (!audio) {
    return;
  }

  [392, 330, 262].forEach((note, index) => {
    playTone(note, 0.16, audio.currentTime + index * 0.12, 0.09, "square");
  });
}

function shareOnFacebook() {
  const shareUrl = encodeURIComponent(window.location.origin);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  window.open(facebookUrl, "_blank", "noopener,noreferrer,width=720,height=640");
}

function launchConfetti(count) {
  const colors = ["#ff5d8f", "#ffd84d", "#45c46a", "#40b6ff", "#8d6bff", "#ff9f1c"];

  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = `${Math.random() * 15}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.22}s`;
    celebrationLayer.appendChild(piece);
  }
}

function launchFireworks() {
  clearCelebration();
  const colors = ["#ff5d8f", "#ffd84d", "#45c46a", "#40b6ff", "#8d6bff", "#ff9f1c"];

  for (let burst = 0; burst < 9; burst += 1) {
    const originX = 16 + Math.random() * 68;
    const originY = 12 + Math.random() * 48;

    for (let spark = 0; spark < 18; spark += 1) {
      const particle = document.createElement("span");
      const angle = (Math.PI * 2 * spark) / 18;
      const distance = 70 + Math.random() * 80;
      particle.className = "firework";
      particle.style.left = `${originX}%`;
      particle.style.top = `${originY}%`;
      particle.style.background = colors[(spark + burst) % colors.length];
      particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      particle.style.animationDelay = `${burst * 0.18}s`;
      celebrationLayer.appendChild(particle);
    }
  }
}

function clearCelebration() {
  celebrationLayer.innerHTML = "";
}
