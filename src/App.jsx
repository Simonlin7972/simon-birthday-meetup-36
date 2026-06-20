import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import Splash from './components/Splash'
import Gate from './components/Gate'
import TabBar from './components/TabBar'
import Profile from './components/Profile'
import Guests from './components/Guests'
import Message from './components/Message'
import Wall from './components/Wall'
import Bingo from './components/Bingo'
import GuestSheet from './components/GuestSheet'
import DesignSystem from './components/DesignSystem'
import Slides from './components/Slides'
import Export from './components/Export'

export default function App() {
  // 簡報模式：網址 /slides 或 ?slides 直接進入，跳過 Splash / Gate。
  if (typeof window !== 'undefined' &&
    (window.location.pathname.replace(/\/$/, '').endsWith('/slides') ||
      window.location.search.includes('slides')))
    return <Slides />
  // 全畫面總覽頁：網址 /export 或 ?export 直接進入，一次檢視所有畫面。
  if (typeof window !== 'undefined' &&
    (window.location.pathname.replace(/\/$/, '').endsWith('/export') ||
      window.location.search.includes('export')))
    return <Export />
  // 設計系統參考頁：網址加 ?ds 直接進入，跳過 Splash / Gate。
  if (typeof window !== 'undefined' && window.location.search.includes('ds'))
    return <DesignSystem />
  const [started, setStarted] = useState(false) // 是否已通過啟動畫面
  const [me, setMe] = useState(null)        // 目前登入的來賓
  const [entering, setEntering] = useState(false) // 入場動畫進行中
  const [tab, setTab] = useState('profile') // 目前分頁
  const [sheet, setSheet] = useState(null)  // sheet 顯示的來賓
  const [morphId, setMorphId] = useState(null) // 轉場中參與 morph 的卡片 id
  const [bingoKey, setBingoKey] = useState(0)
  const [bingoPlaying, setBingoPlaying] = useState(false) // 賓果遊戲進行中 → 隱藏 bottom bar
  const [msgUnlocked, setMsgUnlocked] = useState(false) // 悄悄話已解鎖 → 隱藏 bottom bar
  const scrollRef = useRef(null)
  const bingoTapsRef = useRef([])

  // 入場動畫完成後移除 .enter（tab 依序浮現 + 卡片摺紙展開 ≈ 2s）
  useEffect(() => {
    if (!entering) return
    const id = setTimeout(() => setEntering(false), 2100)
    return () => clearTimeout(id)
  }, [entering])

  // 切換分頁時收合 sheet、回到頂端，並離開賓果遊戲畫面
  useEffect(() => {
    setSheet(null)
    setBingoPlaying(false)
    setMsgUnlocked(false)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [tab])

  // 共享元素轉場：用 View Transitions API 讓小卡 morph 成 sheet。
  // 不支援或偏好減少動態時，直接更新狀態（降級回 CSS 滑上動畫）。
  const reduceMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  // 開/關共用：標記參與 morph 的卡片 id（開=目標卡、關=來源卡），讓它在
  // 捕捉新舊狀態時取得固定的 g-active-* 名稱與 sheet 配對 morph。堆疊順序由
  // global.css 直接在 ::view-transition-group 伪元素上用 z-index 控制。
  const animateSheet = (next) => {
    if (!document.startViewTransition || reduceMotion()) { setSheet(next); return }
    const id = next ? next.id : sheet?.id
    flushSync(() => setMorphId(id))
    const vt = document.startViewTransition(() => flushSync(() => setSheet(next)))
    vt.finished.finally(() => setMorphId(null))
  }
  const openGuest = (p) => animateSheet(p)
  const closeGuest = () => animateSheet(null)

  const handleTab = (id) => {
    // 隱藏重置：在賓果頁連點三下 tab → 重置遊戲
    if (id === 'bingo' && tab === 'bingo') {
      const now = Date.now()
      bingoTapsRef.current.push(now)
      if (bingoTapsRef.current.length > 3) bingoTapsRef.current.shift()
      if (bingoTapsRef.current.length === 3 && now - bingoTapsRef.current[0] < 800) {
        const key = `bingo_${me.id}`
        localStorage.removeItem(key)
        localStorage.removeItem(`${key}_celebrated`)
        setBingoKey(k => k + 1)
        bingoTapsRef.current = []
        return
      }
    } else {
      bingoTapsRef.current = []
    }
    setTab(id)
  }

  if (!started) return <Splash onStart={() => setStarted(true)} />
  if (!me) return <Gate onEnter={(p) => { setMe(p); setEntering(true) }} />

  return (
    <div className={`app${entering ? ' enter' : ''}`}>
      <div className={`scroll${bingoPlaying || msgUnlocked ? ' scroll-fullscreen' : ''}`} ref={scrollRef}>
        {tab === 'profile' && <Profile me={me} />}
        {tab === 'guests' && <Guests me={me} onOpen={openGuest} activeId={sheet?.id ?? null} morphId={morphId} />}
        {tab === 'message' && <Message me={me} onUnlockedChange={setMsgUnlocked} />}
        {tab === 'wall' && <Wall />}
        {tab === 'bingo' && <Bingo key={bingoKey} me={me} onPlayingChange={setBingoPlaying} />}
      </div>
      {!bingoPlaying && !msgUnlocked && <TabBar active={tab} onChange={handleTab} />}
      <GuestSheet guest={sheet} onClose={closeGuest} />
    </div>
  )
}
