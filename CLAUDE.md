# CLAUDE.md

## 專案概覽

Simon 的 36 歲生日 & 告別派對互動 app。純前端 React 19 + Vite 8 靜態應用，無後端、無資料庫、無路由器。
派對日期：2026/6/26（五），場地 M310。手機優先、直式畫面設計。

## 常用指令

```bash
npm run dev      # 開發伺服器 http://localhost:5173（host: true，可同網段手機測試）
npm run build    # 打包到 dist/
npm run preview  # 預覽打包結果
```

## 架構

- 單頁應用，畫面流程：`Splash`（歡迎）→ `Gate`（PIN 驗證）→ 主畫面
- 主畫面有 **5 個分頁**，由 `App.jsx` 的 `tab` state 切換（無 router）：
  - `profile` 我的卡片 — `Profile.jsx`
  - `guests` 朋友們 — `Guests.jsx`（3 排橫向滾動卡片牆）
  - `message` 給你的話 — `Message.jsx`（需解鎖的「悄悄話」）
  - `wall` 留言牆 — `Wall.jsx`
  - `bingo` 賓果 — `Bingo.jsx`（互動賓果遊戲）
- 狀態管理：全用 React useState，無外部狀態庫；App.jsx 為唯一狀態中樞
- 樣式：單一 `src/styles/global.css`，CSS 變數定義在 `:root`，無 CSS-in-JS / CSS Modules
- 字型（index.html 載入）：Archivo Black（英文 display）、Orbitron（數字/科技感）、LXGW WenKai TC + ChironGoRoundTC（中文圓體）
- 無測試框架、無 linter 設定

## 關鍵檔案

- `src/data/payload.js` — **所有內容的唯一資料來源**：派對設定 (`config`) 和來賓陣列 (`people`，約 37 位)。修改內容只改這個檔案。檔案開頭註解列出每位來賓的所有欄位。
- `src/App.jsx` — 狀態中樞：登入、分頁、sheet、賓果重置、轉場
- `src/styles/global.css` — 全站樣式，`:root` CSS 變數定義了整套色彩系統
- `src/components/Card.jsx` — 共用卡片容器，各頁用額外 className 疊加各自排版
- `docs/BRAND.md` — 視覺品牌指南，修改 UI 前務必先讀

## 品牌風格重點

- **暖色牛皮紙風格**：沙色背景 `--bg`、棕色文字 `--ink`、橘色點睛 `--gold`
- **CSS 變數命名有歷史包袱**：`--gold` 實為橘色、`--serif` 實為 Archivo Black（display 字體）、`--ink` 是棕色不是黑色
- **立體 3D 按鈕**（Duolingo 風）：edge 側壁 + front 正面，按下有壓入感
- **貼紙感卡片**：硬 offset 投影（不帶 blur）+ 大圓角 18-22px
- **頭像**：圓形，近黑描邊環 `--ink-line`
- 全站 `prefers-reduced-motion:reduce` 會關閉所有動畫

## 互動機制

- **共享元素轉場**：點開來賓卡片時用 View Transitions API 讓小卡 morph 成 `GuestSheet`（`App.jsx` 的 `animateSheet`）。不支援或減少動態時降級為 CSS 滑上動畫。
- **音效**：`src/hooks/useSfx.js` 用 Web Audio API 即時合成所有音效（木頭敲擊、pop 等），零外部音檔。
- **賓果遊戲**（`Bingo.jsx`）：3×3 任務格，進度存在 `localStorage`（key `bingo_<guestId>`）。遊戲進行中隱藏 TabBar（全螢幕）。隱藏重置：在賓果頁連點三下 tab 鈕清除進度。
- **悄悄話解鎖**（`Message.jsx`）：「給你的話」需先解鎖才顯示，解鎖後進入全螢幕、隱藏 TabBar（透過 `onUnlockedChange` 回報 App）。

## 來賓頭像機制

`payload.js` 底部用 `import.meta.glob` 自動掃描 `src/asset/guest/` 下的圖片，以檔名（不含副檔名）比對來賓 `name`，自動填入 `photo`。新增來賓照片只需放對檔名（支援 jpg/jpeg/png/JPG）。`Avatar.jsx`：有照片用照片，否則依名字產生漸層頭像。

## 注意事項

- PIN 驗證是純前端，所有資料都打包在 bundle 裡，不要放敏感內容
- 這是手機優先的設計，修改 UI 時以直式手機畫面為主
- 元件沒有 prop types 或 TypeScript，保持一致即可
- 不需要加測試、linter、或額外工具鏈，保持輕量
