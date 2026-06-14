# Simon's Party

Simon 的 36 歲生日 & 告別派對 — 給來賓的專屬互動小 app。

以 **React 19 + Vite 8** 打造，純前端靜態應用，為手機直式畫面設計。暖色牛皮紙視覺風格，Duolingo 風 3D 立體按鈕，貼紙感卡片。

## 流程

1. **Splash** — 歡迎畫面，角色從下方升起 + 打字機效果
2. **Gate** — 輸入 4 位數 PIN 入場，每位來賓有專屬 PIN
3. **主畫面** — 四個分頁：
   - **我的卡片** — 自己填寫的自我介紹與對 Simon 的觀察
   - **今晚の朋友** — 所有到場朋友的卡片牆（兩排橫向滾動），點開看更多
   - **給你的話** — Simon 寫給你的一句話
   - **留言牆** — 大家想對 Simon 說的話

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
├── index.html              # Vite 進入點（載入 Archivo Black + ChironGoRoundTC 字型）
├── vite.config.js          # Vite 設定（啟用 host: true 供手機測試）
├── package.json
├── docs/
│   └── BRAND.md            # 視覺品牌指南（色彩、字體、元件風格）
└── src/
    ├── main.jsx            # React 掛載點
    ├── App.jsx             # 主畫面：Splash → Gate → 分頁切換
    ├── data/
    │   └── payload.js      # 派對設定與來賓資料（要改內容改這裡）
    ├── asset/
    │   ├── simon_char.png  # Splash 角色插畫
    │   ├── logo_m310.png   # M310 場地 logo（旋轉動畫）
    │   └── guest/          # 來賓頭像照片（檔名 = 來賓 name）
    ├── components/
    │   ├── Splash.jsx      # 啟動歡迎畫面
    │   ├── Gate.jsx        # PIN 入場畫面
    │   ├── TabBar.jsx      # 底部四個漂浮立體 tab 按鈕
    │   ├── Profile.jsx     # 我的卡片
    │   ├── Guests.jsx      # 來賓卡片牆（兩排橫向滾動）
    │   ├── Message.jsx     # 給你的話
    │   ├── Wall.jsx        # 留言牆
    │   ├── GuestSheet.jsx  # 來賓詳細彈出 sheet
    │   ├── Avatar.jsx      # 頭像：有照片用照片，否則依名字產生漸層
    │   └── Field.jsx       # 標籤 + 內容欄位
    ├── hooks/
    │   └── useTypewriter.js # 打字機效果 hook
    └── styles/
        └── global.css      # 全站樣式（CSS 變數定義在 :root）
```

## 怎麼修改內容

所有文字、來賓、PIN 都集中在 [`src/data/payload.js`](src/data/payload.js)。

- 改派對標題／時間：編輯 `config`
- 新增／修改來賓：編輯 `people` 陣列，每位來賓的欄位說明見檔案開頭註解
- 幫某位來賓加上 Simon 的話：填入該來賓的 `fromSimon`
- 來賓頭像：把照片放到 `src/asset/guest/`，檔名和來賓 `name` 完全一致即可自動配對

> PIN 是純前端驗證，只用來區分來賓、不是真正的安全機制；所有資料都打包在前端，請勿放入敏感內容。

## 部署

打包後的 `dist/` 是純靜態檔案，可直接丟到任何靜態主機（Vercel、Netlify、GitHub Pages 等）。

```bash
npm run build
```
