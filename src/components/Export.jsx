import { people, config } from '../data/payload'
import Splash from './Splash'
import Gate from './Gate'
import Profile from './Profile'
import Guests from './Guests'
import Message from './Message'
import Wall from './Wall'
import Bingo from './Bingo'
import GuestSheet from './GuestSheet'
import TabBar from './TabBar'

// 全畫面總覽頁：一次把 app 所有 screen / 狀態並排在手機外框裡，方便檢查一致性。
// 網址 /export 或 ?export 進入（見 App.jsx）。desktop 多欄、mobile 單欄。
//
// 做法：每個 tile 是一個 <iframe>，指向單畫面模式 ?export&screen=<id>。
// iframe 是獨立 document，所以畫面裡用到的 100vh / 100vw / dvh 與 position:fixed
// 都會以 iframe 框為基準正確解析（真正的「一支手機視窗」），不需任何 hack。

const noop = () => {}

// 挑一位有 fromSimon 的來賓當預覽對象（這樣信件 tile 才有內容），找不到就用第一位。
// 換成獨立 id，避免 Bingo 的 localStorage（bingo_<id>）覆蓋到真實來賓的進度。
const base = people.find((p) => p.fromSimon) || people[0]
const me = { ...base, id: 'export-preview' }

// app 外殼複製品：讓每個 screen 待在它原生的 .app > .scroll.screen 環境。
// bare=true 時不包 .scroll（給 Splash / Gate 這種自己就 height:100% 滿版的畫面）。
function Shell({ children, tab, bare }) {
  return (
    <div className="app">
      {bare ? children : <div className="scroll">{children}</div>}
      {tab && <TabBar active={tab} onChange={noop} />}
    </div>
  )
}

// 所有要展示的畫面，id 用在 iframe 的 ?screen=<id>。
const SCREENS = [
  { id: 'splash', label: '啟動 Splash', render: () => <Shell bare><Splash onStart={noop} /></Shell> },
  { id: 'gate', label: '入場 Gate (PIN)', render: () => <Shell bare><Gate onEnter={noop} /></Shell> },
  { id: 'profile', label: '我的卡片 Profile', render: () => <Shell tab="profile"><Profile me={me} /></Shell> },
  { id: 'guests', label: '朋友們 Guests', render: () => <Shell tab="guests"><Guests me={me} onOpen={noop} activeId={null} morphId={null} /></Shell> },
  {
    id: 'sheet', label: '來賓卡片 GuestSheet', render: () => (
      <Shell tab="guests">
        <Guests me={me} onOpen={noop} activeId={me.id} morphId={null} />
        <GuestSheet guest={me} onClose={noop} />
      </Shell>
    ),
  },
  { id: 'message-locked', label: '給你的話 — 鎖定', render: () => <Shell tab="message"><Message me={me} /></Shell> },
  { id: 'message-letter', label: '給你的話 — 信件', render: () => <Shell><Message me={me} previewUnlocked /></Shell> },
  { id: 'wall', label: '留言牆 Wall', render: () => <Shell tab="wall"><Wall /></Shell> },
  { id: 'bingo-gate', label: '賓果 — 閘門', render: () => <Shell tab="bingo"><Bingo me={me} /></Shell> },
  { id: 'bingo-play', label: '賓果 — 遊玩', render: () => <Shell><Bingo me={me} previewPlaying /></Shell> },
  { id: 'bingo-modal', label: '賓果 — 輸入彈窗', render: () => <Shell><Bingo me={me} previewPlaying previewModal /></Shell> },
  { id: 'bingo-win', label: '賓果 — BINGO 慶祝', render: () => <Shell><Bingo me={me} previewPlaying previewCelebrate /></Shell> },
]

export default function Export() {
  const params = new URLSearchParams(window.location.search)
  const wanted = params.get('screen')

  // 單畫面模式：iframe 載入 ?export&screen=<id> 時，只滿版渲染那一個畫面。
  if (wanted) {
    const screen = SCREENS.find((s) => s.id === wanted)
    return <div className="export-single">{screen ? screen.render() : null}</div>
  }

  // 總覽模式：每個畫面包在手機外框裡的 iframe。
  const src = (id) => `${window.location.pathname}?export&screen=${id}`
  return (
    <div className="export-page">
      <header className="export-head">
        <h1 className="h-title h-title-bold">{config.title} — All Screens</h1>
        <p className="h-sub">所有畫面總覽 · 一次檢查一致性 ·{' '}
          <a href="?ds">設計系統 ?ds</a> · <a href="?slides">簡報 ?slides</a>
        </p>
      </header>

      <div className="export-grid">
        {SCREENS.map((s) => (
          <div className="export-tile" key={s.id}>
            <div className="export-label">{s.label}</div>
            <div className="export-frame">
              <div className="export-statusbar">
                <span>9:41</span>
                <span className="export-statusbar-icons">●●● ▮▮ 🔋</span>
              </div>
              <div className="export-viewport">
                <iframe className="export-iframe" src={src(s.id)} title={s.label} loading="lazy" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
