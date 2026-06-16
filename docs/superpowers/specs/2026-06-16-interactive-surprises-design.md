# Interactive Surprises & Atmosphere Design

> Simon 36 歲生日 & 告別派對 app — 互動驚喜、即時投票、氣氛營造

**Date:** 2026-06-16
**Status:** Draft
**Party date:** 2026/6/26 19:30, M310

---

## Overview

在現有 5 tab 架構上，增加三層體驗：

1. **彩蛋系統** — 小彩蛋散佈各處 + 1 個深藏大彩蛋，獎勵探索行為
2. **即時投票** — Supabase Realtime 驅動，派對現場趣味互動
3. **氣氛營造** — 視覺特效 + 音效分層，強化派對感

純前端維持不變，僅投票功能引入 Supabase（BaaS，不寫 server code）。

---

## 1. 小彩蛋（4 個）

### 1.1 雙擊頭像彈跳

- **觸發：** 任何頁面的 `<Avatar>` 元件，雙擊（`onDoubleClick`）
- **效果：** 頭像彈跳 + 旋轉動畫，從頭像位置噴出小型 confetti，配 `usePop` 音效
- **重複性：** 每次雙擊都可觸發，純趣味
- **實作：** CSS `@keyframes` bounce + rotate，confetti 用 canvas 或 DOM 粒子

### 1.2 秘密 PIN `0626`

- **觸發：** Gate 頁輸入 PIN `0626`（生日日期）
- **效果：** 進入「上帝視角」— 可瀏覽所有賓客卡片，但不以任何人身份登入
- **Profile tab：** 顯示「訪客模式」提示，無個人資料
- **限制：** 訪客模式不能使用投票功能
- **實作：** Gate 特殊判斷，`me` 設為特殊 visitor 物件（非 null 但無 `id`）

### 1.3 留言牆翻轉卡片

- **觸發：** 留言牆最後一張卡片，點三下（triple click / triple tap）
- **效果：** 3D 翻轉動畫（`rotateY(180deg)`），背面顯示彩蛋內容
- **內容：** Simon 的搞笑自嘲或派對冷知識（寫在 `payload.js` → `config.wallEasterEgg`）
- **重複性：** 一次性驚喜，翻了就保持翻開狀態（localStorage 記錄）
- **首次觸發：** 播放「✨ 發現！」全局動畫

### 1.4 派對當天模式

- **觸發：** 系統時間 ≥ 2026/6/26 19:30（Asia/Taipei）
- **Splash 變化：** 標題改為「派對進行中」，倒數計時隱藏
- **背景粒子：** 小光點緩慢飄動（CSS animation 或 lightweight canvas）
- **TabBar 脈動：** 圖示加微小 pulse 動畫（CSS `animation: pulse 2s infinite`）
- **實作：** `Date.now()` 比對，條件渲染不同 Splash 狀態

---

## 2. 大彩蛋 — 時光膠囊

### 觸發

- **位置：** Profile tab
- **手勢：** 往下拉超過內容底部（overscroll pull-down）
- **提示：** 拉到一定距離後出現信封 hint 圖示（半透明，從底部浮現）
- **觸發：** 放手後信封動畫啟動

### 展開動畫

1. 信封從底部升起至畫面中央
2. 開封動畫（信封蓋掀開）
3. 信紙抽出 → 展開成全螢幕信件頁面
4. 背景轉場：暗色調 + 浮動光點粒子（螢火蟲效果）
5. 背景音樂淡入（感性鋼琴或吉他，15-20 秒 loop）

### 內容

- Simon 寫給所有朋友的一封長信
- 打字機效果逐字顯現（復用 `useTypewriter` hook）
- 可點擊任意處跳過 → 直接顯示全文
- 資料來源：`payload.js` → `config.timeCapsule`（字串）

### 離開

- 讀完後底部出現「收好這封信」3D 按鈕
- 點擊 → 信折回信封 → 信封沉入底部 → 回到 Profile
- 可再次 overscroll 重新打開（非一次性）

### 狀態

