const $ = (s) => document.querySelector(s);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ---------- Tabs ----------
document.querySelectorAll("nav button").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll("nav button, .tab").forEach((e) => e.classList.remove("active"));
    b.classList.add("active");
    $("#" + b.dataset.tab).classList.add("active");
  };
});

// ---------- 30 kunlik reja ----------
const themes = [
  { l: "Form/Note completion: raqam, ism, spelling ga e'tibor", r: "Skimming va scanning: sarlavha, birinchi gap, kalit so'zlar", w: "Task 2: opinion essay tuzilishi (intro-2 body-conclusion)" },
  { l: "Multiple choice: distraktorlarni aniqlash", r: "True/False/Not Given: 'Not Given' ni ajratish", w: "Task 1: formal/semi-formal letter" },
  { l: "Map/Plan labelling: yo'nalish so'zlari", r: "Matching headings: paragraf asosiy g'oyasi", w: "Task 2: discussion essay" },
  { l: "Sentence completion: so'z limiti va grammatika", r: "Sentence completion va summary completion", w: "Task 2: advantages/disadvantages" },
  { l: "Matching: speakerlar va fikrlar", r: "Yes/No/Not Given: muallif fikri", w: "Task 1: report/letter, 150 so'z 20 daqiqada" },
  { l: "Part 3-4 akademik ma'ruza: konspekt yuritish", r: "Matching information: paragraf izlash", w: "Task 2: problem-solution" },
  { l: "Haftalik takror: xatolar daftarini ko'rib chiqish", r: "Haftalik takror + to'liq 1 ta Reading passage 20 daq", w: "Haftalik takror: eng zaif essayni qayta yozish" },
];
const days = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  if (d === 30) return { d, l: "To'liq Listening mock test (30 daq + 10 daq ko'chirish)", r: "To'liq Reading mock test (60 daq)", w: "Task 1 (20 daq) + Task 2 (40 daq) mock" };
  if (d === 15) return { d, l: "O'rta nuqta mock: to'liq Listening", r: "O'rta nuqta mock: to'liq Reading", w: "Task 2 mock, AI bilan tekshiring va ballni qayd eting" };
  const t = themes[i % themes.length];
  return { d, ...t };
});

let done = load("done", []);
function startDate() {
  let s = load("start", null);
  if (!s) { s = new Date().toISOString().slice(0, 10); save("start", s); }
  return s;
}
function currentDay() {
  const diff = Math.floor((new Date(new Date().toISOString().slice(0, 10)) - new Date(startDate())) / 86400000);
  return Math.min(Math.max(diff + 1, 1), 30);
}
function streak() {
  let s = 0;
  for (let d = currentDay(); d >= 1; d--) {
    if (done.includes(d)) s++;
    else if (d !== currentDay()) break;
  }
  return s;
}
function renderPlan() {
  $("#doneCount").textContent = done.length;
  $("#streak").textContent = streak();
  $("#barFill").style.width = (done.length / 30) * 100 + "%";
  const cd = currentDay(), t = days[cd - 1];
  $("#todayBox").innerHTML = `<h3>Bugun: ${cd}-kun</h3>
    <p>🎧 <b>Listening:</b> ${t.l}</p>
    <p>📖 <b>Reading:</b> ${t.r}</p>
    <p>✍️ <b>Writing:</b> ${t.w}</p>
    <p class="muted">Tavsiya: 40 daq Listening, 40 daq Reading, 45 daq Writing, 15 daq xatolar tahlili.</p>`;
  $("#days").innerHTML = days.map((x) =>
    `<div class="day ${done.includes(x.d) ? "done" : ""} ${x.d === cd ? "current" : ""}" data-d="${x.d}" title="${x.l}\n${x.r}\n${x.w}">
      <b>${x.d}-kun ${done.includes(x.d) ? "✅" : ""}</b><span class="muted">${x.w.split(":")[0]}</span></div>`).join("");
  document.querySelectorAll(".day").forEach((el) => {
    el.onclick = () => {
      const d = +el.dataset.d;
      done = done.includes(d) ? done.filter((x) => x !== d) : [...done, d];
      save("done", done); renderPlan();
    };
  });
}
renderPlan();

