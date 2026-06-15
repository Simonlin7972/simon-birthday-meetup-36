import { useMemo } from 'react'
import Avatar from './Avatar'
import Card from './Card'
import { people } from '../data/payload'

// 「來賓」：橫向滑動的卡片牆，點一下開啟詳細 sheet。
export default function Guests({ me, onOpen, activeId, morphId }) {
  // 每次進入頁面重新洗牌，並把目前登入的來賓固定排在第一張。
  // 元件在切到本分頁時才掛載，所以每次切換都會得到新的順序。
  const ordered = useMemo(() => {
    const rest = people.filter((p) => p.id !== me.id)
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[rest[i], rest[j]] = [rest[j], rest[i]]
    }
    const self = people.find((p) => p.id === me.id)
    return self ? [self, ...rest] : rest
  }, [me.id])

  return (
    <div className="screen screen-guests">
      <div className="h-title h-title-bold">今晚的朋友們</div>
      <div className="h-sub">歡迎大家今晚互相聊聊認識！</div>
      <div className="rail" style={activeId != null ? { scrollSnapType: 'none' } : undefined}>
        {ordered.map((p) => {
          // 只有「正在 morph」的那張卡掛固定的 g-active-* 名（同時只有一張，
          // 不會撞名），與 sheet 配對 morph；其餘卡片無名 → 落在 root 群組底層、
          // 被遮罩壓暗。已是 sheet（open）時放棄名稱，交棒給 sheet。
          const open = activeId === p.id
          const morphing = morphId === p.id && !open
          return (
            <Card
              key={p.id}
              className="gcard"
              onClick={() => onOpen(p)}
              style={{ viewTransitionName: morphing ? 'g-active-box' : 'none' }}
            >
              <div className="gcard-head">
                <Avatar person={p} vt={morphing ? 'g-active-av' : undefined} />
                <div className="gn" style={{ viewTransitionName: morphing ? 'g-active-name' : 'none' }}>{p.name}</div>
              </div>
              <div className="gi">{p.intro || ''}</div>
            </Card>
          )
        })}
      </div>
      <div className="rail-foot">← 滑動認識每一個人 →</div>
    </div>
  )
}
