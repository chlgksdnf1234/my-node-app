import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, PenLine, ChevronRight, Check, X, RotateCcw, Sparkles } from "lucide-react";

// ---- 색/타이포 토큰 ----
const C = {
  paper: "#FAF6ED",
  paperDeep: "#F2ECDC",
  ink: "#23304A",
  inkSoft: "#5B6577",
  gold: "#C9A24B",
  goldDeep: "#A9822F",
  sage: "#6E8B74",
  sageDeep: "#4E6B54",
  clay: "#B8695C",
  clayDeep: "#8F4A3F",
  line: "#E3DCC8",
};
const SERIF = "'Noto Serif KR','Nanum Myeongjo',Georgia,serif";
const SANS = "'Pretendard','Apple SD Gothic Neo','Malgun Gothic',sans-serif";

// ---- 큐티(묵상) 데이터 ----
const QT_DATA = [
  {
    ref: "시편 23편 1절",
    verse: "주님이 나의 목자시니, 내게 부족함이 없습니다.",
    lead: "돌보심",
    questions: [
      "오늘 나에게 '부족함이 없다'고 느껴지는 부분은 무엇인가요?",
      "반대로 채워지지 않아 마음이 쓰이는 부분이 있다면 무엇인가요?",
      "오늘 하루, 그 부분을 하나님께 맡겨본다면 어떤 기도가 될까요?",
    ],
  },
  {
    ref: "마태복음 6장 34절",
    verse: "내일 일은 내일 염려하고, 오늘은 오늘의 수고로 충분합니다.",
    lead: "오늘",
    questions: [
      "요즘 내가 미리 당겨서 걱정하고 있는 일은 무엇인가요?",
      "그 걱정을 오늘 하루만큼은 내려놓는다면 무엇이 달라질까요?",
      "오늘 하루에만 집중하기 위해 할 수 있는 작은 행동은 무엇인가요?",
    ],
  },
  {
    ref: "빌립보서 4장 6-7절",
    verse: "아무것도 염려하지 말고, 모든 일에 감사함으로 아뢰십시오.",
    lead: "평안",
    questions: [
      "지금 내 마음을 가장 무겁게 하는 일 한 가지는 무엇인가요?",
      "그 일 가운데서도 감사할 수 있는 것을 찾는다면 무엇일까요?",
      "그 걱정을 구체적인 언어로 기도로 옮겨본다면 어떻게 쓸 수 있을까요?",
    ],
  },
  {
    ref: "요한복음 15장 5절",
    verse: "내 안에 머무는 사람이 열매를 많이 맺습니다.",
    lead: "머묾",
    questions: [
      "요즘 내 삶에서 분주함 때문에 놓치고 있는 것은 무엇인가요?",
      "'머문다'는 것이 오늘의 내 하루에는 어떤 모습일 수 있을까요?",
      "잠시 멈춰 하나님과 함께 있는 시간을 언제 마련할 수 있을까요?",
    ],
  },
  {
    ref: "이사야 40장 31절",
    verse: "주님을 소망하는 사람은 새 힘을 얻어 독수리처럼 날개 치며 오릅니다.",
    lead: "새힘",
    questions: [
      "요즘 나를 지치게 하는 일은 무엇인가요?",
      "그 지침 가운데 어디에서 새 힘을 구하고 싶은가요?",
      "오늘 하루, 힘을 얻기 위해 내려놓아야 할 것은 무엇인가요?",
    ],
  },
  {
    ref: "잠언 3장 5-6절",
    verse: "네 마음을 다해 주를 신뢰하고, 네 명철을 의지하지 말라.",
    lead: "신뢰",
    questions: [
      "요즘 스스로의 판단에만 의지하려 했던 일이 있다면 무엇인가요?",
      "그 일을 하나님께 맡긴다는 것은 구체적으로 무엇을 의미할까요?",
      "오늘 신뢰의 태도로 내디딜 수 있는 한 걸음은 무엇인가요?",
    ],
  },
  {
    ref: "요한1서 4장 18-19절",
    verse: "사랑 안에는 두려움이 없으니, 우리가 사랑함은 그가 먼저 사랑하셨기 때문입니다.",
    lead: "사랑",
    questions: [
      "요즘 내 마음 한켠에 자리 잡은 두려움은 무엇인가요?",
      "그 두려움 앞에서 '먼저 사랑받았다'는 사실은 어떤 의미가 될까요?",
      "오늘 그 사랑을 누군가에게 흘려보낼 수 있는 방법은 무엇인가요?",
    ],
  },
];