- 首次發現：觸發「✨ 發現！」全局動畫 + 音效
- `localStorage` 記錄 `timeCapsuleDiscovered: true`
- 之後再開不重播「發現」動畫，直接進入信件

### 音效

- 信封出現：紙張沙沙聲
- 開封：撕開聲
- 背景音樂：淡入 loop，可靜音
- 離開：輕柔關閉聲

---

## 3. 即時投票

### 架構

- **後端：** Supabase（BaaS）
- **即時推送：** Supabase Realtime subscriptions
- **UI：** 新增第 6 個 tab「投票」，常駐顯示（不隱藏，讓賓客派對前也能看到題目預熱）

### 資料模型

```
Table: questions
- id: uuid (PK)
- text: text          -- 題目文字（例：「最有可能遲到的人？」）
- options: jsonb       -- 選項陣列 ["選項A", "選項B", ...]
- active: boolean      -- 目前是否開放投票
- order: integer       -- 排序
- created_at: timestamptz

Table: votes
- id: uuid (PK)
- question_id: uuid (FK → questions)
- guest_id: text       -- 對應 payload.js 的 people[].id
- choice: integer      -- 選了第幾個選項（index）
- created_at: timestamptz
- UNIQUE(question_id, guest_id)  -- 每人每題一票
```

### 流程

1. 預設 3-5 題直接 insert 到 Supabase `questions` table（部署前手動或用 seed script），不從 payload.js 動態 seed
2. 賓客進入投票 tab → 顯示目前 active 的題目
3. 點選選項 → insert vote → Supabase Realtime 推送更新
4. 即時顯示長條圖結果（animated bar chart）
5. 可選：主持人切換「結果展示模式」全螢幕長條圖

### 題目管理

- 預設題目：`payload.js` → `config.pollQuestions`
- 現場加題：Simon 透過 Supabase Dashboard 直接 insert，或做一個簡易管理 UI（scope 可選）

### 限制

- 每人每題一票（DB unique constraint）
- 訪客模式（PIN `0626`）不能投票
- 投票後不可更改

### 視覺

- 投票按鈕：沿用 3D Duolingo 風格
- 長條圖：CSS transition 動畫增長
- 最高票揭曉：confetti + 鼓聲音效
- 投票完成：選項顯示 ✓ + 灰化其他選項

---

## 4. 氣氛營造

### 4.1 全局發現動畫「✨ 發現！」

- **觸發：** 首次觸發任何彩蛋時
- **效果：** 光暈從觸發點擴散 → 金色粒子四散 → 1 秒後淡出
- **音效：** 清脆魔法鈴聲（短，~0.5 秒）
- **實作：** 共用 React 元件 `<DiscoveryBurst />`，接收觸發座標，render portal 到 body
- **記錄：** localStorage 記錄各彩蛋已發現狀態

### 4.2 Tab 切換微動畫

- **效果：** 切 tab 時內容 fade + slide-up（`opacity 0→1`, `translateY(8px→0)`，~150ms）
- **不動：** 不改現有 View Transitions / GuestSheet morph
- **實作：** CSS transition on tab content wrapper，用 `key={tab}` 觸發

### 4.3 頭像互動回饋

- **觸發：** 單擊頭像時
- **效果：** 輕微縮放 bounce（`scale(0.92)` → `scale(1.05)` → `scale(1)`，~200ms）
- **音效：** 搭配現有 `usePop`

### 4.4 背景環境音

- **何時：** 進入主畫面後可用
- **內容：** 輕鬆環境音 loop（派對人聲或 lo-fi 背景樂）
- **控制：** 右上角小音符 icon toggle 開關
- **預設：** 靜音，使用者主動開啟（避免 autoplay 被擋）
- **無障礙：** `prefers-reduced-motion: reduce` 時不自動播放
- **實作：** `<audio>` element + React state toggle

### 4.5 彩蛋音效分層

