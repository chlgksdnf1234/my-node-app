const express = require('express');
const app = express();

app.use(express.json());

// Render 환경 변수에서 API 키 로드
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 1. Gemini AI 요청 처리용 서버 API 엔드포인트
app.post('/api/gemini', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: '서버에 GEMINI_API_KEY가 설정되지 않았습니다.' });
  }

  const { prompt } = req.body;

  // 무료 요금제에서 가장 안정적이고 빠르게 작동하는 공식 모델
  const models = ['gemini-1.5-flash'];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.json({ text: data.candidates[0].content.parts[0].text });
      } else {
        lastError = data.error?.message || `모델 ${model} 호출 실패`;
        console.error(`[서버 로그] ${model} 실패 사유:`, lastError);
      }
    } catch (err) {
      lastError = err.message;
      console.error(`[서버 로그] ${model} 요청 중 오류:`, err.message);
    }
  }

  console.error('Gemini API 최종 에러:', lastError);
  res.status(500).json({ error: lastError || 'Gemini API 호출에 실패했습니다.' });
});

// 2. 메인 페이지
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 숏폼 스튜디오</title>
  <style>
    :root {
      --bg-color: #121212;
      --card-bg: #1e1e1e;
      --border-color: #2d2d2d;
      --text-color: #f1f1f1;
      --text-sub: #a0a0a0;
      --input-bg: #252525;
      --primary-color: #6366f1;
      --primary-hover: #4f46e5;
    }

    body.light-mode {
      --bg-color: #f8f9fa;
      --card-bg: #ffffff;
      --border-color: #e9ecef;
      --text-color: #111111;
      --text-sub: #6c757d;
      --input-bg: #ffffff;
      --primary-color: #2563eb;
      --primary-hover: #1d4ed8;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 40px 20px;
      transition: background-color 0.3s, color 0.3s;
    }
    .container { max-width: 1000px; margin: 0 auto; }
    
    header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 30px; 
    }
    .header-title h1 { font-size: 2.2rem; font-weight: 800; margin: 0 0 6px 0; }
    .header-title p { color: var(--text-sub); margin: 0; font-size: 0.95rem; }

    .theme-toggle-btn {
      background: var(--card-bg);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: 0.2s;
    }

    .tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 25px; }
    .tab-btn {
      background: var(--card-bg); color: var(--text-sub); border: 1px solid var(--border-color);
      padding: 12px 24px; border-radius: 30px; cursor: pointer; font-weight: 600; transition: 0.2s;
    }
    .tab-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
    
    .workspace { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
    @media (max-width: 800px) { .workspace { grid-template-columns: 1fr; } }
    
    .content-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 25px; }
    .tab-panel { display: none; }
    .tab-panel.active { display: block; }
    
    label { display: block; margin-top: 15px; margin-bottom: 6px; color: var(--text-sub); font-size: 0.9rem; }
    input[type="text"], textarea, select {
      width: 100%; padding: 12px; border: 1px solid var(--border-color);
      border-radius: 8px; background: var(--input-bg); color: var(--text-color); box-sizing: border-box;
    }
    .submit-btn {
      width: 100%; background: var(--primary-color); color: white; border: none;
      padding: 14px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 15px;
    }
    .submit-btn:hover { background: var(--primary-hover); }
    
    .preview-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px; text-align: center; }
    .preview-card h3 { margin-top: 0; font-size: 1.1rem; }
    .preview-canvas-container { width: 270px; height: 480px; margin: 0 auto; border-radius: 16px; overflow: hidden; background: #000; }
    #previewCanvas { width: 100%; height: 100%; }
    
    .result-box { margin-top: 25px; padding: 20px; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 12px; display: none; text-align: center; }
    video { width: 270px; height: 480px; border-radius: 16px; object-fit: cover; margin: 15px 0; }
    .download-btn { background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-title">
        <h1>AI 숏폼 스튜디오</h1>
        <p>Gemini AI 기반 자동 자막 및 대본 생성기</p>
      </div>
      <button class="theme-toggle-btn" id="themeBtn" onclick="toggleTheme()">라이트 모드로 변경</button>
    </header>

    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('template', event)">기본 템플릿</button>
      <button class="tab-btn" onclick="switchTab('longform', event)">AI 문장 자동요약</button>
      <button class="tab-btn" onclick="switchTab('script', event)">AI 대본 자동 생성</button>
    </div>

    <div class="workspace">
      <div class="content-card">
        <!-- 1번 탭 -->
        <div id="panel-template" class="tab-panel active">
          <h2>템플릿 기반 숏폼</h2>
          <label>자막 텍스트</label>
          <input type="text" id="template-text" value="오늘 완성하는 나만의 AI 숏폼 영상" oninput="updateLivePreview()">
          <label>배경 그래픽 테마</label>
          <select id="template-theme" onchange="updateLivePreview()">
            <option value="purple">보라빛 네온</option>
            <option value="ocean">에메랄드 오션</option>
            <option value="sunset">석양 선셋</option>
            <option value="dark">다크 모던</option>
          </select>
          <button class="submit-btn" id="btn-template" onclick="generateShortForm('template')">영상 생성 (5초)</button>
        </div>

        <!-- 2번 탭 -->
        <div id="panel-longform" class="tab-panel">
          <h2>AI 긴글 숏폼요약</h2>
          <label>요약할 긴 글/뉴스/유튜브 대본 입력</label>
          <textarea id="longform-input" rows="4" placeholder="긴 글을 여기에 붙여넣고 아래 버튼을 누르면 AI가 요약합니다."></textarea>
          <button class="submit-btn" style="background: #10b981;" id="btn-ai-summary" onclick="askGeminiSummary()">AI 핵심 요약 실행</button>
          
          <label>AI 요약 결과 자막</label>
          <input type="text" id="longform-text" value="AI 요약 버튼을 누르면 여기에 결과가 나옵니다." oninput="updateLivePreview()">
          <button class="submit-btn" id="btn-longform" onclick="generateShortForm('longform')">하이라이트 영상 렌더링</button>
        </div>

        <!-- 3번 탭 -->
        <div id="panel-script" class="tab-panel">
          <h2>AI 주제별 대본 자동생성</h2>
          <label>만들고 싶은 영상 주제</label>
          <input type="text" id="script-topic" placeholder="예: 운동할 때 동기부여가 되는 명언">
          <button class="submit-btn" style="background: #8b5cf6;" id="btn-ai-script" onclick="askGeminiScript()">AI 대본 작성하기</button>

          <label>생성된 대본 (TTS 음성 읽기 연동)</label>
          <textarea id="script-text" rows="4" oninput="updateLivePreview()">주제를 입력하고 AI 버튼을 눌러보세요.</textarea>
          <button class="submit-btn" id="btn-script" onclick="generateShortForm('script')">대본 기반 영상+음성 생성</button>
        </div>

        <!-- 결과 창 -->
        <div id="result-box" class="result-box">
          <h3 style="color:#10b981;">숏폼 영상 제작 완료</h3>
          <p id="result-desc"></p>
          <div><video id="generatedVideo" controls autoplay loop></video></div>
          <a id="downloadBtn" class="download-btn" download="shortform.webm">WebM 파일 다운로드</a>
        </div>
      </div>

      <!-- 미리보기 -->
      <div class="preview-card">
        <h3>실시간 미리보기</h3>
        <div class="preview-canvas-container">
          <canvas id="previewCanvas" width="720" height="1280"></canvas>
        </div>
      </div>
    </div>
  </div>

  <script>
    let activeTab = 'template';

    window.onload = function() { updateLivePreview(); };

    function toggleTheme() {
      const body = document.body;
      const btn = document.getElementById('themeBtn');
      body.classList.toggle('light-mode');
      
      btn.innerText = body.classList.contains('light-mode') ? '다크 모드로 변경' : '라이트 모드로 변경';
    }

    function switchTab(tabName, evt) {
      activeTab = tabName;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('result-box').style.display = 'none';
      
      if(evt) evt.target.classList.add('active');
      document.getElementById('panel-' + tabName).classList.add('active');
      updateLivePreview();
    }

    async function callBackendGemini(promptText) {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'API 요청에 실패했습니다.');
      return data.text;
    }

    async function askGeminiSummary() {
      const text = document.getElementById('longform-input').value.trim();
      if (!text) return alert('요약할 글을 입력해주세요.');
      
      const btn = document.getElementById('btn-ai-summary');
      btn.disabled = true;
      btn.innerText = 'AI가 분석 중입니다...';

      try {
        const prompt = "다음 글을 숏폼 영상 자막용으로 20자 이내 임팩트 있는 한 문장으로 요약해줘: " + text;
        const result = await callBackendGemini(prompt);
        document.getElementById('longform-text').value = result.replace(/\\n/g, '').trim();
        updateLivePreview();
      } catch(e) {
        alert('AI 요약 요청 중 오류가 발생했습니다: ' + e.message);
      } finally {
        btn.disabled = false;
        btn.innerText = 'AI 핵심 요약 실행';
      }
    }

    async function askGeminiScript() {
      const topic = document.getElementById('script-topic').value.trim();
      if (!topic) return alert('주제를 입력해주세요.');

      const btn = document.getElementById('btn-ai-script');
      btn.disabled = true;
      btn.innerText = 'AI가 대본을 쓰는 중입니다...';

      try {
        const prompt = "숏폼 영상에 읽어줄 5초 분량의 짧고 강렬한 대본 2문장 작성해줘. 주제: " + topic;
        const result = await callBackendGemini(prompt);
        document.getElementById('script-text').value = result.replace(/\\n/g, ' ').trim();
        updateLivePreview();
      } catch(e) {
        alert('AI 대본 생성 요청 중 오류가 발생했습니다: ' + e.message);
      } finally {
        btn.disabled = false;
        btn.innerText = 'AI 대본 작성하기';
      }
    }

    function updateLivePreview(progress = 0) {
      var canvas = document.getElementById('previewCanvas');
      var ctx = canvas.getContext('2d');
      var text = '', theme = 'purple';

      if(activeTab === 'template') {
        text = document.getElementById('template-text').value;
        theme = document.getElementById('template-theme').value;
      } else if(activeTab === 'longform') {
        text = document.getElementById('longform-text').value;
        theme = 'ocean';
      } else if(activeTab === 'script') {
        text = document.getElementById('script-text').value;
        theme = 'sunset';
      }

      var grad = ctx.createLinearGradient(0, 0, 720, 1280);
      if(theme === 'purple') { grad.addColorStop(0, '#4f46e5'); grad.addColorStop(1, '#9333ea'); }
      else if(theme === 'ocean') { grad.addColorStop(0, '#0284c7'); grad.addColorStop(1, '#0d9488'); }
      else if(theme === 'sunset') { grad.addColorStop(0, '#ea580c'); grad.addColorStop(1, '#db2777'); }
      else { grad.addColorStop(0, '#18181b'); grad.addColorStop(1, '#27272a'); }
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 720, 1280);

      var circleY = 640 + Math.sin(progress * Math.PI * 4) * 40;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(360, circleY, 260, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(260, 200, 200, 48);

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AI SHORTFORM', 360, 232);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px sans-serif';

      var words = text.split(' ');
      var line = '', y = 580;
      for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        if (ctx.measureText(testLine).width > 600 && i > 0) {
          ctx.fillText(line, 360, y);
          line = words[i] + ' ';
          y += 55;
        } else { line = testLine; }
      }
      ctx.fillText(line, 360, y);

      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(60, 1150, 600, 10);
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(60, 1150, 600 * Math.min(progress, 1), 10);
    }

    function generateShortForm(type) {
      var btn = document.getElementById('btn-' + type);
      var resultBox = document.getElementById('result-box');
      var videoElement = document.getElementById('generatedVideo');
      var downloadBtn = document.getElementById('downloadBtn');
      
      var text = (type === 'template') ? document.getElementById('template-text').value :
                 (type === 'longform') ? document.getElementById('longform-text').value :
                 document.getElementById('script-text').value;

      if (!text.trim()) return alert('문구를 입력해 주세요.');

      btn.disabled = true;
      btn.innerText = '비디오 인코딩 중...';
      resultBox.style.display = 'none';

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        window.speechSynthesis.speak(utterance);
      }

      var canvas = document.getElementById('previewCanvas');
      var stream = canvas.captureStream(30);
      var mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      var chunks = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      
      mediaRecorder.onstop = function() {
        var blob = new Blob(chunks, { type: 'video/webm' });
        var videoURL = URL.createObjectURL(blob);
        videoElement.src = videoURL;
        downloadBtn.href = videoURL;

        resultBox.style.display = 'block';
        document.getElementById('result-desc').innerText = '5초 분량의 숏폼 비디오가 성공적으로 생성되었습니다.';
        btn.disabled = false;
        btn.innerText = '영상 생성 완료';
        updateLivePreview(0);
      };

      mediaRecorder.start();
      var startTime = Date.now(), duration = 5000;

      function animateFrame() {
        var progress = (Date.now() - startTime) / duration;
        updateLivePreview(progress);
        if (progress < 1) requestAnimationFrame(animateFrame);
        else mediaRecorder.stop();
      }
      animateFrame();
    }
  </script>
</body>
</html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
