const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 숏폼 스튜디오</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #121212; color: #fff; text-align: center; padding: 40px 20px; }
    .card { max-width: 500px; margin: 0 auto; background: #1e1e1e; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    h1 { color: #3b82f6; margin-bottom: 10px; }
    p { color: #aaa; margin-bottom: 20px; }
    input, select { width: 90%; padding: 12px; margin: 8px 0; border-radius: 8px; border: 1px solid #333; background: #2a2a2a; color: #fff; box-sizing: border-box; }
    button { width: 90%; padding: 14px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 15px; }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎬 AI 숏폼 스튜디오</h1>
    <p>웹사이트 배포가 성공적으로 완료되었습니다!</p>
    <label>자막 문구 입력</label>
    <input type="text" value="오늘 완성하는 나만의 AI 숏폼 영상">
    <button onclick="alert('서버가 정상적으로 작동 중입니다!')">영상 생성하기</button>
  </div>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