// ---- 퀴즈 데이터 ----
const QUIZ_DATA = [
  { cat: "구약", q: "노아의 방주에 함께 탄 가족은 모두 몇 명이었나요?", opts: ["4명", "6명", "8명", "10명"], a: 2, ex: "노아 부부와 세 아들 부부, 총 8명이 방주에 탔습니다." },
  { cat: "구약", q: "이스라엘 백성이 홍해를 건널 때 지도자는 누구였나요?", opts: ["아브라함", "모세", "여호수아", "다윗"], a: 1, ex: "모세가 지팡이를 들어 홍해를 가르고 백성을 인도했습니다." },
  { cat: "구약", q: "다윗이 물맷돌로 쓰러뜨린 블레셋 장수의 이름은?", opts: ["골리앗", "삼손", "사울", "아각"], a: 0, ex: "다윗은 물맷돌 하나로 거인 골리앗을 쓰러뜨렸습니다." },
  { cat: "구약", q: "요셉이 형들에 의해 팔려간 나라는 어디인가요?", opts: ["바벨론", "애굽(이집트)", "앗시리아", "페르시아"], a: 1, ex: "요셉은 형들에 의해 애굽으로 팔려갔고 훗날 총리가 됩니다." },
  { cat: "신약", q: "예수님이 태어나신 마을은 어디인가요?", opts: ["나사렛", "예루살렘", "베들레헴", "가버나움"], a: 2, ex: "예수님은 다윗의 고향인 베들레헴에서 태어나셨습니다." },
  { cat: "신약", q: "예수님의 열두 제자 중 예수님을 배반한 사람은?", opts: ["베드로", "가룟 유다", "도마", "안드레"], a: 1, ex: "가룟 유다는 은 삼십에 예수님을 팔아넘겼습니다." },
  { cat: "신약", q: "예수님이 물을 포도주로 바꾸신 첫 표적이 일어난 곳은?", opts: ["가나의 혼인 잔치", "가버나움 회당", "베다니", "갈릴리 호수"], a: 0, ex: "가나의 혼인 잔치에서 물을 포도주로 바꾸신 것이 첫 표적입니다." },
  { cat: "신약", q: "베드로가 예수님을 세 번 부인하기 전, 예수님이 예고하신 것은 무엇이 울기 전이었나요?", opts: ["종", "닭", "나팔", "천둥"], a: 1, ex: "예수님은 닭 울기 전 베드로가 세 번 부인할 것을 예고하셨습니다." },
  { cat: "신약", q: "사도 바울이 다메섹으로 가던 중 만난 것은 무엇인가요?", opts: ["천사의 방문", "부활하신 예수님의 빛", "꿈속 계시", "불타는 떨기나무"], a: 1, ex: "바울은 다메섹 도상에서 부활하신 예수님을 빛 가운데 만났습니다." },
  { cat: "구약", q: "십계명을 받은 산의 이름은 무엇인가요?", opts: ["감람산", "시내산", "시온산", "갈멜산"], a: 1, ex: "모세는 시내산에서 하나님께 십계명을 받았습니다." },
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dayIndexSeed() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  return Math.floor(diff / 86400000);
}

export default function App() {
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
        <Sparkles size={16} color={C.gold} />
        <span style={{ color: C.goldDeep, fontFamily: SANS, fontSize: 12, letterSpacing: "0.12em" }}>DAWN STAR</span>
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>
        새벽별
      </h1>
      <p style={{ color: C.inkSoft, fontSize: 13, marginTop: 4 }}>말씀으로 여는 하루, 큐티와 성경 퀴즈</p>
    </div>
  );
}

