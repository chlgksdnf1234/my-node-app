const express = require('express');
const app = express();

// 메인 페이지 접속 시 새벽별(React) 화면을 전송합니다.
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>새벽별 - 말씀으로 여는 하루</title>
  <!-- React & Babel CDN -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Tailwind CSS (스타일링 용) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
    body { margin: 0; padding: 0; height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useMemo } = React;

    // ---- 색/타이포 토큰 ----
    const C = {
      paper: "#FAF6ED", paperDeep: "#F2ECDC", ink: "#23304A", inkSoft: "#5B6577",
      gold: "#C9A24B", goldDeep: "#A9822F", sage: "#6E8B74", sageDeep: "#4E6B54",
      clay: "#B8695C", clayDeep: "#8F4A3F", line: "#E3DCC8",
    };
    const SERIF = "'Nanum Myeongjo', serif";
    const SANS = "'Noto Sans KR', sans-serif";

    // ---- 큐티 데이터 ----
    const QT_DATA = [
      { ref: "시편 23편 1절", verse: "주님이 나의 목자시니, 내게 부족함이 없습니다.", lead: "돌보심", questions: ["오늘 나에게 '부족함이 없다'고 느껴지는 부분은 무엇인가요?", "반대로 채워지지 않아 마음이 쓰이는 부분이 있다면 무엇인가요?", "오늘 하루, 그 부분을 하나님께 맡겨본다면 어떤 기도가 될까요?"] },
      { ref: "마태복음 6장 34절", verse: "내일 일은 내일 염려하고, 오늘은 오늘의 수고로 충분합니다.", lead: "오늘", questions: ["요즘 내가 미리 당겨서 걱정하고 있는 일은 무엇인가요?", "그 걱정을 오늘 하루만큼은 내려놓는다면 무엇이 달라질까요?", "오늘 하루에만 집중하기 위해 할 수 있는 작은 행동은 무엇인가요?"] },
      { ref: "빌립보서 4장 6-7절", verse: "아무것도 염려하지 말고, 모든 일에 감사함으로 아뢰십시오.", lead: "평안", questions: ["지금 내 마음을 가장 무겁게 하는 일 한 가지는 무엇인가요?", "그 일 가운데서도 감사할 수 있는 것을 찾는다면 무엇일까요?", "그 걱정을 구체적인 언어로 기도로 옮겨본다면 어떻게 쓸 수 있을까요?"] },
    ];

    // ---- 퀴즈 데이터 ----
    const QUIZ_DATA = [
      { cat: "구약", q: "노아의 방주에 함께 탄 가족은 모두 몇 명이었나요?", opts: ["4명", "6명", "8명", "10명"], a: 2, ex: "노아 부부와 세 아들 부부, 총 8명이 방주에 탔습니다." },
      { cat: "구약", q: "이스라엘 백성이 홍해를 건널 때 지도자는 누구였나요?", opts: ["아브라함", "모세", "여호수아", "다윗"], a: 1, ex: "모세가 지팡이를 들어 홍해를 가르고 백성을 인도했습니다." },
      { cat: "신약", q: "예수님이 태어나신 마을은 어디인가요?", opts: ["나사렛", "예루살렘", "베들레헴", "가버나움"], a: 2, ex: "예수님은 다윗의 고향인 베들레헴에서 태어나셨습니다." },
    ];

    function todayStr() {
      const d = new Date();
      return \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, "0")}-\${String(d.getDate()).padStart(2, "0")}\`;
    }
    function dayIndexSeed() {
      const d = new Date();
      const start = new Date(d.getFullYear(), 0, 0);
      return Math.floor((d - start) / 86400000);
    }

    function App() {
      const [tab, setTab] = useState("qt");
      return (
        <div style={{ background: C.paper, minHeight: "100vh", fontFamily: SANS, color: C.ink }} className="w-full">
          <div className="max-w-xl mx-auto px-5 pt-8 pb-16">
            <Header />
            <TabBar tab={tab} setTab={setTab} />
            {tab === "qt" ? <QTView /> : <QuizView />}
          </div>
        </div>
      );
    }

    function Header() {
      return (
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-1">
            <span>✨</span>
            <span style={{ color: C.goldDeep, fontFamily: SANS, fontSize: 12, letterSpacing: "0.12em" }}>DAWN STAR</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>새벽별</h1>
          <p style={{ color: C.inkSoft, fontSize: 13, marginTop: 4 }}>말씀으로 여는 하루, 큐티와 성경 퀴즈</p>
        </div>
      );
    }

    function TabBar({ tab, setTab }) {
      return (
        <div style={{ borderBottom: \`1px solid \${C.line}\` }} className="flex gap-6 mb-7">
          <button onClick={() => setTab("qt")} className="flex items-center gap-1.5 pb-3 transition-colors"
            style={{ borderBottom: tab === "qt" ? \`2px solid \${C.ink}\` : "2px solid transparent", marginBottom: -1, color: tab === "qt" ? C.ink : C.inkSoft, fontWeight: tab === "qt" ? 700 : 500 }}>
            📝 오늘의 큐티
          </button>
          <button onClick={() => setTab("quiz")} className="flex items-center gap-1.5 pb-3 transition-colors"
            style={{ borderBottom: tab === "quiz" ? \`2px solid \${C.ink}\` : "2px solid transparent", marginBottom: -1, color: tab === "quiz" ? C.ink : C.inkSoft, fontWeight: tab === "quiz" ? 700 : 500 }}>
            📖 성경 퀴즈
          </button>
        </div>
      );
    }

    function QTView() {
      const idx = dayIndexSeed() % QT_DATA.length;
      const entry = QT_DATA[idx];
      const [journal, setJournal] = useState("");
      const [savedAt, setSavedAt] = useState(null);
      const [streak, setStreak] = useState([]);
      const key = \`qt-journal:\${todayStr()}\`;

      useEffect(() => {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setJournal(parsed.text || "");
          setSavedAt(parsed.timestamp || null);
        }
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const ds = \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, "0")}-\${String(d.getDate()).padStart(2, "0")}\`;
          days.push({ date: ds, done: !!localStorage.getItem(\`qt-journal:\${ds}\`) });
        }
        setStreak(days);
      }, [key]);

      function handleSave() {
        if (!journal.trim()) return;
        const now = Date.now();
        localStorage.setItem(key, JSON.stringify({ text: journal, timestamp: now }));
        setSavedAt(now);
        setStreak((prev) => prev.map((d) => (d.date === todayStr() ? { ...d, done: true } : d)));
      }

      return (
        <div>
          <div style={{ background: "#fff", border: \`1px solid \${C.line}\`, borderRadius: 4, padding: "22px 22px 20px", marginBottom: 22, position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: 20, background: C.gold, color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 2 }}>{entry.lead}</div>
            <p style={{ color: C.goldDeep, fontSize: 12, marginTop: 4, marginBottom: 10 }}>{entry.ref}</p>
            <p style={{ fontFamily: SERIF, fontSize: 20, lineHeight: 1.7, color: C.ink }}>
              <span style={{ fontSize: 40, color: C.gold, fontWeight: 700, float: "left", lineHeight: 0.75, marginRight: 6, marginTop: 6 }}>{entry.verse[0]}</span>
              {entry.verse.slice(1)}
            </p>
          </div>

          <div className="mb-6">
            <h3 style={{ fontFamily: SERIF, fontSize: 15, marginBottom: 12 }}>묵상 질문</h3>
            <div className="flex flex-col gap-3">
              {entry.questions.map((q, i) => (
                <div key={i} className="flex gap-3">
                  <div style={{ minWidth: 22, height: 22, borderRadius: "50%", border: \`1px solid \${C.gold}\`, color: C.goldDeep, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6 }}>{q}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 style={{ fontFamily: SERIF, fontSize: 15, marginBottom: 10 }}>오늘의 묵상 기록</h3>
            <textarea value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="오늘 말씀을 읽으며 든 생각을 적어보세요." rows="5"
              style={{ width: "100%", border: \`1px solid \${C.line}\`, borderRadius: 4, padding: 14, fontSize: 14, outline: "none" }} />
            <div className="flex items-center justify-between mt-3">
              <span style={{ fontSize: 12, color: C.inkSoft }}>{savedAt ? \`마지막 저장 \${new Date(savedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}\` : "아직 저장하지 않았어요."}</span>
              <button onClick={handleSave} style={{ background: C.ink, color: "#fff", fontSize: 13, padding: "8px 16px", borderRadius: 4 }}>✅ 기록 저장</button>
            </div>
          </div>

          {streak.length > 0 && (
            <div>
              <h3 style={{ fontFamily: SERIF, fontSize: 15, marginBottom: 10 }}>이번 주 묵상</h3>
              <div className="flex gap-2">
                {streak.map((d) => (
                  <div key={d.date} className="flex flex-col items-center gap-1">
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: d.done ? C.sage : "#fff", border: \`1px solid \${d.done ? C.sage : C.line}\` }} />
                    <span style={{ fontSize: 10, color: C.inkSoft }}>{["일", "월", "화", "수", "목", "금", "토"][new Date(d.date).getDay()]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    function QuizView() {
      const [i, setI] = useState(0);
      const [selected, setSelected] = useState(null);
      const [score, setScore] = useState(0);
      const [finished, setFinished] = useState(false);
      const total = QUIZ_DATA.length;
      const q = QUIZ_DATA[i];

      function choose(optIdx) {
        if (selected !== null) return;
        setSelected(optIdx);
        if (optIdx === q.a) setScore((s) => s + 1);
      }
      function next() {
        if (i + 1 >= total) return setFinished(true);
        setI((v) => v + 1);
        setSelected(null);
      }
      function restart() {
        setI(0); setSelected(null); setScore(0); setFinished(false);
      }

      if (finished) {
        return (
          <div className="text-center py-10">
            <p style={{ color: C.goldDeep, fontSize: 12, letterSpacing: "0.1em" }}>QUIZ COMPLETE</p>
            <p style={{ fontFamily: SERIF, fontSize: 40, margin: "10px 0 6px" }}>{score} / {total}</p>
            <p style={{ color: C.inkSoft, fontSize: 14, marginBottom: 24 }}>훌륭해요! 수고하셨습니다.</p>
            <button onClick={restart} style={{ background: C.ink, color: "#fff", fontSize: 13, padding: "10px 20px", borderRadius: 4 }}>🔄 다시 풀기</button>
          </div>
        );
      }

      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 2, background: q.cat === "구약" ? "#EFEADA" : "#EAEFE3", color: q.cat === "구약" ? C.goldDeep : C.sageDeep }}>{q.cat}</span>
            <span style={{ fontSize: 12, color: C.inkSoft }}>{i + 1} / {total}</span>
          </div>
          <p style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.6, marginBottom: 20 }}>{q.q}</p>
          <div className="flex flex-col gap-2.5 mb-5">
            {q.opts.map((opt, idx) => {
              const isCorrect = idx === q.a;
              const isPicked = idx === selected;
              let bg = "#fff", border = C.line, textColor = C.ink;
              if (selected !== null) {
                if (isCorrect) { bg = "#EAEFE3"; border = C.sage; textColor = C.sageDeep; }
                else if (isPicked) { bg = "#F5E7E4"; border = C.clay; textColor = C.clayDeep; }
              }
              return (
                <button key={idx} onClick={() => choose(idx)} disabled={selected !== null} className="flex items-center justify-between text-left"
                  style={{ background: bg, border: \`1px solid \${border}\`, borderRadius: 4, padding: "12px 14px", fontSize: 14, color: textColor }}>
                  <span>{opt}</span>
                  {selected !== null && isCorrect && <span>✅</span>}
                  {selected !== null && isPicked && !isCorrect && <span>❌</span>}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div style={{ background: "#fff", border: \`1px solid \${C.line}\`, borderRadius: 4, padding: "12px 14px", marginBottom: 18 }}>
              <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}>{q.ex}</p>
            </div>
          )}
          {selected !== null && (
            <button onClick={next} className="ml-auto flex items-center gap-1.5" style={{ background: C.ink, color: "#fff", fontSize: 13, padding: "9px 16px", borderRadius: 4 }}>
              {i + 1 >= total ? "결과 보기" : "다음 문제"} ▶️
            </button>
          )}
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
