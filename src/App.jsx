import { useState, useEffect, useRef } from 'react'
import Splash from './components/Splash'
import Gate from './components/Gate'
import TabBar from './components/TabBar'
import Profile from './components/Profile'
import Guests from './components/Guests'
import Message from './components/Message'
import Wall from './components/Wall'
import Bingo from './components/Bingo'
import GuestSheet from './components/GuestSheet'

export default function App() {
  const [started, setStarted] = useState(false) // 是否已通過啟動畫面
  const [me, setMe] = useState(null)        // 目前登入的來賓
  const [tab, setTab] = useState('profile') // 目前分頁
  const [sheet, setSheet] = useState(null)  // sheet 顯示的來賓
  const [bingoKey, setBingoKey] = useState(0)
  const scrollRef = useRef(null)
  const bingoTapsRef = useRef([])

  // 切換分頁時收合 sheet 並回到頂端
  useEffect(() => {
    setSheet(null)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [tab])

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
  if (!me) return <Gate onEnter={setMe} />

  return (
    <div className="app">
      <div className="scroll" ref={scrollRef}>
        {tab === 'profile' && <Profile me={me} />}
        {tab === 'guests' && <Guests onOpen={setSheet} />}
        {tab === 'message' && <Message me={me} />}
        {tab === 'wall' && <Wall />}
        {tab === 'bingo' && <Bingo key={bingoKey} me={me} />}
      </div>
      <TabBar active={tab} onChange={handleTab} />
      <GuestSheet guest={sheet} onClose={() => setSheet(null)} />
    </div>
  )
}
