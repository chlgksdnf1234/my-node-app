const express = require('express');
const app = express();

app.use(express.json());

// 메인 웹 페이지
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
          max-width: 900px;
          margin: 0 auto;
        }

        header {
          text-align: center;
          margin-bottom: 40px;
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

        input[type="text"], textarea {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-color);
          color: var(--text-color);
          box-sizing: border-box;
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

        /* 결과 미리보기 영역 */
        .result-box {
          margin-top: 30px;
          padding: 20px;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          display: none;
          text-align: center;
        }

        .video-player {
          width: 100%;
          max-width: 320px;
          height: 560px;
          border-radius: 12px;
          background: #000;
          margin: 15px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
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

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>

      <div class="container">
        <header>
          <h1>🎬 AI Short-Form Studio</h1>
          <p>원하는 카테고리를 선택하여 숏폼 영상을 제작해보세요.</p>
        </header>

        <div class="tabs">
          <button class="tab-btn active" onclick="switchTab('template')">🖼️ 템플릿 기반</button>
          <button class="tab-btn" onclick="switchTab('longform')">🔗 AI 롱폼 추출</button>
          <button class="tab-btn" onclick="switchTab('script')">✍️ 대본 기반 TTS</button>
        </div>

        <div class="content-card">
          <!-- 1. 템플릿 기반 -->
          <div id="panel-template" class="tab-panel active">
            <h2>템플릿 기반 숏폼 만들기</h2>
            <label>제목 및 자막 텍스트</label>
            <input type="text" id="template-text" placeholder="영상에 들어갈 메인 문구를 입력하세요">
            <button class="submit-btn" id="btn-template" onclick="generateVideo('template')">템플릿 영상 생성하기</button>
          </div>

          <!-- 2. AI 롱폼 추출 -->
          <div id="panel-longform" class="tab-panel">
            <h2>YouTube / 롱폼 영상 하이라이트 추출</h2>
            <label>영상 URL 입력</label>
            <input type="text" id="longform-url" placeholder="https://www.youtube.com/watch?v=...">
            <button class="submit-btn" id="btn-longform" onclick="generateVideo('longform')">AI 하이라이트 분석 시작</button>
          </div>

          <!-- 3. 대본 기반 -->
          <div id="panel-script" class="tab-panel">
            <h2>대본 기반 자동 영상 생성</h2>
            <label>대본 작성</label>
            <textarea id="script-text" rows="5" placeholder="숏폼으로 만들 전체 대본을 입력하세요..."></textarea>
            <button class="submit-btn" id="btn-script" onclick="generateVideo('script')">AI 음성 + 영상 생성하기</button>
          </div>

          <!-- 결과 출력 창 -->
          <div id="result-box" class="result-box">
            <h3 id="result-title">🎉 영상 생성이 완료되었습니다!</h3>
            <p id="result-desc"></p>
            <div class="video-player" id="video-preview">
              📱 [숏폼 비디오 시뮬레이션 영역]
            </div>
            <button class="submit-btn" style="max-width: 200px; margin-top: 10px;" onclick="alert('다운로드가 시작됩니다.')">📥 영상 다운로드</button>
          </div>
        </div>
      </div>

      <div class="theme-toggle-container">
        <button class="theme-toggle-btn" onclick="toggleTheme()">
          <span id="theme-icon">🌙</span> <span id="theme-text">다크모드</span>
        </button>
      </div>

      <script>
        function switchTab(tabName) {
          document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
          document.getElementById('result-box').style.display = 'none';
          
          event.target.classList.add('active');
          document.getElementById('panel-' + tabName).classList.add('active');
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

        // 서버와 통신하는 생성 함수
        async function generateVideo(type) {
          const btn = document.getElementById('btn-' + type);
          const resultBox = document.getElementById('result-box');
          const resultDesc = document.getElementById('result-desc');
          
          let inputData = '';
          if(type === 'template') inputData = document.getElementById('template-text').value;
          if(type === 'longform') inputData = document.getElementById('longform-url').value;
          if(type === 'script') inputData = document.getElementById('script-text').value;

          if (!inputData.trim()) {
            alert('내용을 입력해주세요!');
            return;
          }

          // 버튼 로딩 상태 표시
          const originalText = btn.innerText;
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner"></span> AI 작업 진행 중...';
          resultBox.style.display = 'none';

          try {
            const response = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type, inputData })
            });

            const data = await response.json();

            if (data.success) {
              resultBox.style.display = 'block';
              resultDesc.innerText = data.message;
            }
          } catch (error) {
            alert('생성 도중 오류가 발생했습니다.');
          } finally {
            btn.disabled = false;
            btn.innerText = originalText;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// 백엔드 API (생성 요청 처리)
app.post('/api/generate', (req, res) => {
  const { type, inputData } = req.body;

  // 실제 API 및 영상 연동 전 모의 응답 처리 (2초 대기 시뮬레이션)
  setTimeout(() => {
    let message = '';
    if (type === 'template') {
      message = `입력하신 문구 "${inputData}"를 적용한 템플릿 숏폼이 완성되었습니다.`;
    } else if (type === 'longform') {
      message = `URL(${inputData})에서 핵심 하이라이트 3구간(각 15초)을 자동으로 추출했습니다.`;
    } else if (type === 'script') {
      message = `작성하신 대본을 바탕으로 AI 음성(TTS) 및 자막 생성이 완료되었습니다.`;
    }

    res.json({ success: true, message });
  }, 2000);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
