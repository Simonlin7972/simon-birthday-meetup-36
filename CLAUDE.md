# CLAUDE.md

## 專案概覽

Simon 的 36 歲生日 & 告別派對互動 app。純前端 React 19 + Vite 8 靜態應用，無後端、無資料庫。
派對日期：2026/6/26（五），場地 M310。

## 常用指令

```bash
npm run dev      # 開發伺服器 http://localhost:5173（host: true，可同網段手機測試）
npm run build    # 打包到 dist/
npm run preview  # 預覽打包結果
```

## 架構

- 單頁應用，畫面流程：`Splash` → `Gate`（PIN 驗證）→ 主畫面（四個分頁）
- 狀態管理：全用 React useState，無外部狀態庫
- 路由：無 router，用 `tab` state 切換分頁
- 樣式：單一 `src/styles/global.css`，CSS 變數定義在 `:root`，無 CSS-in-JS / CSS Modules
- 字型：Archivo Black（英文 display）+ ChironGoRoundTC（中文圓體），由 index.html 載入
- 無測試框架、無 linter 設定

## 關鍵檔案

- `src/data/payload.js` — **所有內容的唯一資料來源**：派對設定 (`config`) 和來賓陣列 (`people`)。修改內容只改這個檔案。
- `src/styles/global.css` — 全站樣式，`:root` CSS 變數定義了整套色彩系統
- `docs/BRAND.md` — 視覺品牌指南，修改 UI 前務必先讀

## 品牌風格重點

- **暖色牛皮紙風格**：沙色背景 `--bg`、棕色文字 `--ink`、橘色點睛 `--gold`
- **CSS 變數命名有歷史包袱**：`--gold` 實為橘色、`--serif` 實為 Archivo Black（display 字體）、`--ink` 是棕色不是黑色
- **立體 3D 按鈕**（Duolingo 風）：edge 側壁 + front 正面，按下有壓入感
- **貼紙感卡片**：硬 offset 投影（不帶 blur）+ 大圓角 18-22px
- **頭像**：圓形，近黑描邊環 `--ink-line`
- 全站 `prefers-reduced-motion:reduce` 會關閉所有動畫

## 來賓頭像機制

`payload.js` 底部用 `import.meta.glob` 自動掃描 `src/asset/guest/` 下的圖片，以檔名（不含副檔名）比對來賓 `name`，自動填入 `photo`。新增來賓照片只需放對檔名。

## 注意事項

- PIN 驗證是純前端，所有資料都打包在 bundle 裡，不要放敏感內容
- 這是手機優先的設計，修改 UI 時以直式手機畫面為主
- 元件沒有 prop types 或 TypeScript，保持一致即可
- 不需要加測試、linter、或額外工具鏈，保持輕量
