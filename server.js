const express = require('express');
const app = express();

app.use(express.json());

let sharedQtRecords = [];
let sharedQuizRecords = [];

app.get('/api/data', (req, res) => {
  res.json({ qt: sharedQtRecords, quiz: sharedQuizRecords });
});

app.post('/api/qt', (req, res) => {
  const { name, date, text, timestamp } = req.body;
  if (!text) return res.status(400).send('Empty');
  
  sharedQtRecords.push({ name: name || "등록안함", date, text, timestamp: timestamp || Date.now() });
  res.send({ success: true });
});

app.post('/api/quiz', (req, res) => {
  const { name, date, score, total } = req.body;
  sharedQuizRecords.push({ name: name || "등록안함", date, score, total, timestamp: Date.now() });
  res.send({ success: true });
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>한신대 교목실 Q.T - 말씀으로 여는 하루</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
    body { margin: 0; padding: 0; transition: background-color 0.3s; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    const lightTheme = {
      paper: "#FAF6ED", paperDeep: "#F2ECDC", ink: "#23304A", inkSoft: "#5B6577",
      gold: "#C9A24B", goldDeep: "#A9822F", sage: "#6E8B74", sageDeep: "#4E6B54",
      clay: "#B8695C", clayDeep: "#8F4A3F", line: "#E3DCC8", boxBg: "#FFFFFF"
    };
    const darkTheme = {
      paper: "#121212", paperDeep: "#1E1E1E", ink: "#E5E7EB", inkSoft: "#9CA3AF",
      gold: "#D4AF37", goldDeep: "#B8860B", sage: "#8FBC8F", sageDeep: "#698B69",
      clay: "#CD5C5C", clayDeep: "#8B3A3A", line: "#374151", boxBg: "#1F2937"
    };

    const SERIF = "'Nanum Myeongjo', serif";
    const SANS = "'Noto Sans KR', sans-serif";

    const QT_DATA = [
      { ref: "시편 23:1", verse: "여호와는 나의 목자시니 내게 부족함이 없으리로다.", lead: "돌보심", questions: ["오늘 내게 가장 필요한 채움은 무엇인가요?", "목자 되신 주님께 나의 부족함을 기도로 맡겨보세요."] },
      { ref: "마 6:34", verse: "그러므로 내일 일을 위하여 염려하지 말라 내일 일은 내일이 염려할 것이요...", lead: "오늘", questions: ["내가 미리 당겨서 하는 걱정은 무엇인가요?", "오늘 하루에만 집중하기 위해 내려놓을 생각은 무엇인가요?"] },
      { ref: "빌 4:6-7", verse: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라.", lead: "평안", questions: ["내 마음을 무겁게 하는 염려 한 가지는?", "이 염려를 감사의 기도로 어떻게 바꿀 수 있을까요?"] },
      { ref: "시 1:1-2", verse: "복 있는 사람은 악인들의 꾀를 따르지 아니하며... 오직 여호와의 율법을 즐거워하여 주야로 묵상하는도다.", lead: "기쁨", questions: ["요즘 내가 가장 마음을 쏟고 즐거워하는 것은 무엇인가요?", "말씀이 기준이 되기 위해 버려야 할 습관은?"] },
      { ref: "잠 4:23", verse: "모든 지킬 만한 것 중에 더욱 네 마음을 지키라 생명의 근원이 이에서 남이니라.", lead: "마음", questions: ["최근 내 마음을 어지럽게 한 사건은 무엇인가요?", "오늘 내 마음을 평안하게 지키기 위해 피해야 할 것은?"] },
      { ref: "롬 8:28", verse: "하나님을 사랑하는 자... 그 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라.", lead: "합력", questions: ["지금 당장 이해되지 않거나 힘든 상황이 있나요?", "하나님의 선하심을 믿고 기다려야 할 부분은 어디인가요?"] },
      { ref: "갈 5:22-23", verse: "오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과 온유와 절제니...", lead: "열매", questions: ["지금 나에게 가장 부족한 성령의 열매는 무엇인가요?", "오늘 그 열매를 맺기 위해 실천할 수 있는 작은 행동은?"] },
      { ref: "엡 2:8", verse: "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니... 하나님의 선물이라.", lead: "선물", questions: ["내 능력이 아닌 은혜로 구원받았다는 사실이 주는 위로는?", "오늘 이 거저 받은 사랑에 어떻게 반응하며 살까요?"] },
      { ref: "빌 4:13", verse: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.", lead: "능력", questions: ["내 힘만으로는 도저히 할 수 없다고 느껴지는 일이 있나요?", "주님의 능력을 의지하며 오늘 용기 낼 일은 무엇인가요?"] },
      { ref: "요 14:27", verse: "평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라...", lead: "참평안", questions: ["내가 평안을 얻기 위해 세상에서 찾았던 것은 무엇인가요?", "주님이 주시는 진짜 평안을 내 마음에 채워달라고 기도해보세요."] },
      { ref: "고전 10:13", verse: "시험 당할 즈음에 또한 피할 길을 내사 너희로 능히 감당하게 하시느니라.", lead: "감당", questions: ["지금 나를 짓누르는 가장 큰 부담이나 어려움은 무엇인가요?", "피할 길을 주신다는 약속을 믿고 오늘 어떻게 견뎌낼까요?"] },
      { ref: "사 41:10", verse: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라.", lead: "동행", questions: ["알 수 없는 결과 때문에 두려워하는 것이 있나요?", "나와 늘 동행하시는 하나님께 오늘 어떤 대화를 걸고 싶나요?"] },
      { ref: "롬 12:2", verse: "너희는 이 세대를 본받지 말고 오직 마음을 새롭게 함으로 변화를 받아...", lead: "분별", questions: ["무의식적으로 따라가고 있는 세상의 기준이 있나요?", "오늘 하나님의 기뻐하시는 뜻을 선택하기 위한 결단은?"] },
      { ref: "살전 5:16-18", verse: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라...", lead: "태도", questions: ["최근 감사를 잃어버리게 만든 원인은 무엇인가요?", "그럼에도 불구하고 오늘 감사할 수 있는 세 가지는 무엇인가요?"] },
      { ref: "요일 4:18", verse: "사랑 안에 두려움이 없고 온전한 사랑이 두려움을 내쫓나니...", lead: "사랑", questions: ["요즘 나를 가장 움츠러들게 하는 두려움은 무엇인가요?", "하나님의 온전한 사랑이 그 두려움을 어떻게 몰아낼 수 있을까요?"] },
      { ref: "수 1:9", verse: "강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라.", lead: "담대함", questions: ["오늘 내가 마주해야 할 가장 부담스러운 일은 무엇인가요?", "나와 함께하시는 하나님을 기억할 때 용기가 생기나요?"] },
      { ref: "시 119:105", verse: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다.", lead: "인도", questions: ["지금 결정을 내리지 못하고 방황하는 일이 있나요?", "말씀이 내 길을 비춰주기를 기도하며 오늘 하루를 시작해보세요."] },
      { ref: "마 11:28", verse: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라.", lead: "안식", questions: ["지금 내가 짊어지고 있는 가장 무거운 삶의 짐은 무엇인가요?", "그 짐을 주님 앞에 온전히 내려놓는다는 것은 어떤 의미일까요?"] },
      { ref: "갈 2:20", verse: "내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라.", lead: "내어드림", questions: ["여전히 내가 주인 되어 통제하려고 하는 삶의 영역은 어디인가요?", "내 삶을 온전히 예수님께 내어드리는 기도를 적어보세요."] },
      { ref: "히 11:1", verse: "믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니.", lead: "믿음", questions: ["지금 내 눈에 보이지 않지만, 믿음으로 기다리고 있는 것은 무엇인가요?", "그 믿음이 흔들릴 때 나는 무엇을 바라보아야 할까요?"] },
      { ref: "잠 3:5-6", verse: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라...", lead: "신뢰", questions: ["나의 경험이나 지식을 하나님보다 앞세웠던 적은 없나요?", "모든 일에서 하나님을 인정한다는 것은 구체적으로 어떤 행동일까요?"] },
      { ref: "시 46:1", verse: "하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라.", lead: "피난처", questions: ["어려움이 찾아올 때 나는 가장 먼저 누구를(또는 무엇을) 찾나요?", "오늘 피난처 되신 하나님 품 안에서 어떻게 쉴 수 있을까요?"] },
      { ref: "사 40:31", verse: "오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개 치며 올라감 같을 것이요...", lead: "새 힘", questions: ["요즘 나를 가장 지치고 무기력하게 만드는 원인은 무엇인가요?", "하나님을 간절히 바랄 때 주시는 '새 힘'을 오늘 구해보세요."] },
      { ref: "요 15:5", verse: "나는 포도나무요 너희는 가지라 그가 내 안에, 내가 그 안에 거하면 사람이 열매를 많이 맺나니...", lead: "거함", questions: ["바쁜 일상 속에서 예수님과 온전히 연결되어 있다고 느끼나요?", "오늘 5분이라도 가지가 나무에 붙어있듯 주님 안에 머무는 시간은 언제로 할까요?"] },
      { ref: "마 5:16", verse: "이같이 너희 빛이 사람 앞에 비치게 하여 그들로 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라.", lead: "빛", questions: ["내가 속한 가정이나 직장에서 나는 어떤 빛을 내고 있나요?", "오늘 나의 작은 친절이나 행실이 누군가에게 어떻게 위로가 될 수 있을까요?"] },
      { ref: "롬 5:8", verse: "우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨느니라.", lead: "확증", questions: ["나의 부족함에도 불구하고 베푸신 크신 사랑을 묵상해보세요.", "그 십자가의 사랑이 오늘 나의 자존감을 어떻게 회복시키나요?"] },
      { ref: "시 139:14", verse: "내가 주께 감사하옴은 나를 지으심이 심히 기묘하심이라 주께서 하시는 일이 기이함을 내 영혼이 잘 아나이다.", lead: "창조", questions: ["내 외모나 성격 중 마음에 들지 않아 불평했던 부분이 있나요?", "하나님의 걸작품인 나 자신을 있는 그대로 사랑하고 칭찬해 보세요."] },
      { ref: "골 3:2", verse: "위의 것을 생각하고 땅의 것을 생각하지 말라.", lead: "시선", questions: ["내 시선과 생각이 너무 세상적인 가치(돈, 명예)에만 쏠려 있지 않나요?", "오늘 나의 초점을 하나님 나라와 영원한 것에 맞추려면 어떻게 해야 할까요?"] },
      { ref: "약 1:5", verse: "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라.", lead: "지혜", questions: ["현재 지혜롭게 풀어나가야 할 인간관계나 문제 상황이 있나요?", "내 생각대로 하지 않고, 하나님의 지혜를 구하는 기도를 드리세요."] },
      { ref: "벧전 5:7", verse: "너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라.", lead: "맡김", questions: ["하나님께 맡기지 못하고 여전히 내가 꽉 쥐고 있는 걱정은 무엇인가요?", "이 걱정 보따리를 십자가 앞에 내려놓을 때 느껴지는 감정은 어떠한가요?"] },
      { ref: "애 3:22-23", verse: "여호와의 인자와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것들이 아침마다 새로우니 주의 성실하심이 크시도소이다.", lead: "새로움", questions: ["어제 지은 죄나 실수 때문에 오늘도 마음이 무겁나요?", "아침마다 새롭게 부어주시는 자비와 긍휼을 찬양해보세요."] }
    ];

    const ALL_QUIZ_POOL = [
      { cat: "구약", q: "노아의 방주에 함께 탄 가족은 모두 몇 명이었나요?", type: "choice", opts: ["4명", "6명", "8명", "10명"], a: 2, ex: "노아 부부와 세 아들 부부, 총 8명이 탔습니다." },
      { cat: "구약", q: "이스라엘 백성이 홍해를 건널 때 지도자는 누구였나요?", type: "choice", opts: ["아브라함", "모세", "여호수아", "다윗"], a: 1, ex: "모세가 지팡이를 들어 홍해를 갈랐습니다." },
      { cat: "구약", q: "다윗이 물맷돌로 쓰러뜨린 블레셋 장수의 이름은?", type: "choice", opts: ["골리앗", "삼손", "사울", "아각"], a: 0, ex: "다윗은 물맷돌 하나로 거인 골리앗을 쓰러뜨렸습니다." },
      { cat: "구약", q: "요셉이 형들에 의해 팔려간 나라는 어디인가요?", type: "choice", opts: ["바벨론", "애굽", "앗시리아", "페르시아"], a: 1, ex: "요셉은 애굽으로 팔려갔고 훗날 총리가 됩니다." },
      { cat: "구약", q: "십계명을 받은 산의 이름은 무엇인가요?", type: "choice", opts: ["감람산", "시내산", "시온산", "갈멜산"], a: 1, ex: "모세는 시내산에서 십계명을 받았습니다." },
      { cat: "신약", q: "예수님이 태어나신 마을은 어디인가요?", type: "choice", opts: ["나사렛", "예루살렘", "베들레헴", "가버나움"], a: 2, ex: "예수님은 베들레헴에서 태어나셨습니다." },
      { cat: "신약", q: "은 삼십에 예수님을 배반한 제자는?", type: "choice", opts: ["베드로", "가룟 유다", "도마", "안드레"], a: 1, ex: "가룟 유다가 예수님을 넘겨주었습니다." },
      { cat: "신약", q: "예수님이 물을 포도주로 바꾸신 기적이 일어난 곳은?", type: "choice", opts: ["가나", "가버나움", "베다니", "갈릴리"], a: 0, ex: "가나의 혼인 잔치에서 일어난 첫 표적입니다." },
      { cat: "신약", q: "오병이어로 먹이신 남자의 수는 약 몇 명이었나요?", type: "choice", opts: ["3천명", "4천명", "5천명", "7천명"], a: 2, ex: "약 5천 명이 먹고도 12광주리가 남았습니다." },
      { cat: "신약", q: "선한 사마리아인 비유에서 다친 자를 도운 사람은?", type: "choice", opts: ["제사장", "레위인", "사마리아인", "바리새인"], a: 2, ex: "유대인들에게 천대받던 사마리아인이 그를 도왔습니다." },
      { cat: "넌센스", q: "김목민의 연애 횟수는??", type: "choice", opts: ["1회", "2회", "3회", "4회"], a: 3, ex: "꼴에 생각보다 많이 했습니다." },
      { cat: "넌센스", q: "김목민의 생일은??", type: "choice", opts: ["5월5일", "7월3일", "6월4일", "12월25일"], a: 2, ex: "김목민은 6월4일에 모 박경미 부 김명종사이에서 태어났습니다." },
      { cat: "넌센스", q: "김목민의 키는??", type: "choice", opts: ["163cm", "171cm", "168cm", "183cm"], a: 2, ex: "김목민의 키는 신검 기준 170cm이지만 이후 스트레스로 인해 2cm가 줄어 168cm입니다." },
      { cat: "넌센스", q: "김목민의 고향은??", type: "choice", opts: ["해남", "완도", "전복", "광주"], a: 1, ex: "김목민은 전복의 도시 완도에서 2001년 06년 04일에 출생하고 2016년도까지 거주했습니다." },
      { cat: "넌센스", q: "김목민의 다리는??", type: "text", answer: "백만불짜리다리", ex: "김목민의 다리는 아주 소중한 백만불짜리 다리입니다." }
    ];

    function todayStr() {
      const d = new Date();
      return \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, "0")}-\${String(d.getDate()).padStart(2, "0")}\`;
    }

    function App() {
      const [userName, setUserName] = useState(null);
      const [tempName, setTempName] = useState("");
      const [tab, setTab] = useState("qt");
      const [isDark, setIsDark] = useState(false);
      const [isAdminOpen, setIsAdminOpen] = useState(false);
      const [isMapOpen, setIsMapOpen] = useState(false);

      useEffect(() => {
        const savedTheme = localStorage.getItem('hanshin-qt-theme');
        if (savedTheme === 'dark') setIsDark(true);
        
        const savedUser = localStorage.getItem('hanshin-qt-username');
        if (savedUser) setUserName(savedUser);
      }, []);

      const handleLoginSubmit = (e) => {
        e.preventDefault();
        const nameToUse = tempName.trim() || "등록안함";
        setUserName(nameToUse);
        localStorage.setItem('hanshin-qt-username', nameToUse);
      };

      const handleSkipLogin = () => {
        setUserName("등록안함");
        localStorage.setItem('hanshin-qt-username', "등록안함");
      };

      const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('hanshin-qt-theme', newTheme ? 'dark' : 'light');
      };

      const C = isDark ? darkTheme : lightTheme;

      if (!userName) {
        return (
          <div style={{ background: C.paper, minHeight: "100vh", fontFamily: SANS, color: C.ink }} className="flex items-center justify-center p-5">
            <div style={{ background: C.boxBg, border: \`1px solid \${C.line}\`, borderRadius: 8, padding: 30, width: '100%', maxWidth: '400px' }} className="shadow-lg">
              <div className="text-center mb-6">
                <span className="text-3xl">✝️</span>
                <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, marginTop: 8 }}>한신대 교목실 Q.T</h1>
                <p style={{ fontSize: 13, color: C.inkSoft, marginTop: 4 }}>이름을 입력하고 시작해 주세요.</p>
              </div>
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
                <input 
                  type="text" 
                  placeholder="본인의 이름을 입력하세요" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  style={{ background: C.paper, color: C.ink, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: "12px 14px", fontSize: 14, outline: 'none' }}
                />
                <button type="submit" style={{ background: C.ink, color: C.paper, padding: "12px", borderRadius: 4, fontWeight: 'bold' }}>입장하기</button>
                <button type="button" onClick={handleSkipLogin} style={{ background: C.paper, color: C.inkSoft, border: \`1px solid \${C.line}\`, padding: "10px", borderRadius: 4, fontSize: 13 }}>등록 안함 (익명으로 시작)</button>
              </form>
            </div>
          </div>
        );
      }

      return (
        <div style={{ background: C.paper, minHeight: "100vh", fontFamily: SANS, color: C.ink }} className="w-full relative pb-10">
          <div className="max-w-xl mx-auto px-5 pt-8 pb-16">
            <Header 
              C={C} 
              userName={userName} 
              onOpenAdmin={() => setIsAdminOpen(true)} 
              onChangeUser={() => setUserName(null)} 
              onOpenMap={() => setIsMapOpen(true)}
            />
            <TabBar tab={tab} setTab={setTab} C={C} />
            {tab === "qt" ? <QTView C={C} userName={userName} /> : <QuizView C={C} userName={userName} />}
          </div>

          <button 
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center text-xl z-20"
            style={{ background: C.boxBg, border: \`1px solid \${C.line}\`, color: C.ink, width: '50px', height: '50px' }}
            title="다크/라이트 모드 전환"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {isAdminOpen && <AdminModal C={C} onClose={() => setIsAdminOpen(false)} />}
          {isMapOpen && <MapModal C={C} onClose={() => setIsMapOpen(false)} />}
        </div>
      );
    }

    function Header({ C, userName, onOpenAdmin, onChangeUser, onOpenMap }) {
      return (
        <div className="mb-7 relative">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <button 
              onClick={onOpenMap}
              style={{ background: C.boxBg, border: \`1px solid \${C.line}\`, color: C.goldDeep, fontSize: 11, padding: '4px 10px', borderRadius: 4, fontWeight: 'bold' }}
            >
              🗺️ 한신대학교 샬롬채플실 찾아가는 길
            </button>
            <button 
              onClick={onOpenAdmin}
              style={{ background: C.boxBg, border: \`1px solid \${C.line}\`, color: C.ink, fontSize: 11, padding: '4px 10px', borderRadius: 4 }}
            >
              🔒 관리자
            </button>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span>✝️</span>
            <span style={{ color: C.goldDeep, fontFamily: SANS, fontSize: 12, letterSpacing: "0.12em" }}>HANSHIN UNIVERSITY</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h1 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>한신대 교목실 Q.T</h1>
            <span style={{ fontSize: 13, color: C.goldDeep }}>({userName}님)</span>
            <button onClick={onChangeUser} style={{ fontSize: 11, color: C.inkSoft, textDecoration: 'underline' }}>이름변경</button>
          </div>
          <p style={{ color: C.inkSoft, fontSize: 13, marginTop: 4 }}>말씀과 기도로 거룩한 하루를 여는 시간</p>
        </div>
      );
    }

    function TabBar({ tab, setTab, C }) {
      return (
        <div style={{ borderBottom: \`1px solid \${C.line}\` }} className="flex gap-6 mb-7">
          <button onClick={() => setTab("qt")} className="flex items-center gap-1.5 pb-3 transition-colors"
            style={{ borderBottom: tab === "qt" ? \`2px solid \${C.ink}\` : "2px solid transparent", marginBottom: -1, color: tab === "qt" ? C.ink : C.inkSoft, fontWeight: tab === "qt" ? 700 : 500 }}>
            📝 오늘의 큐티
          </button>
          <button onClick={() => setTab("quiz")} className="flex items-center gap-1.5 pb-3 transition-colors"
            style={{ borderBottom: tab === "quiz" ? \`2px solid \${C.ink}\` : "2px solid transparent", marginBottom: -1, color: tab === "quiz" ? C.ink : C.inkSoft, fontWeight: tab === "quiz" ? 700 : 500 }}>
            🎯 퀴즈
          </button>
        </div>
      );
    }

    function QTView({ C, userName }) {
      const [entry] = useState(() => {
        const randomIndex = Math.floor(Math.random() * QT_DATA.length);
        return QT_DATA[randomIndex];
      });
      
      const [journal, setJournal] = useState("");
      const [savedAt, setSavedAt] = useState(null);

      function handleSave() {
        if (!journal.trim()) return;
        const now = Date.now();
        setSavedAt(now);

        fetch('/api/qt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userName, date: todayStr(), text: \`[\${entry.ref}] \${journal}\`, timestamp: now })
        }).catch(err => console.error(err));
      }

      return (
        <div>
          <div style={{ background: C.boxBg, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: "22px 22px 20px", marginBottom: 22, position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: 20, background: C.gold, color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 2 }}>{entry.lead}</div>
            <p style={{ color: C.goldDeep, fontSize: 12, marginTop: 4, marginBottom: 10 }}>{entry.ref}</p>
            <div style={{ fontFamily: SERIF, fontSize: 20, lineHeight: 1.8, color: C.ink, display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ fontSize: 38, color: C.gold, fontWeight: 700, lineHeight: 1, display: "inline-block", minWidth: "28px" }}>{entry.verse[0]}</span>
              <span style={{ flex: 1, paddingTop: "2px" }}>{entry.verse.slice(1)}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 style={{ fontFamily: SERIF, fontSize: 15, marginBottom: 12, color: C.ink }}>묵상 질문</h3>
            <div className="flex flex-col gap-3">
              {entry.questions.map((q, i) => (
                <div key={i} className="flex gap-3">
                  <div style={{ minWidth: 22, height: 22, borderRadius: "50%", border: \`1px solid \${C.gold}\`, color: C.goldDeep, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: C.ink }}>{q}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 style={{ fontFamily: SERIF, fontSize: 15, marginBottom: 10, color: C.ink }}>오늘의 묵상 기록</h3>
            <textarea value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="오늘 말씀을 읽으며 든 생각과 기도를 적어보세요." rows="5"
              style={{ width: "100%", background: C.boxBg, color: C.ink, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: 14, fontSize: 14, outline: "none" }} />
            <div className="flex items-center justify-between mt-3">
              <span style={{ fontSize: 12, color: C.inkSoft }}>{savedAt ? \`전송완료 \${new Date(savedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}\` : "기록을 작성하고 저장해보세요."}</span>
              <button onClick={handleSave} style={{ background: C.ink, color: C.paper, fontSize: 13, padding: "8px 16px", borderRadius: 4 }}>✅ 저장 및 제출</button>
            </div>
          </div>
        </div>
      );
    }

    function QuizView({ C, userName }) {
      const [quizList] = useState(() => {
        const shuffled = [...ALL_QUIZ_POOL].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
      });

      const [i, setI] = useState(0);
      const [selected, setSelected] = useState(null);
      const [textInput, setTextInput] = useState("");
      const [isTextCorrect, setIsTextCorrect] = useState(null);
      const [score, setScore] = useState(0);
      const [finished, setFinished] = useState(false);
      
      const total = quizList.length;
      const q = quizList[i];

      function choose(optIdx) {
        if (selected !== null) return;
        setSelected(optIdx);
        if (optIdx === q.a) setScore((s) => s + 1);
      }

      function submitText() {
        if (isTextCorrect !== null || !textInput.trim()) return;
        const cleanInput = textInput.trim().replace(/\\s+/g, '');
        const cleanAnswer = q.answer.replace(/\\s+/g, '');
        const correct = cleanInput === cleanAnswer;
        setIsTextCorrect(correct);
        if (correct) setScore((s) => s + 1);
      }

      function next() {
        if (i + 1 >= total) {
          setFinished(true);
          const finalScore = score + (isTextCorrect ? 1 : 0);
          
          fetch('/api/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userName, date: todayStr(), score: finalScore, total })
          }).catch(err => console.error(err));
          
          return;
        }
        setI((v) => v + 1);
        setSelected(null);
        setTextInput("");
        setIsTextCorrect(null);
      }

      function restart() {
        window.location.reload();
      }

      if (finished) {
        return (
          <div className="text-center py-10" style={{ background: C.boxBg, borderRadius: 8, padding: 30, border: \`1px solid \${C.line}\` }}>
            <p style={{ color: C.goldDeep, fontSize: 12, letterSpacing: "0.1em" }}>QUIZ COMPLETE</p>
            <p style={{ fontFamily: SERIF, fontSize: 40, margin: "10px 0 6px", color: C.ink }}>{score} / {total}</p>
            <p style={{ color: C.inkSoft, fontSize: 14, marginBottom: 24 }}>퀴즈를 모두 마치고 기록이 제출되었습니다!</p>
            <button onClick={restart} style={{ background: C.ink, color: C.paper, fontSize: 13, padding: "10px 20px", borderRadius: 4 }}>🔄 새로운 퀴즈 풀기</button>
          </div>
        );
      }

      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 2, background: C.boxBg === "#FFFFFF" ? "#EFEADA" : "#3F3724", color: C.goldDeep }}>{q.cat}</span>
            <span style={{ fontSize: 12, color: C.inkSoft }}>{i + 1} / {total}</span>
          </div>
          <p style={{ fontFamily: SERIF, fontSize: 19, lineHeight: 1.6, marginBottom: 20, color: C.ink }}>{q.q}</p>

          {q.type === 'choice' ? (
            <div className="flex flex-col gap-2.5 mb-5">
              {q.opts.map((opt, idx) => {
                const isCorrect = idx === q.a;
                const isPicked = idx === selected;
                let bg = C.boxBg, border = C.line, textColor = C.ink;
                
                if (selected !== null) {
                  if (isCorrect) { 
                    bg = C.boxBg === "#FFFFFF" ? "#EAEFE3" : "#1B2A1F"; 
                    border = C.sage; textColor = C.sageDeep; 
                  }
                  else if (isPicked) { 
                    bg = C.boxBg === "#FFFFFF" ? "#F5E7E4" : "#3D1F1A"; 
                    border = C.clay; textColor = C.clayDeep; 
                  }
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
          ) : (
            <div className="mb-5">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={textInput} 
                  onChange={(e) => setTextInput(e.target.value)} 
                  disabled={isTextCorrect !== null}
                  placeholder="정답을 입력하세요"
                  style={{ flex: 1, background: C.boxBg, color: C.ink, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: "12px 14px", fontSize: 14, outline: 'none' }}
                />
                {isTextCorrect === null && (
                  <button onClick={submitText} style={{ background: C.ink, color: C.paper, fontSize: 13, padding: "0 16px", borderRadius: 4 }}>제출</button>
                )}
              </div>
              {isTextCorrect !== null && (
                <div className="mt-3 p-3 rounded" style={{ background: isTextCorrect ? (C.boxBg === "#FFFFFF" ? "#EAEFE3" : "#1B2A1F") : (C.boxBg === "#FFFFFF" ? "#F5E7E4" : "#3D1F1A"), color: isTextCorrect ? C.sageDeep : C.clayDeep }}>
                  {isTextCorrect ? "정답입니다! 🎉" : \`틀렸습니다. (정답: \${q.answer})\`}
                </div>
              )}
            </div>
          )}

          {((q.type === 'choice' && selected !== null) || (q.type === 'text' && isTextCorrect !== null)) && (
            <div>
              <div style={{ background: C.boxBg, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: "12px 14px", marginBottom: 18 }}>
                <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}>{q.ex}</p>
              </div>
              <button onClick={next} className="ml-auto flex items-center gap-1.5" style={{ background: C.ink, color: C.paper, fontSize: 13, padding: "9px 16px", borderRadius: 4 }}>
                {i + 1 >= total ? "결과 보기" : "다음 문제"} ▶️
              </button>
            </div>
          )}
        </div>
      );
    }

    function MapModal({ C, onClose }) {
      return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div style={{ background: C.boxBg, color: C.ink, border: \`1px solid \${C.line}\`, borderRadius: 12, width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            {/* 네이버 지도 스타일 헤더 */}
            <div style={{ background: '#03C75A', color: '#FFFFFF', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 11, borderTopRightRadius: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#FFFFFF', color: '#03C75A', fontWeight: 'bold', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>N 지도</span>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>한신대학교 샬롬채플실 위치</h2>
              </div>
              <button onClick={onClose} style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📍</span> <span>경기도 오산시 한신대길 137, 샬롬채플실</span>
              </div>

              {/* 지도 영역: overflow: hidden과 높이 조절로 저작권 문구 영역 깔끔하게 숨김 처리 */}
              <div style={{ width: '100%', height: '240px', borderRadius: 8, overflow: 'hidden', border: \`1px solid \${C.line}\`, marginBottom: '16px', position: 'relative', background: '#F8F9FA' }}>
                <iframe 
                  width="100%" 
                  height="275px" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=127.0185%2C37.1920%2C127.0235%2C37.1950&amp;layer=mapnik&amp;marker=37.1936%2C127.0210"
                  style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)', marginTop: '-15px' }}
                ></iframe>
              </div>

              {/* 문구 수정: 대학교회 삭제 및 샬롬채플실 표기 */}
              <div style={{ background: C.paper, border: \`1px solid \${C.line}\`, borderRadius: 8, padding: '14px', fontSize: 13, lineHeight: 1.6, marginBottom: '16px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: 6, color: C.goldDeep, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🚗</span> 찾아오시는 길
                </p>
                <ul style={{ paddingLeft: '18px', margin: 0, color: C.inkSoft, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>한신대 정문 진입 후 샬롬채플실 방향 도보 이동</li>
                  <li>캠퍼스 내 지정 주차 공간 이용 가능</li>
                </ul>
              </div>

              {/* 네이버 지도, 카카오맵, T맵 길찾기 버튼 (초록색 대신 깔끔한 검정/포인트 색상 조합) */}
              <div className="flex flex-col gap-2">
                <a 
                  href="https://map.naver.com/p/search/%ED%95%9C%EC%8B%A0%EB%8C%80%ED%95%99%EA%B5%90%20%EC%82%샬롬채플" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ background: '#23304A', color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', padding: '12px', borderRadius: 6, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  🗺️ 네이버 지도 길찾기
                </a>
                <div className="flex gap-2">
                  <a 
                    href="https://map.kakao.com/?q=한신대학교샬롬채플실" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ flex: 1, background: '#FEE500', color: '#191919', fontSize: 13, fontWeight: 'bold', padding: '11px', borderRadius: 6, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    🟡 카카오맵 길찾기
                  </a>
                  <a 
                    href="https://sksms.tmap.co.kr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ flex: 1, background: '#E60012', color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', padding: '11px', borderRadius: 6, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    🔴 T맵 길찾기
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      );
    }

    function AdminModal({ C, onClose }) {
      const [id, setId] = useState("");
      const [pw, setPw] = useState("");
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [qtRecords, setQtRecords] = useState([]);
      const [quizRecords, setQuizRecords] = useState([]);
      const [selectedName, setSelectedName] = useState("전체보기");

      function handleLogin(e) {
        e.preventDefault();
        if (id === "admin12" && pw === "admin12") {
          setIsLoggedIn(true);
          fetchData();
        } else {
          alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
      }

      function fetchData() {
        fetch('/api/data')
          .then(res => res.json())
          .then(data => {
            setQtRecords([...data.qt].sort((a,b) => b.timestamp - a.timestamp));
            setQuizRecords([...data.quiz].sort((a,b) => b.timestamp - a.timestamp));
          })
          .catch(err => console.error(err));
      }

      const allNames = ["전체보기", ...Array.from(new Set([...qtRecords.map(r => r.name), ...quizRecords.map(r => r.name)]))];

      const filteredQt = selectedName === "전체보기" ? qtRecords : qtRecords.filter(r => r.name === selectedName);
      const filteredQuiz = selectedName === "전체보기" ? quizRecords : quizRecords.filter(r => r.name === selectedName);

      return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div style={{ background: C.boxBg, color: C.ink, border: \`1px solid \${C.line}\`, borderRadius: 8, width: '100%', maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto', padding: 24 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700 }}>관리자 모드 (이름별 조회)</h2>
              <button onClick={onClose} style={{ fontSize: 18, fontWeight: 'bold' }}>✕</button>
            </div>

            {!isLoggedIn ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <p style={{ fontSize: 13, color: C.inkSoft }}>관리자 계정으로 로그인하여 이름을 선택해 확인하세요.</p>
                <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} 
                  style={{ background: C.paper, color: C.ink, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: 10, fontSize: 14, outline: 'none' }} />
                <input type="password" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)} 
                  style={{ background: C.paper, color: C.ink, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: 10, fontSize: 14, outline: 'none' }} />
                <button type="submit" style={{ background: C.ink, color: C.paper, padding: '10px', borderRadius: 4, fontWeight: 'bold', marginTop: 5 }}>로그인</button>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13, fontWeight: 'bold' }}>👤 이름 선택:</span>
                    <select 
                      value={selectedName} 
                      onChange={(e) => setSelectedName(e.target.value)}
                      style={{ background: C.paper, color: C.ink, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: "6px 10px", fontSize: 13, outline: 'none' }}
                    >
                      {allNames.map((name, idx) => (
                        <option key={idx} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={fetchData} style={{ fontSize: 11, padding: '4px 9px', background: C.paper, border: \`1px solid \${C.line}\`, borderRadius: 4 }}>🔄새로고침</button>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>📝 묵상 기록 ({filteredQt.length}개)</h3>
                {filteredQt.length === 0 ? (
                  <p style={{ fontSize: 13, color: C.inkSoft, marginBottom: 15 }}>해당하는 묵상 기록이 없습니다.</p>
                ) : (
                  <div className="flex flex-col gap-2 mb-6 max-h-48 overflow-y-auto">
                    {filteredQt.map((r, idx) => (
                      <div key={idx} style={{ background: C.paper, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: 10, fontSize: 13 }}>
                        <div className="flex justify-between font-bold mb-1" style={{ color: C.goldDeep }}>
                          <span>이름: {r.name}</span>
                          <span>날짜: {r.date}</span>
                        </div>
                        <div>{r.text}</div>
                        <div style={{ fontSize: 10, color: C.inkSoft, marginTop: 4 }}>제출시각: {new Date(r.timestamp).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>🎯 퀴즈 완료 내역 ({filteredQuiz.length}개)</h3>
                {filteredQuiz.length === 0 ? (
                  <p style={{ fontSize: 13, color: C.inkSoft }}>해당하는 퀴즈 내역이 없습니다.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {filteredQuiz.map((r, idx) => (
                      <div key={idx} style={{ background: C.paper, border: \`1px solid \${C.line}\`, borderRadius: 4, padding: 10, fontSize: 13 }}>
                        <div className="flex justify-between font-bold mb-1" style={{ color: C.sageDeep }}>
                          <span>이름: {r.name}</span>
                          <span>점수: {r.score} / {r.total} 점</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.inkSoft }}>응시 날짜: {r.date} / 완료시각: {new Date(r.timestamp).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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
