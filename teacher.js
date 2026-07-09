const teacherScores = document.querySelector("#teacherScores");
const teacherPodium = document.querySelector("#teacherPodium");
const winnerMessage = document.querySelector("#winnerMessage");
const studentLink = document.querySelector("#studentLink");
const studentQr = document.querySelector("#studentQr");
const resetScoresBtn = document.querySelector("#resetScoresBtn");

resetScoresBtn.addEventListener("click", async () => {
  const confirmed = window.confirm("ต้องการล้างคะแนนทั้งหมดใช่ไหมคะ?");

  if (!confirmed) {
    return;
  }

  await fetch("/api/reset", { method: "POST" });
  await loadScores();
});

loadScores();
window.setInterval(loadScores, 2500);

async function loadScores() {
  try {
    const response = await fetch("/api/scores");
    const data = await response.json();
    renderStudentLink(data.links || []);
    renderScores(data.scores || []);
    renderPodium(data.scores || []);
  } catch (error) {
    teacherScores.innerHTML = `<div class="panel teacher-empty">ยังเชื่อมต่อคะแนนไม่ได้ กรุณาเปิดด้วย server.js</div>`;
    teacherPodium.innerHTML = "";
    winnerMessage.textContent = "ยังเชื่อมต่อคะแนนไม่ได้";
  }
}

function renderStudentLink(links) {
  const preferredLink = links[0]?.student || `${window.location.origin}/`;
  studentLink.textContent = preferredLink;
  studentQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(preferredLink)}`;
}

function renderScores(scores) {
  const ranked = [...scores].sort((a, b) => b.score - a.score || a.group - b.group);
  const rankMap = new Map(ranked.map((score, index) => [score.group, index + 1]));

  teacherScores.innerHTML = "";

  for (let group = 1; group <= 6; group += 1) {
    const score = scores.find((item) => item.group === group);
    const card = document.createElement("article");
    card.className = `teacher-score-card ${score ? "completed" : ""}`;

    card.innerHTML = score
      ? `
        <div class="teacher-rank">${rankLabel(rankMap.get(group))}</div>
        <h2>Group ${group}</h2>
        <div class="teacher-score">${score.score} / ${score.total}</div>
        <p>${score.correct} / ${score.totalQuestions} correct</p>
        <small>ส่งคะแนนแล้ว ${formatTime(score.finishedAt)}</small>
      `
      : `
        <div class="teacher-rank waiting">รอเล่น</div>
        <h2>Group ${group}</h2>
        <div class="teacher-score">-</div>
        <p>ยังไม่มีคะแนน</p>
        <small>คะแนนจะขึ้นเมื่อกลุ่มนี้เล่นจบ</small>
      `;

    teacherScores.appendChild(card);
  }
}

function renderPodium(scores) {
  const ranked = [...scores].sort((a, b) => b.score - a.score || a.group - b.group);
  const topThree = ranked.slice(0, 3);
  const completedCount = scores.length;

  if (completedCount === 0) {
    winnerMessage.textContent = "รอคะแนนจากนักเรียน...";
    teacherPodium.innerHTML = `
      <div class="podium-placeholder">ให้นักเรียนสแกนเข้าเล่น คะแนนจะขึ้นที่นี่เมื่อเล่นจบ</div>
    `;
    return;
  }

  winnerMessage.textContent =
    completedCount < 6
      ? `มี ${completedCount} กลุ่มส่งคะแนนแล้ว รอลุ้นอันดับต่อไป!`
      : "ครบทุกกลุ่มแล้ว ประกาศผลผู้ชนะได้เลย!";

  teacherPodium.innerHTML = topThree
    .map((score, index) => {
      const rank = index + 1;
      return `
        <article class="podium-card rank-${rank}">
          <div class="podium-medal">${podiumMedal(rank)}</div>
          <h3>Group ${score.group}</h3>
          <strong>${score.score} / ${score.total}</strong>
          <span>${score.correct} ข้อถูก</span>
        </article>
      `;
    })
    .join("");
}

function rankLabel(rank) {
  if (rank === 1) return "🥇 ที่ 1";
  if (rank === 2) return "🥈 ที่ 2";
  if (rank === 3) return "🥉 ที่ 3";
  return `⭐ ที่ ${rank}`;
}

function podiumMedal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  return "🥉";
}

function formatTime(value) {
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
