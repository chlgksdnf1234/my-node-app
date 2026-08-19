const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
      <h1>🚀 나만의 웹사이트 수정 성공!</h1>
      <p>Node.js와 Docker를 이용해 만든 웹페이지입니다.</p>
    </div>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
