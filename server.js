const express = require('express');
const app = express();

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

        h1 {
          font-size: 2.2rem;
          margin-bottom: 10px;
        }

        /* 카테고리 탭 */
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

        /* 작업 영역 카포 */
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

        /* 오른쪽 아래 다크모드 토글 툴 */
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
          display: flex;
          align-items: center;
          gap: 8px;
        }
      </style>
    </head>
    <body>

      <div class="container">
        <header>
          <h1>🎬 AI Short-Form Studio</h1>
          <p>원하는 카테고리를 선택하여 숏폼 영상을 제작해보세요.</p>
        </header>

        <!-- 카테고리 선택 탭 -->
        <div class="tabs">
          <button class="tab-btn active" onclick="switchTab('template')">🖼️ 템플릿 기반</button>
          <button class="tab-btn" onclick="switchTab('longform')">🔗 AI 롱폼 추출</button>
          <button class="tab-btn" onclick="switchTab('script')">✍️ 대본 기반 TTS</button>
        </div>

        <!-- 메인 작업 카드 -->
        <div class="content-card">
          <!-- 1. 템플릿 기반 -->
          <div id="panel-template" class="tab-panel active">
            <h2>템플릿 기반 숏폼 만들기</h2>
            <label>제목 및 자막 텍스트</label>
            <input type="text" placeholder="영상에 들어갈 메인 문구를 입력하세요">
            <label>배경 음악 선택</label>
            <input type="text" placeholder="음악 장르 (예: 트렌디, 신나는, 잔잔한)">
            <button class="submit-btn">템플릿 영상 생성하기</button>
          </div>

          <!-- 2. AI 롱폼 추출 -->
          <div id="panel-longform" class="tab-panel">
            <h2>YouTube / 롱폼 영상 하이라이트 추출</h2>
            <label>영상 URL 입력</label>
            <input type="text" placeholder="https://www.youtube.com/watch?v=...">
            <button class="submit-btn">AI 하이라이트 분석 시작</button>
          </div>

          <!-- 3. 대본 기반 -->
          <div id="panel-script" class="tab-panel">
            <h2>대본 기반 자동 영상 생성</h2>
            <label>대본 작성</label>
            <textarea rows="5" placeholder="숏폼으로 만들 전체 대본을 입력하세요..."></textarea>
            <button class="submit-btn">AI 음성 + 영상 생성하기</button>
          </div>
        </div>
      </div>

      <!-- 하단 고정 다크모드 툴 -->
      <div class="theme-toggle-container">
        <button class="theme-toggle-btn" onclick="toggleTheme()">
          <span id="theme-icon">🌙</span> <span id="theme-text">다크모드</span>
        </button>
      </div>

      <script>
        // 탭 전환 기능
        function switchTab(tabName) {
          document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
          
          event.target.classList.add('active');
          document.getElementById('panel-' + tabName).classList.add('active');
        }

        // 다크모드 토글 기능
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
      </script>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
