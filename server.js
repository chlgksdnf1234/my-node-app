const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Node.js 무료 웹 서버가 정상 작동 중입니다!</h1>');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});