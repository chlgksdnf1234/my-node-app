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
  <!-- 카카오맵 API -->
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b008fd63caf472c5c5eb546241b75c54"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
    body { margin: 0; padding: 0; transition: background-color 0.3s; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;
    const lightTheme = { paper: "#FAF6ED", ink: "#23304A", gold: "#C9A24B", goldDeep: "#A9822F", sageDeep: "#4E6B54", clayDeep: "#8F4A3F", line: "#E3DCC8", boxBg: "#FFFFFF", inkSoft: "#5B6577" };
    const darkTheme = { paper: "#121212", ink: "#E5E7EB", gold: "#D4AF37", goldDeep: "#B8860B", sageDeep: "#698B69", clayDeep: "#8B3A3A", line: "#374151", boxBg: "#1F2937", inkSoft: "#9CA3AF" };
    const SERIF = "'Nanum Myeongjo', serif"; const SANS = "'Noto Sans KR', sans-serif";

    const QT_DATA = [{ ref: "시편 23:1", verse: "여호와는 나의 목자시니 내게 부족함이 없으리로다.", lead: "돌보심", questions: ["오늘 내게 가장 필요한 채움은 무엇인가요?", "목자 되신 주님께 나의 부족함을 기도로 맡겨보세요."] }, { ref: "롬 5:8", verse: "우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨느니라.", lead: "확증", questions: ["나의 부족함에도 불구하고 베푸신 크신 사랑을 묵상해보세요.", "그 십자가의 사랑이 오늘 나의 자존감을 어떻게 회복시키나요?"] }];
    const ALL_QUIZ_POOL = [{ cat: "구약", q: "노아의 방주에 함께 탄 가족은 모두 몇 명이었나요?", type: "choice", opts: ["4명", "6명", "8명", "10명"], a: 2, ex: "노아 부부와 세 아들 부부, 총 8명이 탔습니다." }];

    function App() {
      const [userName, setUserName] = useState(localStorage.getItem('hanshin-qt-username') || null);
      const [isDark, setIsDark] = useState(localStorage.getItem('hanshin-qt-theme') === 'dark');
      const [isMapOpen, setIsMapOpen] = useState(false);
      const [tab, setTab] = useState("qt");
      const C = isDark ? darkTheme : lightTheme;

      if (!userName) {
        return (
          <div style={{ background: C.paper, minHeight: "100vh" }} className="flex items-center justify-center p-5">
            <div style={{ background: C.boxBg, border: \`1px solid \${C.line}\` }} className="p-8 rounded-lg text-center w-full max-w-sm">
              <h1 style={{ fontFamily: SERIF }} className="text-2xl font-bold mb-4">한신대 교목실 Q.T</h1>
              <input className="w-full p-2 border mb-3 rounded" placeholder="이름 입력" onKeyDown={(e) => { if(e.key === 'Enter') { setUserName(e.target.value); localStorage.setItem('hanshin-qt-username', e.target.value); }}} />
            </div>
          </div>
        );
      }

      return (
        <div style={{ background: C.paper, minHeight: "100vh", color: C.ink }} className="p-5">
          <div className="max-w-xl mx-auto">
            <button onClick={() => setIsMapOpen(true)} className="text-xs border p-2 mb-4">🗺️ 샬롬채플실 위치</button>
            <div className="flex gap-4 mb-4">
              <button onClick={() => setTab("qt")}>📝 큐티</button>
              <button onClick={() => setTab("quiz")}>🎯 퀴즈</button>
            </div>
            {tab === "qt" ? <QTView C={C} userName={userName} /> : <div className="text-center">퀴즈 화면</div>}
          </div>
          {isMapOpen && <MapModal C={C} onClose={() => setIsMapOpen(false)} />}
        </div>
      );
    }

    function MapModal({ C, onClose }) {
      useEffect(() => {
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(37.1936, 127.0210), level: 3 };
        const map = new kakao.maps.Map(container, options);
        const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(37.1936, 127.0210) });
        marker.setMap(map);
        new kakao.maps.CustomOverlay({
          content: '<div style="padding:5px; background:white; font-size:12px; font-weight:bold; border:1px solid black;">샬롬채플실</div>',
          position: marker.getPosition(),
          yAnchor: 2
        }).setMap(map);
      }, []);

      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div style={{ background: C.boxBg }} className="p-5 rounded-lg w-full max-w-sm">
            <div className="flex justify-between mb-3"><h2 className="font-bold">샬롬채플실 위치</h2><button onClick={onClose}>✕</button></div>
            <div id="map" style={{ width: '100%', height: '250px' }}></div>
            <p className="mt-3 text-sm">📍 경기도 오산시 한신대길 137, 샬롬채플실</p>
            <div className="flex gap-2 mt-3">
              <a href="https://map.kakao.com/?q=한신대학교샬롬채플실" target="_blank" className="flex-1 bg-yellow-400 p-2 text-center text-sm font-bold rounded">카카오맵</a>
              <a href="https://sksms.tmap.co.kr/" target="_blank" className="flex-1 bg-red-500 text-white p-2 text-center text-sm font-bold rounded">T맵</a>
            </div>
          </div>
        </div>
      );
    }

    function QTView({ C, userName }) {
      const entry = QT_DATA[0];
      return (
        <div style={{ background: C.boxBg }} className="p-6 rounded-lg border">
          <p className="text-xs mb-2" style={{ color: C.goldDeep }}>{entry.ref}</p>
          <div style={{ fontFamily: SERIF }} className="text-lg leading-relaxed">{entry.verse}</div>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`);
});

app.listen(3000, () => console.log('Server running on port 3000'));
