const teacherScores = document.querySelector("#teacherScores");
const teacherPodium = document.querySelector("#teacherPodium");
const winnerMessage = document.querySelector("#winnerMessage");
const studentLink = document.querySelector("#studentLink");
const studentQr = document.querySelector("#studentQr");
const resetScoresBtn = document.querySelector("#resetScoresBtn");
const downloadScoresBtn = document.querySelector("#downloadScoresBtn");
const groupReport = document.querySelector("#groupReport");
let latestScores = [];

resetScoresBtn.addEventListener("click", async () => {
  const confirmed = window.confirm("ต้องการล้างคะแนนทั้งหมดใช่ไหมคะ?");

  if (!confirmed) {
    return;
  }

  await fetch("/api/reset", { method: "POST" });
  await loadScores();
});

downloadScoresBtn.addEventListener("click", () => {
  downloadCurrentScores();
});

loadScores();
window.setInterval(loadScores, 2500);

async function loadScores() {
  try {
    const response = await fetch("/api/scores");
    const data = await response.json();
    latestScores = data.scores || [];
    saveTeacherBackup(latestScores);
    renderStudentLink(data.links || []);
    renderScores(latestScores);
    renderPodium(latestScores);
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
        <p>${escapeHtml(score.mission || "Food Detective Challenge")}</p>
        <p>${score.correct} / ${score.totalQuestions} correct</p>
        <small>ส่งคะแนนแล้ว ${formatTime(score.finishedAt)}</small>
        <button class="report-button" type="button" data-group="${group}">ดูรายงาน / พิมพ์</button>
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

  document.querySelectorAll(".report-button").forEach((button) => {
    button.addEventListener("click", () => renderGroupReport(Number(button.dataset.group)));
  });
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

function renderGroupReport(group) {
  const score = latestScores.find((item) => item.group === group);

  if (!score) {
    groupReport.innerHTML = `<div class="report-empty">ยังไม่มีข้อมูลของ Group ${group}</div>`;
    return;
  }

  const rows = (score.answers || [])
    .map((answer, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(answer.word)}</td>
        <td>${escapeHtml(answer.selectedCategory)}</td>
        <td>${escapeHtml(answer.correctCategory)}</td>
        <td class="${answer.isCorrect ? "report-correct" : "report-wrong"}">
          ${answer.isCorrect ? "ถูก" : "ผิด"}
        </td>
      </tr>
    `)
    .join("");

  groupReport.innerHTML = `
    <div class="report-header">
      <div>
        <p class="mission-label">หลักฐานการเล่นเกม</p>
        <h2>รายงาน Group ${score.group}</h2>
        <p>${escapeHtml(score.mission || "Food Detective Challenge")} • Young Healthy Chef</p>
      </div>
      <button id="printReportBtn" class="report-print-button" type="button">พิมพ์รายงาน</button>
    </div>
    <div class="report-summary">
      <div><strong>${score.score} / ${score.total}</strong><span>คะแนนรวม</span></div>
      <div><strong>${score.correct} / ${score.totalQuestions}</strong><span>จำนวนข้อถูก</span></div>
      <div><strong>${formatDateTime(score.finishedAt)}</strong><span>เวลาส่งคะแนน</span></div>
    </div>
    <table class="report-table">
      <thead>
        <tr>
          <th>ข้อ</th>
          <th>คำศัพท์</th>
          <th>คำตอบนักเรียน</th>
          <th>เฉลย</th>
          <th>ผล</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="report-signature">
      <span>ลงชื่อครูผู้สอน ____________________________</span>
      <span>วันที่ ____________________________</span>
    </div>
  `;

  document.querySelector("#printReportBtn").addEventListener("click", () => {
    document.body.classList.add("report-printing");
    window.print();
    window.setTimeout(() => document.body.classList.remove("report-printing"), 500);
  });

  groupReport.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveTeacherBackup(scores) {
  if (!scores.length) {
    return;
  }

  try {
    localStorage.setItem("foodDetectiveLatestScores", JSON.stringify({
      savedAt: new Date().toISOString(),
      scores
    }));
  } catch (error) {
    // If storage is unavailable, the server copy still remains the source of truth.
  }
}

function downloadCurrentScores() {
  const backup = readTeacherBackup();
  const scores = latestScores.length ? latestScores : backup.scores;

  if (!scores.length) {
    window.alert("ยังไม่มีคะแนนให้ดาวน์โหลดค่ะ");
    return;
  }

  const stamp = fileStamp();
  downloadTextFile(`food-detective-scores-${stamp}.csv`, buildScoresCsv(scores), "text/csv;charset=utf-8");
  downloadTextFile(
    `food-detective-backup-${stamp}.json`,
    JSON.stringify({ exportedAt: new Date().toISOString(), scores }, null, 2),
    "application/json;charset=utf-8"
  );
}

function readTeacherBackup() {
  try {
    return JSON.parse(localStorage.getItem("foodDetectiveLatestScores") || "{\"scores\":[]}");
  } catch (error) {
    return { scores: [] };
  }
}

function buildScoresCsv(scores) {
  const rows = [[
    "Group",
    "Mission",
    "Score",
    "Total",
    "Correct",
    "Total Questions",
    "Question",
    "Word",
    "Student Answer",
    "Correct Answer",
    "Result",
    "Finished At"
  ]];

  scores.forEach((score) => {
    const answers = Array.isArray(score.answers) && score.answers.length > 0 ? score.answers : [{}];

    answers.forEach((answer, index) => {
      rows.push([
        `Group ${score.group}`,
        score.mission || "",
        score.score,
        score.total,
        score.correct,
        score.totalQuestions,
        index + 1,
        answer.word || "",
        answer.selectedCategory || "",
        answer.correctCategory || "",
        answer.isCorrect === undefined ? "" : answer.isCorrect ? "Correct" : "Wrong",
        score.finishedAt || ""
      ]);
    });
  });

  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadTextFile(filename, content, type) {
  const blob = new Blob([type.includes("csv") ? `\ufeff${content}` : content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function fileStamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(value) {
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}
