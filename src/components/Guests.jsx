import Avatar from './Avatar'
import { people } from '../data/payload'

// 「來賓」：橫向滑動的卡片牆，點一下開啟詳細 sheet。
export default function Guests({ onOpen }) {
  return (
    <div className="screen">
      <div className="kicker">The Guests</div>
      <div className="h-title">今晚的人</div>
      <div className="h-sub">共 {people.length} 位朋友到場 · 左右滑動，點一下看更多</div>
      <div className="rail">
        {people.map((p) => (
          <div key={p.id} className="gcard" onClick={() => onOpen(p)}>
            <Avatar person={p} />
            <div className="gn">{p.name}</div>
            <div className="gi">{p.intro || ''}</div>
            {p.howLong && <div className="chip">認識 {p.howLong}</div>}
          </div>
        ))}
      </div>
      <div className="rail-foot">← 滑動認識每一個人 →</div>
    </div>
  )
}