function TabBar({ tab, setTab }) {
  const items = [
    { id: "qt", label: "오늘의 큐티", icon: PenLine },
    { id: "quiz", label: "성경 퀴즈", icon: BookOpen },
  ];
  return (
    <div style={{ borderBottom: `1px solid ${C.line}` }} className="flex gap-6 mb-7">
      {items.map((it) => {
        const active = tab === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="flex items-center gap-1.5 pb-3 transition-colors"
            style={{
              borderBottom: active ? `2px solid ${C.ink}` : "2px solid transparent",
              marginBottom: -1,
              color: active ? C.ink : C.inkSoft,
              fontFamily: SANS,
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              background: "transparent",
            }}
          >
            <Icon size={15} />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------- QT ----------------
function QTView() {
  const idx = dayIndexSeed() % QT_DATA.length;
  const entry = QT_DATA[idx];
  const [journal, setJournal] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [streak, setStreak] = useState([]);
  const key = `qt-journal:${todayStr()}`;

  useEffect(() => {
    // 웹 표준 localStorage로 데이터 불러오기
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setJournal(parsed.text || "");
        setSavedAt(parsed.timestamp || null);
      }
    } catch (e) {
      console.error("저장된 묵상 기록을 불러오는 중 오류 발생:", e);
    }

    // 최근 7일 스트릭(달성 기록) 확인
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      
      const isDone = !!localStorage.getItem(`qt-journal:${ds}`);
      days.push({ date: ds, done: isDone });
    }
    setStreak(days);
  }, [key]);

  function handleSave() {
    if (!journal.trim()) return;
    const now = Date.now();
    try {
      // 웹 표준 localStorage에 저장하기
      localStorage.setItem(key, JSON.stringify({ text: journal, timestamp: now }));
      setSavedAt(now);
      setStreak((prev) => prev.map((d) => (d.date === todayStr() ? { ...d, done: true } : d)));
    } catch (e) {
      console.error("저장 실패:", e);
    }
  }

  return (
    <div>
      {/* 말씀 리본 */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${C.line}`,
          borderRadius: 4,
          padding: "22px 22px 20px",
          marginBottom: 22,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -10, left: 20, background: C.gold, color: "#fff", fontSize: 11, padding: "3px 10px", letterSpacing: "0.08em", borderRadius: 2 }}>
          {entry.lead}
        </div>
        <p style={{ color: C.goldDeep, fontSize: 12, marginTop: 4, marginBottom: 10, fontFamily: SANS, letterSpacing: "0.03em" }}>{entry.ref}</p>
        <p style={{ fontFamily: SERIF, fontSize: 20, lineHeight: 1.7, color: C.ink }}>
          <span style={{ fontSize: 40, color: C.gold, fontWeight: 700, float: "left", lineHeight: 0.75, marginRight: 6, marginTop: 6 }}>
            {entry.verse[0]}
          </span>
          {entry.verse.slice(1)}
        </p>
        <p style={{ color: C.inkSoft, fontSize: 11, marginTop: 12 }}>원문을 짧게 풀어 쓴 문장입니다.</p>
      </div>

      {/* 묵상 질문 */}
      <div className="mb-6">
        <h3 style={{ fontFamily: SERIF, fontSize: 15, color: C.ink, marginBottom: 12 }}>묵상 질문</h3>
        <div className="flex flex-col gap-3">
          {entry.questions.map((q, i) => (
            <div key={i} className="flex gap-3">
              <div
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `1px solid ${C.gold}`,
                  color: C.goldDeep,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                {i + 1}
              </div>
              <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.6 }}>{q}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 묵상 일기 */}
      <div className="mb-6">
        <h3 style={{ fontFamily: SERIF, fontSize: 15, color: C.ink, marginBottom: 10 }}>오늘의 묵상 기록</h3>
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="오늘 말씀을 읽으며 든 생각을 적어보세요."
          rows={5}
          style={{
            width: "100%",
            background: "#fff",
            border: `1px solid ${C.line}`,
            borderRadius: 4,
            padding: 14,
            fontSize: 14,
            color: C.ink,
            fontFamily: SANS,
            resize: "vertical",
            outline: "none",
          }}
        />
        <div className="flex items-center justify-between mt-3">
          <span style={{ fontSize: 12, color: C.inkSoft }}>
            {savedAt ? `마지막 저장 ${new Date(savedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}` : "아직 저장하지 않았어요."}
          </span>
          <button
            onClick={handleSave}
            style={{
              background: C.ink,
              color: "#fff",
              fontSize: 13,
              padding: "8px 16px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Check size={14} />
            기록 저장
          </button>
        </div>
      </div>

      {/* 스트릭 */}
      {streak.length > 0 && (
        <div>
          <h3 style={{ fontFamily: SERIF, fontSize: 15, color: C.ink, marginBottom: 10 }}>이번 주 묵상</h3>
          <div className="flex gap-2">
            {streak.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-1">
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: d.done ? C.sage : "#fff",
                    border: `1px solid ${d.done ? C.sage : C.line}`,
                  }}
                />
                <span style={{ fontSize: 10, color: C.inkSoft }}>{["일", "월", "화", "수", "목", "금", "토"][new Date(d.date).getDay()]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- QUIZ ----------------
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
    if (i + 1 >= total) {
      setFinished(true);
      return;
    }
    setI((v) => v + 1);
    setSelected(null);
  }
  function restart() {
    setI(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  const message = useMemo(() => {
    const ratio = score / total;
    if (ratio === 1) return "완벽해요! 말씀을 꼼꼼히 알고 계시네요.";
    if (ratio >= 0.7) return "훌륭해요! 조금만 더 채우면 완주예요.";
    if (ratio >= 0.4) return "좋은 시작이에요. 다시 도전해볼까요?";
    return "다시 한 번 천천히 풀어봐요.";
  }, [score, total]);

  if (finished) {
    return (
      <div className="text-center py-10">
        <p style={{ color: C.goldDeep, fontSize: 12, letterSpacing: "0.1em" }}>QUIZ COMPLETE</p>
        <p style={{ fontFamily: SERIF, fontSize: 40, color: C.ink, margin: "10px 0 6px" }}>
          {score} / {total}
        </p>
        <p style={{ color: C.inkSoft, fontSize: 14, marginBottom: 24 }}>{message}</p>
        <button
          onClick={restart}
          className="inline-flex items-center gap-2"
          style={{ background: C.ink, color: "#fff", fontSize: 13, padding: "10px 20px", borderRadius: 4 }}
        >
          <RotateCcw size={14} />
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 진행 바 */}
      <div className="flex gap-1.5 mb-5">
        {QUIZ_DATA.map((_, idx) => (
          <div
            key={idx}
            style={{
              height: 4,
              flex: 1,
              borderRadius: 2,
              background: idx < i ? C.sage : idx === i ? C.gold : C.line,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            fontSize: 11,
            padding: "3px 9px",
            borderRadius: 2,
            background: q.cat === "구약" ? "#EFEADA" : "#EAEFE3",
            color: q.cat === "구약" ? C.goldDeep : C.sageDeep,
          }}
        >
          {q.cat}
        </span>
        <span style={{ fontSize: 12, color: C.inkSoft }}>
          {i + 1} / {total}
        </span>
      </div>

      <p style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.6, color: C.ink, marginBottom: 20 }}>{q.q}</p>

      <div className="flex flex-col gap-2.5 mb-5">
        {q.opts.map((opt, idx) => {
          const isCorrect = idx === q.a;
          const isPicked = idx === selected;
          let bg = "#fff";
          let border = C.line;
          let textColor = C.ink;
          if (selected !== null) {
            if (isCorrect) {
              bg = "#EAEFE3";
              border = C.sage;
              textColor = C.sageDeep;
            } else if (isPicked) {
              bg = "#F5E7E4";
              border = C.clay;
              textColor = C.clayDeep;
            }
          }
          return (
            <button
              key={idx}
              onClick={() => choose(idx)}
              disabled={selected !== null}
              className="flex items-center justify-between text-left"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 4,
                padding: "12px 14px",
                fontSize: 14,
                color: textColor,
              }}
            >
              <span>{opt}</span>
              {selected !== null && isCorrect && <Check size={16} color={C.sageDeep} />}
              {selected !== null && isPicked && !isCorrect && <X size={16} color={C.clayDeep} />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 14px", marginBottom: 18 }}>
          <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}>{q.ex}</p>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={next}
          className="flex items-center gap-1.5 ml-auto"
          style={{ background: C.ink, color: "#fff", fontSize: 13, padding: "9px 16px", borderRadius: 4 }}
        >
          {i + 1 >= total ? "결과 보기" : "다음 문제"}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
