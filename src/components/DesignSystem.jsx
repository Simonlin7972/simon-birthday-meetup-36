import Card from './Card'
import Avatar from './Avatar'
import Field from './Field'
import TabBar from './TabBar'

// 設計系統展示頁：把派對 app 用到的色彩、字型、元件整理在一處。
// 純參考用，網址加 ?ds 進入（見 App.jsx）。不接任何真實邏輯。

// 色票方塊：顯示真實顏色 + token 名 + 色值。
function Swatch({ token, value, note }) {
  const dark = /ink-line|btn|rose/.test(token)
  return (
    <div className="ds-swatch">
      <div
        className="ds-swatch-chip"
        style={{ background: `var(${token})`, color: dark ? '#fff7ec' : 'var(--ink)' }}
      >
        {token.replace('--', '')}
      </div>
      <div className="ds-swatch-meta">
        <code>{token}</code>
        <span>{value}</span>
        {note && <em>{note}</em>}
      </div>
    </div>
  )
}

// 區塊：標題 + 內容。
function Section({ title, sub, children }) {
  return (
    <section className="ds-section">
      <div className="ds-section-head">
        <h2 className="h-title h-title-bold">{title}</h2>
        {sub && <div className="h-sub">{sub}</div>}
      </div>
      {children}
    </section>
  )
}

// 子標題：標出元件名。
function Item({ name, desc, children }) {
  return (
    <div className="ds-item">
      <div className="ds-item-label">
        <span className="kicker">{name}</span>
        {desc && <span className="ds-item-desc">{desc}</span>}
      </div>
      <div className="ds-item-demo">{children}</div>
    </div>
  )
}

// 假來賓資料（不引 payload.js）
const fakePerson = {
  name: '王小明',
  intro: '愛爬山、咖啡成癮，週末都在找新的山路。',
  howMet: '大學登山社認識的',
  howLong: '快十年了',
  simonIs: '永遠最罩的那個人',
  change: '比以前更會照顧人了',
  toSimon: '生日快樂！謝謝你這些年的照顧，36 歲也要一起繼續爬山 🏔️',
}
const fakeWithPhoto = { ...fakePerson, name: 'Simon', photo: '' }

const COLORS = {
  '背景 / 表面': [
    ['--bg', '#d9c4ac', '主背景（暖牛皮紙）'],
    ['--bg2', '#cdb59a', '較深沙色，漸層用'],
    ['--surface', '#f5ecdd', '卡片 / 面板 / 鍵面'],
    ['--surface2', '#eadcc7', '次要表面 / active'],
  ],
  '文字（棕，非黑）': [
    ['--ink', '#4a3322', '主文字（深咖啡棕）'],
    ['--muted', '#7c5d44', '次要文字'],
    ['--faint', '#9a7d63', '最弱文字 / placeholder'],
    ['--ink-line', '#1e1a17', '近黑，僅用於描邊'],
  ],
  '點睛（橘，名為 gold）': [
    ['--gold', '#e88b3a', '主點睛橘（kicker / active）'],
    ['--gold-bright', '#f0a45a', '亮橘，漸層高光'],
    ['--rose', '#c75b3f', '磚紅，錯誤 / 警告'],
  ],
  '互動（栗棕，3D 按鈕系統）': [
    ['--btn', '#804220', '按鈕正面 / 填滿的 PIN dot'],
    ['--btn-edge', '#4f2810', '按鈕側壁（立體深度）'],
    ['--btn-ink', '#fff7ec', '深色按鈕上的米色文字'],
  ],
}

const ARROW =
  '<path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>'

