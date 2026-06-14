# Simon's Party — Brand Guidelines

> Simon 的 36 歲生日 & 告別派對 · 視覺識別指南
> 版本 1.0（以 **Splash 啟動頁 + Gate PIN 頁** 為定調基準，對照 `src/styles/global.css` 實際值整理）

---

## 0. 這份文件的狀態

「暖色紙感」的改版**已經落地**。`src/styles/global.css` 的 `:root` 已整批翻成沙色／棕／橘，舊的「暗色＋金色」風格不復存在。

兩個入場畫面 — [Splash.jsx](../src/components/Splash.jsx) 與 [Gate.jsx](../src/components/Gate.jsx) — 是這版品牌的**定調畫面**：色彩、字體、按鈕互動、卡片質感都以它們為準。本文件忠實對照現有 CSS 變數名稱（沿用舊命名，旁註語意），讓文件＝程式碼的對照表。

> ⚠️ 命名歷史包袱：CSS 變數沿用舊暗色主題的名字，**語意已經改變**。最重要的三個：
> - `--gold` 其實是**品牌橘** `#e88b3a`
> - `--ink` 其實是**主文字棕** `#4a3322`（不是純黑；純黑另存於 `--ink-line`）
> - `--serif` 其實是 **Archivo Black**（display 字體，並非襯線體）
>
> 之後若重構，建議改成語意名（`--accent` / `--text` / `--display`），但目前以現況為準。

---

## 1. 品牌個性 Brand Personality

溫暖、手繪、像收到一張用心的邀請卡。不華麗、不冷調，而是**親近、有溫度、帶點玩心**。

| 關鍵字 | 說明 |
|--------|------|
| 溫暖 Warm | 牛皮紙底色、奶油白、暖棕，整體偏暖、低彩度 |
| 手感 Handmade | 粗黑描邊的插畫、紙質紋理、手寫感波浪線 |
| 玩心 Playful | 彩旗、氣球、揮手角色、會「壓下去」的立體按鈕 |
| 親近 Friendly | 圓潤字體與大圓角，沒有銳利邊角 |
| 誠摯 Sincere | 留白、字距拉開的標題，安靜而慎重的邀請感 |

一句話：**「像牛皮紙信封裡，一張手繪的生日邀請卡。」**

---

## 2. 色彩系統 Color Palette

以下 Token 名稱**即為 `:root` 中的 CSS 變數名**，可直接在程式碼使用。「語意」欄說明它真正代表什麼。

### 背景 / 紙感 Surfaces

| 變數 | Hex | 語意 / 用途 |
|------|-----|------|
| `--bg` | `#d9c4ac` | **主背景**，牛皮紙暖沙（app shell） |
| `--bg2` | `#cdb59a` | 較深的沙，背景漸層底 |
| `--surface` | `#f5ecdd` | 卡片、面板、鍵帽 |
| `--surface2` | `#eadcc7` | 次級面（卡片 active 態） |

> **全站同底**：Splash、Gate 與 app 內所有畫面共用 `--bg`（先前入場畫面寫死的 `#eacdbb` 已統一掉），整段體驗在同一張牛皮紙上。

### 文字（棕）Brown Ink

| 變數 | Hex | 語意 / 用途 |
|------|-----|------|
| `--ink` | `#4a3322` | **主文字色**（深espresso棕，承載標題與內文） |
| `--muted` | `#7c5d44` | 次級文字（提示、副標、簡介） |
| `--faint` | `#9a7d63` | 最弱文字（meta、頁尾、placeholder） |
| `--ink-line` | `#1e1a17` | **近黑描線**：插畫粗邊、卡片邊框、頭像外圈。**僅用於描邊／框線，不當大段文字色** |

### 橘 — 主要強調色 Orange（命名為 gold）

| 變數 | Hex | 語意 / 用途 |
|------|-----|------|
| `--gold` | `#e88b3a` | **主強調色**：kicker、tab active、PIN 標記、欄位標籤、CTA 點睛 |
| `--gold-bright` | `#f0a45a` | 亮橘，漸層高光（如 Gate 標題的漸層文字） |
| `--rose` | `#c75b3f` | 磚紅／陶土紅，**錯誤／警示**（PIN 輸入錯誤） |

### 互動棕 — 立體按鈕 Chestnut

3D 按鈕與 PIN 點用一組較飽和的栗棕：

| 變數 | Hex | 用途 |
|------|-----|------|
| `--btn` | `#804220` | 按鈕正面、PIN 已填的圓點 |
| `--btn-edge` | `#4f2810` | 按鈕立體側壁（深一階） |
| `--btn-ink` | `#fff7ec` | 栗棕底上的奶白字 |

### 配色原則

- **6 成中性、3 成棕、1 成橘**：背景留白以暖沙／奶白為主，棕色承載文字，橘色只在重點處點睛。
- **低彩度為基調**：除了橘與磚紅，其餘都偏霧、偏柔。
- **三層棕的分工**：描線用近黑 `--ink-line`；文字用 espresso `--ink` → `--muted` → `--faint`；互動實體（按鈕）用飽和栗棕 `--btn`。三者不可混用。
- **對比**：`--ink` 配暖沙背景即達足夠可讀性；橘色文字盡量加大、加粗使用。

