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
      box-shadow: 0 4px 12px rgba(0,0,0,0.
