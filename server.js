const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "200kb" }));
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";

async function askClaude(system, user, maxTokens = 2000) {
  if (!API_KEY) throw new Error("ANTHROPIC_API_KEY o'rnatilmagan");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API xatosi ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.content.map((b) => b.text || "").join("");
}

const WRITING_SYSTEM = `Siz tajribali, qattiq va halol IELTS Writing examiner'siz. Essayni rasmiy IELTS band descriptors bo'yicha baholang.
Mezonlar:
- Task 1: Task Achievement; Task 2: Task Response
- Coherence and Cohesion
- Lexical Resource
- Grammatical Range and Accuracy
Qoidalar:
- Ballarni 0.5 qadam bilan bering (masalan 6.0, 6.5). Yuqori ball berib xushomad qilmang; real IELTS standartiga mos, adolatli baholang.
- Task 1 uchun minimum 150, Task 2 uchun minimum 250 so'z. Kam bo'lsa, Task Achievement/Response ballini tushiring va buni ayting.
- Mavzudan chetga chiqsa yoki yodlangan (memorized) shablonga o'xshasa, ballni tushiring.
- Overall = to'rt mezon o'rtachasi, eng yaqin 0.5 ga yaxlitlangan.
- Izohlar O'ZBEK tilida bo'lsin, lekin essaydan olingan misollar va tuzatishlar inglizcha bo'lsin.
FAQAT quyidagi JSON formatida javob bering, boshqa hech narsa yozmang (markdown ham yo'q):
{
 "overall": number,
 "criteria": {
   "task": {"band": number, "comment": string},
   "coherence": {"band": number, "comment": string},
   "lexical": {"band": number, "comment": string},
   "grammar": {"band": number, "comment": string}
 },
 "mistakes": [{"original": string, "corrected": string, "why": string}],
 "strengths": [string],
 "top_priorities": [string],
 "band_up_tip": string,
 "improved_paragraph": string
}
"mistakes" 5-10 ta eng muhim xatodan iborat bo'lsin. "top_priorities" 3 ta bo'lsin. "improved_paragraph" — essaydagi eng zaif paragrafning yaxshilangan varianti.`;

app.post("/api/evaluate", async (req, res) => {
  try {
    const { taskType, prompt, essay } = req.body || {};
    if (!essay || essay.trim().length < 30) {
      return res.status(400).json({ error: "Essay juda qisqa." });
    }
    const words = essay.trim().split(/\s+/).length;
    const user = `Task turi: ${taskType === "task1" ? "Task 1" : "Task 2"}
Savol: ${prompt || "(savol berilmagan)"}
So'zlar soni: ${words}

Essay:
"""
${essay}
"""`;
    const raw = await askClaude(WRITING_SYSTEM, user, 2500);
    const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    res.json({ words, result: JSON.parse(json) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

const COACH_SYSTEM = `Siz IELTS Listening va Reading bo'yicha murabbiysiz. O'zbek tilida, aniq, qisqa va amaliy javob bering.
Foydalanuvchi 30 kunlik challenge'da. Strategiya, vaqtni boshqarish, savol turlari (T/F/NG, matching headings, MCQ, map labelling, form completion va h.k.), xatolar tahlili va lug'at bo'yicha maslahat bering.
Kerak bo'lsa, qisqa bullet ro'yxat ishlating. Ortiqcha uzun yozmang.`;

app.post("/api/coach", async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question) return res.status(400).json({ error: "Savol bo'sh." });
    const text = await askClaude(COACH_SYSTEM, question, 1200);
    res.json({ answer: text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/health", (_req, res) => res.send("ok"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server http://localhost:${PORT} da ishlayapti`));
