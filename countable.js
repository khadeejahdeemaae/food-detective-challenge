const categories = [
  { id: "a", label: "a" },
  { id: "an", label: "an" },
  { id: "some", label: "some" }
];

const foods = [
  { word: "apple", emoji: "🍎", answer: "an", phrase: "an apple", hint: "apple starts with a vowel sound" },
  { word: "orange", emoji: "🍊", answer: "an", phrase: "an orange", hint: "orange starts with a vowel sound" },
  { word: "egg", emoji: "🥚", answer: "an", phrase: "an egg", hint: "egg starts with a vowel sound" },
  { word: "onion", emoji: "🧅", answer: "an", phrase: "an onion", hint: "onion starts with a vowel sound" },
  { word: "ice cream", emoji: "🍨", answer: "an", phrase: "an ice cream", hint: "one ice cream starts with a vowel sound" },
  { word: "avocado", emoji: "🥑", answer: "an", phrase: "an avocado", hint: "avocado starts with a vowel sound" },
  { word: "umbrella snack", emoji: "☂️", answer: "an", phrase: "an umbrella snack", hint: "umbrella starts with a vowel sound" },
  { word: "banana", emoji: "🍌", answer: "a", phrase: "a banana", hint: "banana starts with a consonant sound" },
  { word: "carrot", emoji: "🥕", answer: "a", phrase: "a carrot", hint: "carrot starts with a consonant sound" },
  { word: "sandwich", emoji: "🥪", answer: "a", phrase: "a sandwich", hint: "sandwich starts with a consonant sound" },
  { word: "cookie", emoji: "🍪", answer: "a", phrase: "a cookie", hint: "cookie starts with a consonant sound" },
  { word: "cake", emoji: "🍰", answer: "a", phrase: "a cake", hint: "cake starts with a consonant sound" },
  { word: "doughnut", emoji: "🍩", answer: "a", phrase: "a doughnut", hint: "doughnut starts with a consonant sound" },
  { word: "potato", emoji: "🥔", answer: "a", phrase: "a potato", hint: "potato starts with a consonant sound" },
  { word: "tomato", emoji: "🍅", answer: "a", phrase: "a tomato", hint: "tomato starts with a consonant sound" },
  { word: "mushroom", emoji: "🍄", answer: "a", phrase: "a mushroom", hint: "mushroom starts with a consonant sound" },
  { word: "pancake", emoji: "🥞", answer: "a", phrase: "a pancake", hint: "pancake starts with a consonant sound" },
  { word: "watermelon", emoji: "🍉", answer: "a", phrase: "a watermelon", hint: "watermelon starts with a consonant sound" },
  { word: "rice", emoji: "🍚", answer: "some", phrase: "some rice", hint: "rice is usually uncountable" },
  { word: "milk", emoji: "🥛", answer: "some", phrase: "some milk", hint: "milk is usually uncountable" },
  { word: "water", emoji: "💧", answer: "some", phrase: "some water", hint: "water is usually uncountable" },
  { word: "juice", emoji: "🧃", answer: "some", phrase: "some juice", hint: "juice is usually uncountable" },
  { word: "tea", emoji: "🍵", answer: "some", phrase: "some tea", hint: "tea is usually uncountable" },
  { word: "coffee", emoji: "☕", answer: "some", phrase: "some coffee", hint: "coffee is usually uncountable" },
  { word: "bread", emoji: "🍞", answer: "some", phrase: "some bread", hint: "bread is usually uncountable" },
  { word: "cheese", emoji: "🧀", answer: "some", phrase: "some cheese", hint: "cheese is usually uncountable" },
  { word: "meat", emoji: "🥩", answer: "some", phrase: "some meat", hint: "meat is usually uncountable" },
  { word: "soup", emoji: "🥣", answer: "some", phrase: "some soup", hint: "soup is usually uncountable" },
  { word: "sugar", emoji: "🍬", answer: "some", phrase: "some sugar", hint: "sugar is usually uncountable" },
  { word: "butter", emoji: "🧈", answer: "some", phrase: "some butter", hint: "butter is usually uncountable" },
  { word: "honey", emoji: "🍯", answer: "some", phrase: "some honey", hint: "honey is usually uncountable" },
  { word: "flour", emoji: "🌾", answer: "some", phrase: "some flour", hint: "flour is usually uncountable" },
  { word: "lettuce", emoji: "🥬", answer: "some", phrase: "some lettuce", hint: "lettuce is usually uncountable" },
  { word: "salad", emoji: "🥗", answer: "some", phrase: "some salad", hint: "salad is often used with some in this lesson" },
  { word: "corn", emoji: "🌽", answer: "some", phrase: "some corn", hint: "corn is often used with some" },
  { word: "cereal", emoji: "🥣", answer: "some", phrase: "some cereal", hint: "cereal is often used with some" }
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
const hintText = document.querySelector("#hintText");
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

document.querySelector("#startGameBtn").addEventListener("click", () => showScreen("rules"));
document.querySelector("#startMissionBtn").addEventListener("click", startMission);
document.querySelector("#playAgainBtn").addEventListener("click", resetGame);
musicToggleBtn.addEventListener("click", toggleMusic);

document.querySelectorAll(".group-choice").forEach((button) => {
  button.addEventListener("click", () => {
    state.groupIndex = Number(button.dataset.group);
    document.querySelectorAll(".group-choice").forEach((choice) => choice.classList.remove("selected"));
    button.classList.add("selected");
  });
});

function showScreen(name) {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

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
  state.deck = buildDeck();

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

function buildDeck() {
  const aWords = shuffle(foods.filter((food) => food.answer === "a")).slice(0, 7);
  const anWords = shuffle(foods.filter((food) => food.answer === "an")).slice(0, 6);
  const someWords = shuffle(foods.filter((food) => food.answer === "some")).slice(0, 7);
  return shuffle([...aWords, ...anWords, ...someWords]);
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
  stopTimer();
  clearCelebration();

  if (state.roundIndex >= state.deck.length) {
    finishGame();
    return;
  }

  const currentFood = state.deck[state.roundIndex];
  roundCounter.textContent = `Round ${state.roundIndex + 1} / ${state.deck.length}`;
  currentGroupBadge.textContent = `Group ${state.groupIndex + 1}`;
  renderCuteFoodArt(foodPicture, currentFood);
  foodWord.textContent = `___ ${currentFood.word}`;
  hintText.textContent = `Clue: ${currentFood.hint}`;
  state.acceptingAnswers = true;

  answerButtons.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `answer-button grammar-answer ${category.id}`;
    button.type = "button";
    button.textContent = category.label;
    button.addEventListener("click", () => handleAnswer(category.id));
    answerButtons.appendChild(button);
  });

  startTimer();
}