| 層級 | 場景 | 音效風格 |
|------|------|----------|
| 微互動 | 頭像點擊、按鈕 | 短促 pop/tap（現有） |
| 小彩蛋 | 雙擊彈跳、翻轉卡片 | 有趣 ding/boing（~0.3s） |
| 發現 | 首次觸發彩蛋 | 魔法鈴聲（~0.5s） |
| 大彩蛋 | 時光膠囊 | 氛圍音樂淡入 loop |
| 投票 | 結果揭曉 | 鼓聲 roll + confetti 音效 |

---

## 5. 資料變更

### payload.js 新增欄位

```js
config: {
  // ...existing fields
  timeCapsule: '（Simon 的長信內容）',
  wallEasterEgg: '（留言牆彩蛋背面內容）',
  // pollQuestions 不放這裡，題目直接存在 Supabase questions table
}
```

### 新增檔案

| 檔案 | 用途 |
|------|------|
| `src/components/Vote.jsx` | 投票 tab 元件 |
| `src/components/TimeCapsule.jsx` | 時光膠囊全螢幕元件 |
| `src/components/DiscoveryBurst.jsx` | 「✨ 發現！」共用特效元件 |
| `src/hooks/useDiscovery.js` | 彩蛋發現狀態管理（localStorage） |
| `src/lib/supabase.js` | Supabase client 初始化 |
| `src/asset/sfx/discover.mp3` | 發現音效 |
| `src/asset/sfx/drumroll.mp3` | 投票揭曉音效 |
| `src/asset/sfx/envelope.mp3` | 信封音效 |
| `src/asset/sfx/bgm.mp3` | 背景環境音 |

### 修改檔案

| 檔案 | 變更 |
|------|------|
| `src/data/payload.js` | 新增 `config.timeCapsule`, `config.wallEasterEgg`, `config.pollQuestions` |
| `src/App.jsx` | 新增 Vote tab、背景音控制 state、派對模式判斷 |
| `src/components/TabBar.jsx` | 新增投票 tab icon、派對模式 pulse 動畫 |
| `src/components/Gate.jsx` | `0626` 特殊 PIN 處理 |
| `src/components/Avatar.jsx` | 雙擊事件 + 彈跳動畫 |
| `src/components/Wall.jsx` | 最後一張卡片三擊翻轉邏輯 |
| `src/components/Profile.jsx` | Overscroll 觸發時光膠囊、訪客模式顯示 |
| `src/components/Splash.jsx` | 派對當天模式切換 |
| `src/styles/global.css` | 新增動畫 keyframes、粒子、tab 轉場、投票樣式 |
| `src/hooks/useSfx.js` | 新增音效 hooks |

---

## 6. 技術考量

### Supabase 設定

- 建立 project（免費 tier 足夠）
- 建立 `questions` 和 `votes` table
- 開啟 Realtime for `votes` table
- 無 Supabase Auth — 使用者身份用 `me.id`（payload guest ID）識別，作為 `guest_id` 欄位傳入
- RLS policy：anon role 可 select `votes`、可 insert `votes`（無 auth 驗證，信任前端傳入的 `guest_id`）
- 前端用 anon key（公開 OK，unique constraint 防重複投票，PIN 驗證已在前端完成）
- 安全性：此為派對 app，34 人封閉場景，不需嚴格 auth

### 效能

- 粒子特效：用 CSS animation 優先，避免 canvas 持續 render
- 背景音樂：lazy load，不影響首屏
- Supabase client：僅投票 tab mount 時初始化
- `prefers-reduced-motion: reduce` → 關閉所有粒子 + 動畫 + 自動音效

### 相容性

- View Transitions API：已有 fallback（現有邏輯）
- Overscroll detection：`touchmove` + `touchend` 手動實作（不依賴 CSS overscroll）
- 音效：Web Audio API or `<audio>` element，需使用者互動後才能播放

---

## 7. 不做的事

- 不做徽章/成就收集系統（YAGNI）
- 不做使用者自建題目 UI（Simon 用 Supabase Dashboard 即可）
- 不做推播通知
- 不做後端 API server
- 不加 TypeScript（維持現有風格）
