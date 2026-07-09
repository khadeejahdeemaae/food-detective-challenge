const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = Number(process.env.PORT || 8123);
const ROOT = __dirname;
const SCORE_FILE = path.join(ROOT, "scores.json");
const PUBLIC_URL_FILE = path.join(ROOT, "public-url.txt");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

let scores = readScores();

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/api/scores") {
      return sendJson(response, { scores, links: getClassroomLinks() });
    }

    if (request.method === "POST" && url.pathname === "/api/submit") {
      const body = await readJson(request);
      const result = normalizeScore(body);
      scores = scores.filter((score) => score.group !== result.group);
      scores.push(result);
      scores.sort((a, b) => a.group - b.group);
      writeScores(scores);
      return sendJson(response, { ok: true, scores });
    }

    if (request.method === "POST" && url.pathname === "/api/reset") {
      scores = [];
      writeScores(scores);
      return sendJson(response, { ok: true, scores });
    }

    return serveStatic(url.pathname, response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Server error" }));
  }
});

server.listen(PORT, "0.0.0.0", () => {
  const links = getClassroomLinks();
  console.log("Food Detective Challenge is ready.");
  console.log(`Student link on this computer: http://127.0.0.1:${PORT}/`);
  console.log(`Teacher dashboard: http://127.0.0.1:${PORT}/teacher.html`);
  console.log(`Stable classroom link: http://${os.hostname()}:${PORT}/`);
  links.forEach((link) => console.log(`Classroom Wi-Fi link: ${link.student}`));
});

function serveStatic(pathname, response) {
  const safePath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = path.normalize(path.join(ROOT, safePath));

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("File not found");
      return;
    }

    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(data);
  });
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 250000) {
        request.destroy();
        reject(new Error("Request too large"));
      }
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function normalizeScore(body) {
  const group = Math.max(1, Math.min(6, Number(body.group) || 1));
  const totalQuestions = Math.max(0, Number(body.totalQuestions) || 25);
  const total = Math.max(0, Number(body.total) || totalQuestions * 10);
  const score = Math.max(0, Math.min(total, Number(body.score) || 0));
  const correct = Math.max(0, Math.min(totalQuestions, Number(body.correct) || Math.round(score / 10)));

  return {
    group,
    score,
    total,
    correct,
    totalQuestions,
    answers: Array.isArray(body.answers) ? body.answers.slice(0, 30) : [],
    finishedAt: body.finishedAt || new Date().toISOString()
  };
}

function readScores() {
  try {
    return JSON.parse(fs.readFileSync(SCORE_FILE, "utf8"));
  } catch (error) {
    return [];
  }
}

function writeScores(nextScores) {
  fs.writeFileSync(SCORE_FILE, JSON.stringify(nextScores, null, 2), "utf8");
}

function sendJson(response, data) {
  response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function getClassroomLinks() {
  const links = [];
  const publicUrl = readPublicUrl();

  if (publicUrl) {
    links.push({
      student: publicUrl,
      teacher: `${publicUrl.replace(/\/$/, "")}/teacher.html`,
      type: "public-url"
    });
  }

  links.push({
    student: `http://${os.hostname()}:${PORT}/`,
    teacher: `http://${os.hostname()}:${PORT}/teacher.html`,
    type: "computer-name"
  });

  const networks = os.networkInterfaces();

  Object.values(networks).forEach((items) => {
    items
      .filter((item) => item.family === "IPv4" && !item.internal)
      .forEach((item) => {
        links.push({
          student: `http://${item.address}:${PORT}/`,
          teacher: `http://${item.address}:${PORT}/teacher.html`,
          type: "ip-address"
        });
      });
  });

  return links;
}

function readPublicUrl() {
  const envUrl = process.env.PUBLIC_URL ? process.env.PUBLIC_URL.trim() : "";

  if (envUrl) {
    return normalizePublicUrl(envUrl);
  }

  try {
    return normalizePublicUrl(fs.readFileSync(PUBLIC_URL_FILE, "utf8").trim());
  } catch (error) {
    return "";
  }
}

function normalizePublicUrl(url) {
  if (!url || !/^https?:\/\//i.test(url)) {
    return "";
  }

  return url.endsWith("/") ? url : `${url}/`;
}