function handleAnswer(selectedCategory) {
  if (!state.acceptingAnswers) {
    return;
  }

  state.acceptingAnswers = false;
  stopTimer();

  const currentFood = state.deck[state.roundIndex];
  const isCorrect = selectedCategory === currentFood.answer;
  const selectedLabel = selectedCategory === "timeout" ? "No answer" : selectedCategory;

  state.answers.push({
    word: currentFood.word,
    selectedCategory: selectedLabel,
    correctCategory: currentFood.phrase,
    isCorrect
  });

  if (isCorrect) {
    state.score += 10;
    showFeedback("Excellent!", "The correct phrase is", currentFood.phrase, "+10 Points", true);
  } else {
    showFeedback("Oops!", "The correct phrase is", currentFood.phrase, "0 Points", false);
  }

  renderScoreboard();
  window.setTimeout(() => {
    state.roundIndex += 1;
    renderQuestion();
    showScreen("game");
  }, 1800);
}

function showFeedback(title, text, category, points, isCorrect) {
  feedbackCard.classList.toggle("wrong", !isCorrect);
  feedbackTitle.textContent = title;
  feedbackText.textContent = text;
  feedbackCategory.textContent = category;
  feedbackPoints.textContent = points;
  showScreen("feedback");

  if (isCorrect) {
    playHappySound();
    makeConfetti();
  } else {
    playWrongSound();
  }
}

