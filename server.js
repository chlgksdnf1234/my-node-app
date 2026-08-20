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
  <title>한신대 교목실 Q.T</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- 카카오맵 API -->
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b008fd63caf472c5c5eb546241b75c54"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap');
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;
    const SANS = "'Noto Sans KR', sans-serif";
    const SERIF = "'Nanum Myeongjo', serif";

    // ... (중략: 기존 QT_DATA, ALL_QUIZ_POOL 데이터는 이전과 동일)
    const QT_DATA = [{ ref: "시편 23:1", verse: "여호와는 나의 목자시니 내게 부족함이 없으리로다.", lead: "돌보심", questions: ["오늘 내게 가장 필요한 채움은 무엇인가요?"] }, { ref: "마 6:34", verse: "그러므로 내일 일을 위하여 염려하지 말라 내일 일은 내일이 염려할 것이요...", lead: "오늘", questions: ["내가 미리 당겨서 하는 걱정은 무엇인가요?"] }];
    const ALL_QUIZ_POOL = [{ cat: "구약", q: "노아의 방주에 함께 탄 가족은 모두 몇 명이었나요?", type: "choice", opts: ["4명", "6명", "8명", "10명"], a: 2, ex: "총 8명입니다." }];

    function App() {
      const [isMapOpen, setIsMapOpen] = useState(false);
      return (
        <div style={{ fontFamily: SANS }} className="p-5">
          <button onClick={() => setIsMapOpen(true)} className="bg-blue-500 text-white p-2 rounded">지도 보기</button>
          {isMapOpen && <MapModal onClose={() => setIsMapOpen(false)} />}
        </div>
      );
    }

    function MapModal({ onClose }) {
      useEffect(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = { center: new kakao.maps.LatLng(37.1936, 127.0210), level: 3 };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(37.1936, 127.0210) });
        marker.setMap(map);
        new kakao.maps.CustomOverlay({
          content: '<div style="padding:5px; background:white; border:1px solid #000; font-size:12px;">샬롬채플실</div>',
          position: marker.getPosition(),
          yAnchor: 2
        }).setMap(map);
      }, []);

      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-5 rounded-lg w-full max-w-md">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold">한신대학교 샬롬채플실 위치</h2>
              <button onClick={onClose}>✕</button>
            </div>
            <div id="map" style={{ width: '100%', height: '300px' }}></div>
            <div className="mt-4 text-sm">
              <p>📍 경기도 오산시 한신대길 137, 샬롬채플실</p>
              <div className="flex gap-2 mt-3">
                <a href="https://map.kakao.com/?q=한신대학교샬롬채플실" target="_blank" className="bg-yellow-400 p-2 rounded flex-1 text-center font-bold">카카오맵</a>
                <a href="https://sksms.tmap.co.kr/" target="_blank" className="bg-red-500 text-white p-2 rounded flex-1 text-center font-bold">T맵</a>
              </div>
            </div>
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

app.listen(3000, () => console.log('Server running on port 3000'));