// ---------- Maslahatlar ----------
const listeningTips = [
  "Savollarni audio boshlanishidan OLDIN o'qing va kalit so'zlarni belgilang.",
  "Audioni faqat bir marta eshitib yeching (test sharoiti), keyin transkript bilan tahlil qiling.",
  "Har kuni 10 daqiqa dictation: 1 daqiqalik audioni eshitib so'zma-so'z yozing.",
  "Distraktorlarga ehtiroslaning: speaker fikrini o'zgartirishi mumkin ('actually', 'no wait', 'I meant').",
  "Raqam, sana, ism spellingini mashq qiling; -teen va -ty farqiga e'tibor bering.",
  "Oxirida 10 daqiqa javoblarni ko'chirishga vaqt bor, imlo va katta/kichik harfni tekshiring.",
  "Xatolar daftari: har bir xato sababini yozing (eshitmadim / tushunmadim / vaqt yetmadi).",
];
const readingTips = [
  "Har passage uchun 20 daqiqa: 1 daqiqa skim, keyin savollarga o'ting.",
  "Avval aniq javobli savollar (completion), keyin Matching Headings va T/F/NG.",
  "T/F/NG: 'Not Given' = matnda umuman yo'q; 'False' = matn aksini aytadi. O'z bilimingizga tayanmang.",
  "Javob odatda savol tartibida keladi (matching headings va information bundan mustasno).",
  "Kalit so'zlarning sinonimlarini qidiring, aynan bir xil so'z kamdan-kam uchraydi.",
  "Har kuni 10 ta yangi akademik so'z (AWL) o'rganing va gapda ishlating.",
  "Hech qanday savolni bo'sh qoldirmang, javob yozishga jarima yo'q.",
];
$("#listeningTips").innerHTML = listeningTips.map((t) => `<li>${t}</li>`).join("");
$("#readingTips").innerHTML = readingTips.map((t) => `<li>${t}</li>`).join("");

$("#coachBtn").onclick = async () => {
  const q = $("#coachQ").value.trim();
  if (!q) return;
  $("#coachA").textContent = "Javob tayyorlanmoqda...";
  try {
    const r = await fetch("/api/coach", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q }) });
    const j = await r.json();
    $("#coachA").textContent = j.answer || j.error;
    $("#coachA").style.whiteSpace = "pre-wrap";
  } catch (e) { $("#coachA").textContent = "Xato: " + e.message; }
};

