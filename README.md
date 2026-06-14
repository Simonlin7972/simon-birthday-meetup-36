# Simon's Party 🎉

Simon 的 36 歲生日 & 告別派對 — 給來賓的專屬互動小 app。

每位來賓用自己的 4 位數 PIN 入場，進入後可以看到：

- **我的卡** — 自己填寫的自我介紹與對 Simon 的觀察
- **來賓** — 今晚所有到場朋友的卡片牆，點開看更多
- **給你的話** — Simon 寫給你的一句話
- **留言牆** — 大家想對 Simon 說的話

以 **React + Vite** 打造，為手機直式畫面設計。

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
├── index.html              # Vite 進入點
├── vite.config.js          # Vite 設定
├── package.json
└── src/
    ├── main.jsx            # React 掛載點
    ├── App.jsx             # 主畫面：入場驗證 + 分頁切換
    ├── data/
    │   └── payload.js      # 派對設定與來賓資料（要改內容改這裡）
    ├── components/
    │   ├── Gate.jsx        # PIN 入場畫面
    │   ├── TabBar.jsx      # 底部導覽列
    │   ├── Profile.jsx     # 我的卡
    │   ├── Guests.jsx      # 來賓卡片牆
    │   ├── Message.jsx     # 給你的話
    │   ├── Wall.jsx        # 留言牆
    │   ├── GuestSheet.jsx  # 來賓詳細彈出 sheet
    │   ├── Avatar.jsx      # 依名字產生漸層頭像
    │   └── Field.jsx       # 標籤 + 內容欄位
    └── styles/
        └── global.css      # 全站樣式
```

## 怎麼修改內容

所有文字、來賓、PIN 都集中在 [`src/data/payload.js`](src/data/payload.js)。

- 改派對標題／時間：編輯 `config`
- 新增／修改來賓：編輯 `people` 陣列，每位來賓的欄位說明見檔案開頭註解
- 幫某位來賓加上 Simon 的話：填入該來賓的 `fromSimon`
- 想用真實照片當頭像：在該來賓加上 `photo: '圖片網址'`

> ⚠️ PIN 是純前端驗證，只用來區分來賓、不是真正的安全機制；所有資料都打包在前端，請勿放入敏感內容。

## 部署

打包後的 `dist/` 是純靜態檔案，可直接丟到任何靜態主機（Vercel、Netlify、GitHub Pages 等）。

```bash
npm run build
```
