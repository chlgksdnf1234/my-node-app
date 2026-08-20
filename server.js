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
  <title>한신대 교목실 Q.T</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- 카카오맵 API -->
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=b008fd63caf472c5c5eb546241b75c54"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;

    function MapModal({ onClose }) {
      useEffect(() => {
        // 팝업이 뜬 후 지도가 렌더링될 수 있도록 약간의 지연 시간을 줌
        setTimeout(() => {
          const container = document.getElementById('kakao-map-container');
          if (!container) return;
          const options = {
            center: new kakao.maps.LatLng(37.1936, 127.0210),
            level: 3
          };
          const map = new kakao.maps.Map(container, options);
          const markerPosition = new kakao.maps.LatLng(37.1936, 127.0210);
          const marker = new kakao.maps.Marker({ position: markerPosition });
          marker.setMap(map);
          
          const overlay = new kakao.maps.CustomOverlay({
            content: '<div style="padding:4px 8px; background:white; border:1px solid black; font-size:12px; font-weight:bold;">샬롬채플실</div>',
            position: markerPosition,
            yAnchor: 2.2
          });
          overlay.setMap(map);
        }, 200);
      }, []);

      return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-5 rounded-xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">샬롬채플실 위치</h2>
              <button onClick={onClose} className="text-xl">✕</button>
            </div>
            <div id="kakao-map-container" style={{ width: '100%', height: '250px', borderRadius: '8px' }}></div>
            <div className="mt-4 text-sm text-gray-700">
              <p>📍 경기도 오산시 한신대길 137, 샬롬채플실</p>
              <div className="flex gap-2 mt-4">
                <a href="https://map.kakao.com/?q=한신대학교샬롬채플실" target="_blank" className="flex-1 bg-yellow-400 p-2 text-center font-bold rounded-lg text-sm">카카오맵 길찾기</a>
                <a href="https://map.naver.com/p/search/한신대학교샬롬채플실" target="_blank" className="flex-1 bg-green-500 text-white p-2 text-center font-bold rounded-lg text-sm">네이버맵 길찾기</a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    function App() {
      const [isMapOpen, setIsMapOpen] = useState(false);
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <button onClick={() => setIsMapOpen(true)} className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg font-bold">
            🗺️ 샬롬채플실 지도 보기
          </button>
          {isMapOpen && <MapModal onClose={() => setIsMapOpen(false)} />}
        </div>
      );
    }
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`);
});

const PORT = 3000;
app.listen(PORT, () => console.log('Server running on port 3000'));