// ---------- Writing ----------
const prompts = {
  task2: [
    "Some people think children should start school at a very early age. Others believe they should not start until they are older. Discuss both views and give your opinion.",
    "Many people believe that social media has a negative effect on young people. To what extent do you agree or disagree?",
    "Some people say that governments should spend money on public transport rather than building new roads. Discuss both views and give your opinion.",
    "Online education is replacing traditional classroom learning. Is this a positive or negative development?",
    "In many countries, young people leave their hometowns to work in big cities. What are the causes and effects of this trend?",
    "Some people think university education should be free for everyone. To what extent do you agree or disagree?",
  ],
  task1: [
    "You recently stayed at a hotel and had problems with your room. Write a letter to the manager. Explain what happened, say what you were unhappy about, and say what you want the manager to do. Write at least 150 words.",
    "You have a friend who is moving to your city. Write a letter giving advice about where to live and what to see. Write at least 150 words.",
    "You borrowed a book from your library and lost it. Write a letter to the librarian explaining what happened and offering a solution. Write at least 150 words.",
  ],
};
$("#randomPrompt").onclick = () => {
  const arr = prompts[$("#taskType").value];
  $("#prompt").value = arr[Math.floor(Math.random() * arr.length)];
};
$("#essay").oninput = () => {
  const t = $("#essay").value.trim();
  $("#wc").textContent = t ? t.split(/\s+/).length : 0;
};
let wInt = null, wLeft = 0;
const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
$("#wTimerBtn").onclick = () => {
  clearInterval(wInt);
  wLeft = ($("#taskType").value === "task1" ? 20 : 40) * 60;
  $("#wTimer").textContent = fmt(wLeft);
  wInt = setInterval(() => {
    wLeft--; $("#wTimer").textContent = fmt(Math.max(wLeft, 0));
    if (wLeft <= 0) { clearInterval(wInt); alert("Vaqt tugadi!"); }
  }, 1000);
};
const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
$("#evalBtn").onclick = async () => {
  const essay = $("#essay").value, prompt = $("#prompt").value, taskType = $("#taskType").value;
  $("#evalOut").innerHTML = '<p class="muted">Baholanmoqda, 20-40 soniya kuting...</p>';
  $("#evalBtn").disabled = true;
  try {
    const r = await fetch("/api/evaluate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ taskType, prompt, essay }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    renderResult(j.result, j.words);
    const h = load("history", []);
    h.unshift({ date: new Date().toLocaleDateString(), type: taskType, overall: j.result.overall, words: j.words });
    save("history", h.slice(0, 30)); renderHistory();
  } catch (e) { $("#evalOut").innerHTML = `<p style="color:var(--bad)">Xato: ${esc(e.message)}</p>`; }
  $("#evalBtn").disabled = false;
};
function renderResult(r, words) {
  const c = r.criteria;
  const box = (n, o) => `<div class="card"><b>${n}</b> <span class="band" style="font-size:1.4rem">${o.band}</span><p>${esc(o.comment)}</p></div>`;
  $("#evalOut").innerHTML = `
    <div class="card"><div>Overall band</div><div class="band">${r.overall}</div><div class="muted">${words} so'z</div></div>
    <div class="crit">${box("Task Achievement/Response", c.task)}${box("Coherence & Cohesion", c.coherence)}${box("Lexical Resource", c.lexical)}${box("Grammar", c.grammar)}</div>
    <h3>Xatolar</h3>${(r.mistakes || []).map((m) => `<div class="mist"><div class="o">${esc(m.original)}</div><div class="c">${esc(m.corrected)}</div><div class="muted">${esc(m.why)}</div></div>`).join("")}
    <h3>Kuchli tomonlar</h3><ul>${(r.strengths || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    <h3>Asosiy 3 ustuvorlik</h3><ol>${(r.top_priorities || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <div class="card"><b>Balni oshirish uchun:</b><p>${esc(r.band_up_tip)}</p></div>
    <div class="card"><b>Yaxshilangan paragraf:</b><p>${esc(r.improved_paragraph)}</p></div>`;
}
function renderHistory() {
  const h = load("history", []);
  $("#history").innerHTML = h.length ? h.map((x) => `<div class="card">${x.date} · ${x.type === "task1" ? "Task 1" : "Task 2"} · ${x.words} so'z · <b>Band ${x.overall}</b></div>`).join("") : '<p class="muted">Hali natija yo\'q.</p>';
}
renderHistory();

// ---------- Pomodoro ----------
let pLeft = 25 * 60, pMode = "Fokus", pInt = null, pCount = load("pomoCount_" + new Date().toDateString(), 0);
$("#pomoCount").textContent = pCount;
const showP = () => { $("#pomoTime").textContent = fmt(pLeft); $("#pomoMode").textContent = pMode; document.title = fmt(pLeft) + " · IELTS"; };
$("#pomoStart").onclick = () => {
  if (pInt) return;
  pInt = setInterval(() => {
    pLeft--;
    if (pLeft <= 0) {
      if (pMode === "Fokus") { pCount++; save("pomoCount_" + new Date().toDateString(), pCount); $("#pomoCount").textContent = pCount; pMode = "Dam olish"; pLeft = 5 * 60; }
      else { pMode = "Fokus"; pLeft = 25 * 60; }
      try { new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==").play(); } catch {}
      alert(pMode === "Fokus" ? "Dam olish tugadi, ishga qayting!" : "Zo'r! 5 daqiqa dam oling.");
    }
    showP();
  }, 1000);
};
$("#pomoPause").onclick = () => { clearInterval(pInt); pInt = null; };
$("#pomoReset").onclick = () => { clearInterval(pInt); pInt = null; pMode = "Fokus"; pLeft = 25 * 60; showP(); };
showP();
$("#goal").value = load("goal_" + new Date().toDateString(), "");
$("#goal").oninput = () => save("goal_" + new Date().toDateString(), $("#goal").value);