function startTimer() {
  state.timeLeft = 20;
  timerBadge.textContent = `⏱ ${state.timeLeft}`;

  state.timerId = window.setInterval(() => {
    state.timeLeft -= 1;
    timerBadge.textContent = `⏱ ${state.timeLeft}`;

    if (state.timeLeft <= 0) {
      handleAnswer("timeout");
    }
  }, 1000);
}

function stopTimer() {
  window.clearInterval(state.timerId);
  state.timerId = null;
}

function finishGame() {
  stopTimer();
  stopMusic();
  renderFinalRanking();
  showScreen("end");
  makeFireworks();
  submitScore();
}

function renderFinalRanking() {
  rankingList.innerHTML = `
    <div class="ranking-row winner">
      <span>🏆 Group ${state.groupIndex + 1}</span>
      <strong>${state.score} / ${state.deck.length * 10}</strong>
    </div>
    <div class="ranking-row">
      <span>Correct Answers</span>
      <strong>${state.answers.filter((answer) => answer.isCorrect).length} / ${state.deck.length}</strong>
    </div>
    <div class="ranking-row">
      <span>Mission</span>
      <strong>a, an or some</strong>
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
        mission: "Mission 2: Smart Chef Challenge - a, an or some",
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
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function startMusic() {
  state.musicOn = true;
  musicToggleBtn.textContent = "Music On";
  state.audio = new (window.AudioContext || window.webkitAudioContext)();
  state.musicTimerId = window.setInterval(playMusicNote, 420);
  playMusicNote();
}

function stopMusic() {
  window.clearInterval(state.musicTimerId);
  state.musicTimerId = null;
}

function toggleMusic() {
  if (state.musicOn) {
    state.musicOn = false;
    stopMusic();
    musicToggleBtn.textContent = "Music";
    return;
  }

  startMusic();
}

function playMusicNote() {
  if (!state.audio || !state.musicOn) {
    return;
  }

  const notes = [523, 659, 784, 659, 698, 587];
  playTone(notes[Math.floor(Math.random() * notes.length)], 0.07, 0.025);
}

function playHappySound() {
  [660, 880, 1046].forEach((frequency, index) => {
    window.setTimeout(() => playTone(frequency, 0.12, 0.08), index * 70);
  });
}

function playWrongSound() {
  [260, 190].forEach((frequency, index) => {
    window.setTimeout(() => playTone(frequency, 0.12, 0.06), index * 90);
  });
}

function playTone(frequency, duration, volume) {
  const context = state.audio || new (window.AudioContext || window.webkitAudioContext)();
  state.audio = context;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

function makeConfetti() {
  for (let index = 0; index < 36; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = `${Math.random() * 30}%`;
    piece.style.background = ["#ff5c8a", "#ffd84d", "#48d597", "#6fd3ff"][index % 4];
    piece.style.animationDelay = `${Math.random() * 0.25}s`;
    celebrationLayer.appendChild(piece);
  }
}

function makeFireworks() {
  for (let index = 0; index < 60; index += 1) {
    const firework = document.createElement("span");
    firework.className = "firework";
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.top = `${Math.random() * 100}%`;
    firework.style.background = ["#ff5c8a", "#ffd84d", "#48d597", "#6fd3ff", "#b387ff"][index % 5];
    firework.style.animationDelay = `${Math.random() * 0.8}s`;
    celebrationLayer.appendChild(firework);
  }
}

function clearCelebration() {
  celebrationLayer.innerHTML = "";
}
