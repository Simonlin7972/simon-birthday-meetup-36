# Simon's Party

Simon 的 36 歲生日 & 告別派對 — 給來賓的專屬互動小 app。

以 **React 19 + Vite 8** 打造，純前端靜態應用，為手機直式畫面設計。暖色牛皮紙視覺風格，Duolingo 風 3D 立體按鈕，貼紙感卡片，搭配 View Transitions 共享元素轉場與 Web Audio 即時合成音效。

派對日期：2026/6/26（五）· 場地 M310。

## 流程

1. **Splash** — 歡迎畫面，角色從下方升起 + 打字機效果
2. **Gate** — 輸入 4 位數 PIN 入場，每位來賓有專屬 PIN
3. **主畫面** — 五個分頁：
   - **我的卡片** — 自己填寫的自我介紹與對 Simon 的觀察
   - **朋友們** — 所有到場朋友的卡片牆（三排橫向滾動），點開看更多（小卡 morph 成詳細 sheet）
   - **給你的話** — Simon 寫給你的悄悄話，需先解鎖才顯示
   - **留言牆** — 大家想對 Simon 說的話
   - **賓果** — 現場互動賓果遊戲（3×3 任務格，連線達成有慶祝動畫，進度自動保存）

## 開發

```bash
npm install      # 安裝相依套件
npm run dev      # 啟動開發伺服器（預設 http://localhost:5173）
npm run build    # 打包到 dist/
npm run preview  # 預覽打包後的結果
```

## 專案結構

```
.
├── index.html              # Vite 進入點（載入 Archivo Black / Orbitron / 中文圓體字型、OG / icon meta）
├── vite.config.js          # Vite 設定（啟用 host: true 供手機測試）
├── package.json
├── docs/
│   └── BRAND.md            # 視覺品牌指南（色彩、字體、元件風格）
└── src/
    ├── main.jsx            # React 掛載點
    ├── App.jsx             # 狀態中樞：Splash → Gate → 分頁切換、sheet 轉場、賓果重置
    ├── data/
    │   └── payload.js      # 派對設定與來賓資料（要改內容改這裡）
    ├── asset/
    │   ├── simon_char.png          # Splash 角色插畫
    │   ├── logo_m310.png           # M310 場地 logo（旋轉動畫）
    │   ├── illustration_bingo.png  # 賓果頁插畫
    │   ├── illustration_message.png# 悄悄話解鎖插畫
    │   ├── favicon / apple-touch / og-image
    │   └── guest/                  # 來賓頭像照片（檔名 = 來賓 name）
    ├── components/
    │   ├── Splash.jsx      # 啟動歡迎畫面
    │   ├── Gate.jsx        # PIN 入場畫面
    │   ├── TabBar.jsx      # 底部五個漂浮立體 tab 按鈕（Phosphor duotone icon）
    │   ├── Card.jsx        # 共用卡片容器
    │   ├── Profile.jsx     # 我的卡片
    │   ├── Guests.jsx      # 來賓卡片牆（三排橫向滾動）
    │   ├── Message.jsx     # 給你的話（需解鎖的悄悄話）
    │   ├── Wall.jsx        # 留言牆
    │   ├── Bingo.jsx       # 互動賓果遊戲（localStorage 保存進度）
    │   ├── GuestSheet.jsx  # 來賓詳細彈出 sheet（與小卡 morph 配對）
    │   ├── Avatar.jsx      # 頭像：有照片用照片，否則依名字產生漸層
    │   └── Field.jsx       # 標籤 + 內容欄位
    ├── hooks/
    │   ├── useTypewriter.js # 打字機效果 hook
    │   └── useSfx.js        # Web Audio 即時合成音效（零外部音檔）
    └── styles/
        └── global.css      # 全站樣式（CSS 變數定義在 :root）
```

## 怎麼修改內容

所有文字、來賓、PIN 都集中在 [`src/data/payload.js`](src/data/payload.js)。

- 改派對標題：編輯 `config`
- 新增／修改來賓：編輯 `people` 陣列，每位來賓的欄位說明見檔案開頭註解
- 幫某位來賓加上 Simon 的話：填入該來賓的 `fromSimon`
- 來賓頭像：把照片放到 `src/asset/guest/`，檔名和來賓 `name` 完全一致即可自動配對（`import.meta.glob` 掃描）

> PIN 是純前端驗證，只用來區分來賓、不是真正的安全機制；所有資料都打包在前端，請勿放入敏感內容。

## 互動亮點

- **共享元素轉場**：點來賓小卡時用 View Transitions API morph 成詳細 sheet，不支援的瀏覽器自動降級
- **即時合成音效**：`useSfx` 以 Web Audio API 合成所有音效，無需音檔
- **賓果遊戲**：進度存 `localStorage`；遊戲與悄悄話解鎖時進全螢幕、隱藏底部導覽列
- 全站尊重 `prefers-reduced-motion`，會關閉動畫

## 部署

打包後的 `dist/` 是純靜態檔案，可直接丟到任何靜態主機（Vercel、Netlify、GitHub Pages 等）。

```bash
npm run build
```
