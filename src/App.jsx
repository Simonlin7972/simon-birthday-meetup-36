import { useState, useEffect, useRef } from 'react'
import Gate from './components/Gate'
import TabBar from './components/TabBar'
import Profile from './components/Profile'
import Guests from './components/Guests'
import Message from './components/Message'
import Wall from './components/Wall'
import GuestSheet from './components/GuestSheet'

export default function App() {
  const [me, setMe] = useState(null)        // 目前登入的來賓
  const [tab, setTab] = useState('profile') // 目前分頁
  const [sheet, setSheet] = useState(null)  // sheet 顯示的來賓
  const scrollRef = useRef(null)

  // 切換分頁時收合 sheet 並回到頂端
  useEffect(() => {
    setSheet(null)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [tab])

  if (!me) return <Gate onEnter={setMe} />

  return (
    <div className="app">
      <div className="scroll" ref={scrollRef}>
        {tab === 'profile' && <Profile me={me} />}
        {tab === 'guests' && <Guests onOpen={setSheet} />}
        {tab === 'message' && <Message me={me} />}
        {tab === 'wall' && <Wall me={me} />}
      </div>
      <TabBar active={tab} onChange={setTab} />
      <GuestSheet guest={sheet} onClose={() => setSheet(null)} />
    </div>
  )
}