export default function DesignSystem() {
  return (
    <div className="ds-wrap">
      <header className="ds-header">
        <span className="kicker">Design System</span>
        <h1 className="pf-name">Simon 36 · UI 元件庫</h1>
        <div className="h-sub">
          派對 app 現用到的色彩、字型與元件整理。網址加 <code>?ds</code> 進入此頁。
        </div>
      </header>

      {/* 1. 色彩 */}
      <Section title="色彩 Colors" sub="命名有歷史包袱：gold 其實是橘、ink 是棕、btn 是栗棕。">
        {Object.entries(COLORS).map(([group, list]) => (
          <div key={group} className="ds-group">
            <div className="ds-group-title">{group}</div>
            <div className="ds-swatch-grid">
              {list.map(([token, value, note]) => (
                <Swatch key={token} token={token} value={value} note={note} />
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* 2. 字型 */}
      <Section title="字型 Typography" sub="兩套字型 + 既有文字 class。">
        <Item name="--serif · Archivo Black" desc="英文 display（名為 serif 但其實是粗黑體）">
          <div style={{ fontFamily: 'var(--serif)', fontSize: 34 }}>Simon 36 ABCDEFG 0123</div>
        </Item>
        <Item name="--sans · ChironGoRoundTC" desc="中文圓體，UI / 內文">
          <div style={{ fontFamily: 'var(--sans)', fontSize: 22 }}>歡迎來到 Simon 的生日小聚</div>
        </Item>
        <Item name=".h-title.h-title-bold" desc="區塊大標">
          <div className="h-title h-title-bold">今晚的朋友們</div>
        </Item>
        <Item name=".h-sub" desc="副標 / 說明">
          <div className="h-sub">每個人都留了一句話</div>
        </Item>
        <Item name=".kicker" desc="小標籤 / mark">
          <span className="kicker">About</span>
        </Item>
        <Item name=".pf-name" desc="名字大字">
          <div className="pf-name">王小明</div>
        </Item>
      </Section>

      {/* 3. Base 原子元件 */}
      <Section title="Base · 原子元件" sub="最小可重用單位。">
        <Item name="<Avatar>" desc="圓形頭像，依名字產生漸層；有 photo 則顯示照片">
          <div className="ds-row">
            <Avatar person={fakePerson} />
            <Avatar person={{ name: '陳大文' }} />
            <Avatar person={{ name: 'Amy' }} />
            <Avatar person={fakePerson} className="pf-av" />
          </div>
        </Item>

        <Item name="<Field>" desc="label + 內容，內容為空時不 render">
          <Field label="怎麼認識 Simon" value={fakePerson.howMet} />
          <Field label="跟 Simon 認識多久" value={fakePerson.howLong} />
          <Field label="（空值範例 → 不顯示）" value={null} />
        </Item>

        <Item name=".chip" desc="角色 / 標籤膠囊">
          <div className="ds-row">
            <div className="chip">壽星本人</div>
            <div className="chip">登山夥伴</div>
          </div>
        </Item>

        <Item name=".splash-cta（3D 按鈕）" desc="edge 側壁 + front 正面，按下有壓入感">
          <button className="splash-cta" style={{ position: 'static' }}>
            <span className="cta-edge" />
            <span className="cta-front">
              進入會場
              <svg className="cta-arrow" viewBox="0 0 256 256" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ARROW }} />
            </span>
          </button>
        </Item>

        <Item name=".pin-dots / .pin-dot" desc="PIN 輸入進度點（前兩顆已填）">
          <div className="pin-dots">
            <div className="pin-dot on" />
            <div className="pin-dot on" />
            <div className="pin-dot" />
            <div className="pin-dot" />
          </div>
        </Item>

        <Item name=".code-box" desc="4 格通關密碼輸入（展示用，靜態）">
          <div className="code-boxes">
            <input className="code-box filled" defaultValue="0" maxLength={1} readOnly />
            <input className="code-box filled" defaultValue="6" maxLength={1} readOnly />
            <input className="code-box" maxLength={1} readOnly />
            <input className="code-box" maxLength={1} readOnly />
          </div>
        </Item>
      </Section>

      {/* 4. Composite 組合元件 */}
      <Section title="Composite · 組合元件" sub="多個原子元件組成的卡片與佈局。">
        <Item name="<Card>（.card 基底）" desc="硬 offset 投影 + 近黑描邊的貼紙卡">
          <Card className="ds-demo-card">這是基底 Card。各頁面用 className 疊加尺寸與排版。</Card>
        </Item>

        <Item name=".gcard（來賓卡）" desc="朋友們分頁的橫向卡片">
          <Card className="gcard">
            <div className="gcard-head">
              <Avatar person={fakePerson} />
              <div className="gn">{fakePerson.name}</div>
            </div>
            <div className="gi">{fakePerson.intro}</div>
          </Card>
        </Item>

        <Item name=".wcard（留言卡）" desc="留言牆，想對 Simon 說的話">
          <Card className="wcard">
            <div className="wc-head">
              <Avatar person={fakePerson} />
              <div className="wc-name">{fakePerson.name}</div>
            </div>
            <div className="wc-text">{fakePerson.toSimon}</div>
          </Card>
        </Item>

        <Item name=".pf-card（個人卡 hero）" desc="我的卡片分頁，大頭像 + Field 列">
          <Card className="pf-card">
            <div className="pf-hero">
              <Avatar person={fakePerson} className="pf-av" />
              <div className="pf-name">{fakePerson.name}</div>
              <div className="pf-intro">{fakePerson.intro}</div>
            </div>
            <div className="pf-divider" />
            <Field label="怎麼認識 Simon" value={fakePerson.howMet} />
            <Field label="跟 Simon 認識多久" value={fakePerson.howLong} />
            <Field label="Simon 在你心中" value={fakePerson.simonIs} />
          </Card>
        </Item>

        <Item name=".keypad / .key（PIN 鍵盤）" desc="12 鍵 grid，數字鍵立體、功能鍵 .fn 扁平">
          <div className="keypad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del'].map((k) => (
              <button key={k} className={`key${k === 'clear' || k === 'del' ? ' fn' : ''}`} type="button">
                <span className="key-face">{k === 'clear' ? '清除' : k === 'del' ? '⌫' : k}</span>
              </button>
            ))}
          </div>
        </Item>

        <Item name="<TabBar>" desc="底部 5 分頁導覽（Phosphor duotone 圖示）">
          <div className="ds-tabbar-frame">
            <TabBar active="profile" onChange={() => {}} />
          </div>
        </Item>
      </Section>

      <footer className="ds-footer">內容唯一來源：src/data/payload.js · 樣式：src/styles/global.css</footer>
    </div>
  )
}