---

## 3. 字體系統 Typography

| 變數 | 字體 | 用途 |
|------|------|------|
| `--sans` | **ChironGoRoundTC**（圓體），fallback PingFang／Noto Sans TC | 內文、提示、UI 文字、部分中文標題 |
| `--serif` | **Archivo Black**（其實是 display 黑體，非襯線），fallback ChironGoRoundTC | **展示大標**：頁標、人名、Gate 標題、留言、鍵帽數字 |

> 命名說明：`--serif` 是歷史包袱，實際載入的是 Archivo Black。**英文展示字體已定案維持 Archivo Black**（方正厚重，與圓潤中文形成份量對比），先前文件中「是否換圓體 display」的待辦已關閉。

### 排版手法（從兩張定調畫面歸納）

- **展示大標**：`--serif`、字級大、`font-weight` 視情況拉到 900（Splash 的 `Welcome`）。可走**弧線排列**（Splash 的 `Welcome` 沿 `textPath` 弧形）。
- **打字機效果**：Splash 主標第二行（`Simon 的生日小聚`）逐字打出，游標打完後緩慢閃爍 — 帶出「正在寫邀請卡」的手感。
- **字距拉開**：邀請／標籤類用大 `letter-spacing`（`.14em`～`.42em`）＋ `uppercase`，營造安靜慎重感（Gate 的 `gate-mark`、CTA 文字、kicker）。
- **層級用顏色區分**：同一組標題可混用棕＋橘；Gate 標題第二行用**橘色漸層裁切文字**（`--gold` → `--gold-bright` → `#e7a86e`，`background-clip:text`）。

---

## 4. 介面元件與互動 UI & Interaction

> 這是這版品牌最具識別度的部分 — 兩個入場畫面確立的「可玩、有實體感」的元件語言。

### 4.1 立體按鈕 Duolingo-style 3D Buttons

招牌互動。靜止的 `edge`（側壁）＋ 浮起的 `front`（正面），按下時 front 往下壓進 edge，露出的側壁變短 → 真正「壓下去」的位移感。

- **CTA**（Splash「馬上進入會場」）：栗棕 `--btn` 正面 ／ `--btn-edge` 側壁，`--btn-ink` 奶白字，圓角 `18px`，hover 微微再浮起、箭頭右移，active 壓下。
- **鍵盤按鍵**（Gate 數字鍵）：`--surface` 鍵帽浮在 `--bg2` 側壁上，圓角 `16px`，`--serif` 數字。功能鍵（清除／⌫）維持扁平、不立體。**側壁必須比所在背景深一階**才看得到厚度（這裡用 `--bg2` 對比 `--bg` 底）。
- 通則：`touch-action:manipulation`、`user-select:none`、`transition` 用 `cubic-bezier(.3,.7,.4,1)`，active 時位移驟縮並縮短 transition（`.04s`）做出「彈」的回饋。

### 4.2 貼紙感卡片 Sticker / Comic Cards

平面之外的另一招牌：**近黑實線描邊 ＋ 不模糊的硬投影**（risograph／貼紙感）。

- 邊框：`1.5px solid var(--ink-line)`
- 投影：`box-shadow: 3~4px 3~4px 0 rgba(30,26,23,.08~.1)`（**offset 不帶 blur**）
- 大圓角：`18~22px`
- active 時整張往右下位移、投影縮短（被按下的實體感）
- 代表元件：賓客卡 `.gcard`、留言卡 `.wcard`、底部彈出 `.sheet`。

### 4.3 頭像 Avatars

圓形、`--serif` 字母縮寫，外圈 `box-shadow: 0 0 0 2px var(--ink-line)` 近黑描邊環（呼應插畫粗邊）。

### 4.4 進場動畫 Entry Motion

- `rise`：元素由下淡入上浮（`translateY(14px)→0`），各元件**錯開 delay**（`.1s`、`.2s`、`.34s`…）依序登場。
- `char-rise`：Splash 角色從畫面下方升起並出血到容器外。
- `spin`：M310 logo 無限慢速旋轉（12s）。
- `shake`：PIN 錯誤時左右晃動 `.42s`。
- 全站尊重 `prefers-reduced-motion:reduce`（一律關閉動畫／轉場）。

### 4.5 圓點指示 PIN Dots

`32px` 圓，未填為 `--line2` 細框；已填變栗棕 `--btn` 實心＋柔光暈＋微放大。

---

## 5. 材質與表面 Texture & Surfaces

由 `body::before` / `body::after` 兩層疊出紙感，所有畫面共用：

