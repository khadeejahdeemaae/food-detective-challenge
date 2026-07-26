const reviewStatus = document.querySelector("#reviewStatus");
const reviewGroupButtons = document.querySelector("#reviewGroupButtons");
const reviewFocus = document.querySelector("#reviewFocus");
const reviewTableWrap = document.querySelector("#reviewTableWrap");
const printReviewBtn = document.querySelector("#printReviewBtn");
const downloadReviewBtn = document.querySelector("#downloadReviewBtn");

let reviewScores = [];
let activeGroup = "all";

printReviewBtn.addEventListener("click", () => {
  document.body.classList.add("review-printing");
  window.print();
  window.setTimeout(() => document.body.classList.remove("review-printing"), 500);
});

downloadReviewBtn.addEventListener("click", () => {
  const answers = getFilteredAnswers();

  if (!answers.length) {
    window.alert("ยังไม่มีคำตอบให้ดาวน์โหลดค่ะ");
    return;
  }

  const stamp = fileStamp();
  downloadTextFile(`food-detective-review-${stamp}.csv`, buildReviewCsv(answers), "text/csv;charset=utf-8");
});

loadReview();
window.setInterval(loadReview, 5000);

async function loadReview() {
  try {
    const response = await fetch("/api/scores");
    const data = await response.json();
    reviewScores = data.scores || [];
    renderReview();
  } catch (error) {
    reviewStatus.textContent = "ยังโหลดคำตอบไม่ได้ กรุณารอสักครู่";
  }
}

function renderReview() {
  const totalGroups = reviewScores.length;
  const totalAnswers = reviewScores.reduce((sum, score) => sum + (score.answers || []).length, 0);
  reviewStatus.textContent =
    totalGroups === 0
      ? "ยังไม่มีคะแนนจากนักเรียน เมื่อกลุ่มเล่นจบคำตอบจะขึ้นที่นี่"
      : `มีกลุ่มส่งคะแนนแล้ว ${totalGroups} กลุ่ม รวม ${totalAnswers} คำตอบ`;

  renderGroupButtons();
  renderFocusCards();
  renderAnswerTable();
}

function renderGroupButtons() {
  const buttons = [
    `<button class="review-chip ${activeGroup === "all" ? "active" : ""}" data-group="all" type="button">ทั้งหมด</button>`
  ];

  reviewScores
    .sort((a, b) => a.group - b.group)
    .forEach((score) => {
      buttons.push(`
        <button class="review-chip ${activeGroup === score.group ? "active" : ""}" data-group="${score.group}" type="button">
          Group ${score.group}
        </button>
      `);
    });

  reviewGroupButtons.innerHTML = buttons.join("");

  reviewGroupButtons.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeGroup = button.dataset.group === "all" ? "all" : Number(button.dataset.group);
      renderReview();
    });
  });
}

function getFilteredAnswers() {
  return reviewScores
    .filter((score) => activeGroup === "all" || score.group === activeGroup)
    .flatMap((score) => (score.answers || []).map((answer, index) => ({ ...answer, group: score.group, number: index + 1 })));
}

function renderFocusCards() {
  const answers = getFilteredAnswers();
  const wrongAnswers = answers.filter((answer) => !answer.isCorrect);
  const commonMistakes = [...wrongAnswers]
    .reduce((map, answer) => {
      const key = `${answer.word}|${answer.correctCategory}`;
      const current = map.get(key) || { word: answer.word, correctCategory: answer.correctCategory, count: 0 };
      current.count += 1;
      map.set(key, current);
      return map;
    }, new Map());

  const mistakeCards = [...commonMistakes.values()]
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, 6)
    .map((item) => `
      <article class="review-focus-card">
        <span>${escapeHtml(item.word)}</span>
        <strong>${escapeHtml(item.correctCategory)}</strong>
        <small>ตอบผิด ${item.count} ครั้ง</small>
      </article>
    `)
    .join("");

  reviewFocus.innerHTML = `
    <div class="review-focus-header">
      <h2>คำที่ควรทบทวน</h2>
      <p>${wrongAnswers.length === 0 ? "เยี่ยมมาก ทุกคำตอบในมุมมองนี้ถูกต้อง" : "ใช้ส่วนนี้ถามนักเรียนและช่วยกันเฉลย"}</p>
    </div>
    <div class="review-focus-grid">
      ${mistakeCards || `<div class="report-empty">ยังไม่มีคำที่ตอบผิดในมุมมองนี้</div>`}
    </div>
  `;
}

function renderAnswerTable() {
  const answers = getFilteredAnswers();

  if (answers.length === 0) {
    reviewTableWrap.innerHTML = `<div class="report-empty">ยังไม่มีคำตอบให้เฉลย</div>`;
    return;
  }

  const rows = answers
    .map((answer) => `
      <tr>
        <td>Group ${answer.group}</td>
        <td>${answer.number}</td>
        <td>${escapeHtml(answer.word)}</td>
        <td>${escapeHtml(answer.selectedCategory)}</td>
        <td>${escapeHtml(answer.correctCategory)}</td>
        <td class="${answer.isCorrect ? "report-correct" : "report-wrong"}">${answer.isCorrect ? "ถูก" : "แก้ไข"}</td>
      </tr>
    `)
    .join("");

  reviewTableWrap.innerHTML = `
    <table class="report-table review-answer-table">
      <thead>
        <tr>
          <th>กลุ่ม</th>
          <th>ข้อ</th>
          <th>คำศัพท์</th>
          <th>คำตอบนักเรียน</th>
          <th>เฉลย</th>
          <th>ผล</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildReviewCsv(answers) {
  const rows = [[
    "Group",
    "Question",
    "Word",
    "Student Answer",
    "Correct Answer",
    "Result"
  ]];

  answers.forEach((answer) => {
    rows.push([
      `Group ${answer.group}`,
      answer.number,
      answer.word || "",
      answer.selectedCategory || "",
      answer.correctCategory || "",
      answer.isCorrect ? "Correct" : "Wrong"
    ]);
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
