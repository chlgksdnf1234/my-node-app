const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI 숏폼 스튜디오</title>
      <style>
        :root {
          --bg-color: #ffffff;
          --text-color: #111111;
          --card-bg: #f8f9fa;
          --border-color: #e9ecef;
          --primary-color: #2563eb;
        }

        [data-theme="dark"] {
          --bg-color: #121212;
          --text-color: #f1f1f1;
          --card-bg: #1e1e1e;
          --border-color: #333333;
          --primary-color: #3b82f6;
        }

        body {
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin: 0;
          padding: 40px 20px;
          transition: background-color 0.3s, color 0.3s;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        header {
          text-align: center;
          margin-bottom: 40px;
        }

        /* 메인 제목 크기 확대 및 스타일 */
        h1 {
          font-size: 3.2rem;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .tabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .tab-btn {
          background: var(--card-bg);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          padding: 12px 24px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        /* 2열 레이아웃 (좌: 입력폼, 우: 실시간 미리보기) */
        .workspace {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 800px) {
          .workspace {
            grid-template-columns: 1fr;
          }
        }

        .content-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .tab-panel {
          display: none;
        }

        .tab-panel.active {
          display: block;
        }

        input[type="text"], textarea, select {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-color);
          color: var(--text-color);
          box-sizing: border-box;
          font-size: 0.95rem;
        }

        .submit-btn {
          width: 100%;
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
        }

        .submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        /* 실시간 미리보기 영 패널 */
        .preview-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .preview-card h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .preview-canvas-container {
          width: 270px;
          height: 480px;
          margin: 0 auto;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          background: #000;
        }

        #previewCanvas {
          width: 100%;
          height: 100%;
        }

        /* 생성 완료 결과 영역 */
        .result-box {
          margin-top: 30px;
          padding: 20px;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          display: none;
          text-align: center;
        }

        video {
          width: 270px;
          height: 480px;
          border-radius: 16px;
          object-fit: cover;
          margin: 15px 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .theme-toggle-container {
          position: fixed;
          bottom: 25px;
          right: 25px;
        }

        .theme-toggle-btn {
          background: var(--card-bg);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          padding: 12px 18px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .download-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
          display: inline-block;
          text-decoration: none;
        }

        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>

      <div class="container">
        <header>
          <h1>AI 숏폼 스튜디오</h1>
          <p>원하는 카테고리를 선택하여 실시간 미리보기로 숏폼 영상을 제작해보세요.</p>
        </header>

        <div class="tabs">
          <button class="tab-btn active" onclick="switchTab('template')">🖼️ 템플릿 기반</button>
          <button class="tab-btn" onclick="switchTab('longform')">🔗 AI 롱폼 추출</button>
          <button class="tab-btn" onclick="switchTab('script')">✍️ 대본 기반 TTS</button>
        </div>

        <div class="workspace">
          <!-- 좌측: 작업 입력폼 -->
          <div class="content-card">
            <!-- 1. 템플릿 기반 -->
            <div id="panel-template" class="tab-panel active">
              <h2>템플릿 기반 숏폼 만들기</h2>
              <label>제목 및 자막 텍스트</label>
              <input type="text" id="template-text" value="오늘 완성하는 나만의 AI 숏폼 영상" oninput="updateLivePreview()">
              <label>배경 그래픽 테마</label>
              <select id="template-theme" onchange="updateLivePreview()">
                <option value="purple">보라빛 네온 그라데이션</option>
                <option value="ocean">시원한 에메랄드 오션</option>
                <option value="sunset">따뜻한 석양 선셋</option>
                <option value="dark">시크한 다크 모던</option>
              </select>
              <button class="submit-btn" id="btn-template" onclick="generateShortForm('template')">영상 생성하기 (5초)</button>
            </div>

            <!-- 2. AI 롱폼 추출 -->
            <div id="panel-longform" class="tab-panel">
              <h2>YouTube / 롱폼 영상 하이라이트 추출</h2>
              <label>영상 URL 입력</label>
              <input type="text" id="longform-url" placeholder="https://www.youtube.com/watch?v=...">
              <label>추출할 하이라이트 자막 메세지</label>
              <input type="text" id="longform-text" value="롱폼 핵심 요약: 꼭 기억해야 할 법칙" oninput="updateLivePreview()">
              <button class="submit-btn" id="btn-longform" onclick="generateShortForm('longform')">하이라이트 숏폼 렌더링</button>
            </div>

            <!-- 3. 대본 기반 -->
            <div id="panel-script" class="tab-panel">
              <h2>대본 기반 자동 영상 생성</h2>
              <label>대본 작성 (TTS 음성 읽기 연동)</label>
              <textarea id="script-text" rows="4" oninput="updateLivePreview()">안녕하세요! AI가 자동으로 만들어준 숏폼 영상입니다.</textarea>
              <button class="submit-btn" id="btn-script" onclick="generateShortForm('script')">대본 기반 영상+음성 생성</button>
            </div>

            <!-- 결과 출력 창 -->
            <div id="result-box" class="result-box">
              <h3 id="result-title">영상 생성이 완료되었습니다!</h3>
              <p id="result-desc"></p>

              <div>
                <video id="generatedVideo" controls autoplay loop></video>
              </div>

              <a id="downloadBtn" class="download-btn" download="shortform.webm">📥 영상 파일 다운로드 (.webm)</a>
            </div>
          </div>

          <!-- 우측: 실시간 미리보기 Canvas -->
          <div class="preview-card">
            <h3>👁️ 실시간 미리보기</h3>
            <div class="preview-canvas-container">
              <canvas id="previewCanvas" width="720" height="1280"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="theme-toggle-container">
        <button class="theme-toggle-btn" onclick="toggleTheme()">
          <span id="theme-icon">🌙</span> <span id="theme-text">다크모드</span>
        </button>
      </div>

      <script>
        let activeTab = 'template';
        let animationFrameId = null;

        window.onload = () => {
          updateLivePreview();
        };

        function switchTab(tabName) {
          activeTab = tabName;
          document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
          document.getElementById('result-box').style.display = 'none';
          
          event.target.classList.add('active');
          document.getElementById('panel-' + tabName).classList.add('active');

          updateLivePreview();
        }

        function toggleTheme() {
          const body = document.body;
          const currentTheme = body.getAttribute('data-theme');
          const themeIcon = document.getElementById('theme-icon');
          const themeText = document.getElementById('theme-text');

          if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            themeIcon.innerText = '🌙';
            themeText.innerText = '다크모드';
          } else {
            body.setAttribute('data-theme', 'dark');
            themeIcon.innerText = '☀️';
            themeText.innerText = '라이트모드';
          }
        }

        // 실시간 미리보기 렌더링 함수
        function updateLivePreview(progress = 0) {
          const canvas = document.getElementById('previewCanvas');
          const ctx = canvas.getContext('2d');

          let text = '';
          let theme = 'purple';

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

          // 배경 그라데이션
          let grad;
          if(theme === 'purple') {
            grad = ctx.createLinearGradient(0, 0, 720, 1280);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(1, '#a855f7');
          } else if(theme === 'ocean') {
            grad = ctx.createLinearGradient(0, 0, 720, 1280);
            grad.addColorStop(0, '#06b6d4');
            grad.addColorStop(1, '#3b82f6');
          } else if(theme === 'sunset') {
            grad = ctx.createLinearGradient(0, 0, 720, 1280);
            grad.addColorStop(0, '#f97316');
            grad.addColorStop(1, '#ec4899');
          } else {
            grad = ctx.createLinearGradient(0, 0, 720, 1280);
            grad.addColorStop(0, '#111827');
            grad.addColorStop(1, '#374151');
          }
          
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 720, 1280);

          // 모션 애니메이션 백그라운드
          const circleY = 640 + Math.sin(progress * Math.PI * 4) * 50;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.arc(360, circleY, 280, 0, Math.PI * 2);
          ctx.fill();

          // 상단 뱃지
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(260, 200, 200, 50, 25);
          ctx.fill();

          ctx.fillStyle = '#111111';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('SHORT FORM', 360, 233);

          // 자막 텍스트
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 44px sans-serif';
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 12;

          const words = text.split(' ');
          let line = '';
          let y = 580;

          for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            let metrics = ctx.measureText(testLine);
            if (metrics.width > 600 && i > 0) {
              ctx.fillText(line, 360, y);
              line = words[i] + ' ';
              y += 60;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, 360, y);
          ctx.shadowBlur = 0;

          // 프로그레스 바
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fillRect(60, 1150, 600, 12);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(60, 1150, 600 * Math.min(progress, 1), 12);
        }

        // 실제 숏폼 녹화 인코딩 실행
        async function generateShortForm(type) {
          const btn = document.getElementById('btn-' + type);
          const resultBox = document.getElementById('result-box');
          const resultDesc = document.getElementById('result-desc');
          const videoElement = document.getElementById('generatedVideo');
          const downloadBtn = document.getElementById('downloadBtn');
          
          let text = '';
          if(type === 'template') text = document.getElementById('template-text').value;
          if(type === 'longform') text = document.getElementById('longform-text').value;
          if(type === 'script') text = document.getElementById('script-text').value;

          if (!text.trim()) {
            alert('문구를 입력해 주세요!');
            return;
          }

          btn.disabled = true;
          btn.innerHTML = '<span class="spinner"></span> 영상 인코딩 중 (5초)...';
          resultBox.style.display = 'none';

          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            window.speechSynthesis.speak(utterance);
          }

          const canvas = document.getElementById('previewCanvas');
          const stream = canvas.captureStream(30);
          
          let mediaRecorder;
          try {
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
          } catch(e) {
            mediaRecorder = new MediaRecorder(stream);
          }

          const chunks = [];
          mediaRecorder.ondataavailable = e => chunks.push(e.data);
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const videoURL = URL.createObjectURL(blob);
            videoElement.src = videoURL;
            downloadBtn.href = videoURL;

            resultBox.style.display = 'block';
            resultDesc.innerText = `총 5초 분량의 숏폼 영상 인코딩이 완료되었습니다.`;
            btn.disabled = false;
            btn.innerText = '영상 생성하기 (5초)';
            updateLivePreview(0);
          };

          mediaRecorder.start();

          const startTime = Date.now();
          const duration = 5000;

          function animateFrame() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            updateLivePreview(progress);

            if (elapsed < duration) {
              requestAnimationFrame(animateFrame);
            } else {
              mediaRecorder.stop();
            }
          }

          animateFrame();
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