- **暖光暈**（`::before`）：頂部奶白 radial 高光 ＋ 右下角柔橘微光 ＋ 沙色直向漸層（`--bg`→`--bg2`）。
- **牛皮紙紋理**（`::after`）：`feTurbulence` 分形噪點，`mix-blend-mode:multiply`、`opacity:.08`，鋪出細微纖維／折痕質感。
- **圓角卡片**：介面元件一律大圓角，與插畫圓潤呼應。
- **貼紙感**：見 4.2，硬投影＋近黑描邊。

---

## 6. 插畫風格 Illustration Style

- **粗黑描邊**（`--ink-line` `#1e1a17`）＋ **平塗色塊**，無漸層、無寫實陰影、無細線描邊。
- **圓角、圓潤造型**，肢體與物件都是圓滑線條。
- 主角：戴橘色毛帽、圓框眼鏡、白上衣棕領、橘長褲、抱著筆電、揮手的人物（= Simon 的化身，見 `src/asset/simon_char.png`）。
- 手部、表情誇張可愛，帶手繪不完美感。
- **點綴元素庫**：彩旗（bunting）、彩帶 popper、氣球（線稿）、愛心、手寫波浪底線、`YA!`、驚嘆號。

---

## 7. 語氣 Voice & Tone

- 語言：**繁體中文為主**，可混搭輕鬆英文（`Welcome`）與日文助詞（`Simon の…`）。
- 口吻：溫暖、口語、像朋友說話；慎重的邀請語與俏皮語並存。
- 實際文案範例：`歡迎你來到`、`Simon 的生日小聚`、`馬上進入會場`、`輸入你的專屬 PIN 入場`、`PIN 不正確，再試一次`。
- 用 emoji 適度增溫，展示性大標保持乾淨。

---

## 8. Do / Don't

**Do**
- ✅ 用暖沙／奶白當底，大量留白；全站（含入場畫面）共用 `--bg`
- ✅ 橘（`--gold`）只點睛、棕（`--ink`）承載文字、近黑（`--ink-line`）只描邊
- ✅ 標題字距拉開，營造邀請卡的慎重感
- ✅ 按鈕做立體「壓下去」回饋、卡片用硬投影貼紙感
- ✅ 插畫一律粗黑描邊 ＋ 平塗

**Don't**
- ❌ 用純白或冷灰當主背景（會失去紙感溫度）
- ❌ 大面積使用粉彩或橘色
- ❌ 把 `--ink-line` 近黑拿來當大段內文色（內文用 `--ink`）
- ❌ 混用三層棕的分工（描線／文字／按鈕實體各司其職）
- ❌ 插畫加漸層、寫實陰影或細線描邊
- ❌ 卡片用一般帶模糊的柔投影（要硬 offset 投影才對味）

---

## 9. `:root` 對照表（現況）

以下即 `src/styles/global.css` 目前的 `:root`，旁註語意：

```css
:root {
  /* 背景 / 紙感 */
  --bg:       #d9c4ac;  /* 主背景，暖沙 */
  --bg2:      #cdb59a;  /* 背景漸層深底 */
  --surface:  #f5ecdd;  /* 卡片 / 面板 / 鍵帽 */
  --surface2: #eadcc7;  /* 次級面 / active */

  /* 文字（棕） */
  --ink:   #4a3322;     /* 主文字 espresso 棕 */
  --muted: #7c5d44;     /* 次級文字 */
  --faint: #9a7d63;     /* 最弱文字 */

  /* 強調（橘，命名沿用 gold） */
  --gold:        #e88b3a;  /* 主強調橘 */
  --gold-bright: #f0a45a;  /* 亮橘 / 漸層高光 */
  --rose:        #c75b3f;  /* 錯誤 / 警示 磚紅 */

  /* 立體按鈕 / PIN 點：飽和栗棕 */
  --btn:      #804220;  /* 按鈕正面 / PIN 圓點 */
  --btn-edge: #4f2810;  /* 按鈕側壁 */
  --btn-ink:  #fff7ec;  /* 按鈕奶白字 */

  /* 面 / 線 */
  --line:     rgba(74,51,34,.12);  /* 細分隔線 */
  --line2:    rgba(74,51,34,.22);  /* 較明顯框線 */
  --ink-line: #1e1a17;             /* 近黑描邊（插畫 / 卡片框 / 頭像環）*/

  /* 字體 */
  --sans:  "ChironGoRoundTC", -apple-system, "PingFang TC", "Noto Sans TC", system-ui, sans-serif;
  --serif: "Archivo Black", "ChironGoRoundTC", "PingFang TC", "Noto Sans TC", sans-serif; /* 實為 display 黑體 */
}
```

---

## 10. 待辦 / 待補

- [x] ~~把栗棕按鈕色與入場背景抽成變數~~（已抽成 `--btn` / `--btn-edge` / `--btn-ink`；入場背景已統一為 `--bg`）
- [ ] （選做）重構為語意 token：`--accent`(橘) / `--text`(棕) / `--display`(字體)，消除歷史命名包袱
- [ ] 用主視覺原檔重新校準色票 hex
- [ ] 把主視覺存進 `docs/assets/`（app icon、banner、角色去背）
