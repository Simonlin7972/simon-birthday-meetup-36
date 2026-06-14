import Avatar from './Avatar'
import { people } from '../data/payload'

// 「留言牆」：所有來賓想對 Simon 說的話，目前登入者的卡片會被標記。
export default function Wall({ me }) {
  const wishes = people.filter((p) => p.toSimon)
  return (
    <div className="screen">
      <div className="h-title">大家想對 Simon 說的話</div>
      <div className="h-sub">每個人都留了一句 · 一起送給今晚的壽星</div>
      <div className="wall">
        {wishes.map((p) => (
          <div key={p.id} className={`wcard${p.id === me.id ? ' me' : ''}`}>
            <div className="wc-head">
              <Avatar person={p} />
              <div className="wc-name">
                {p.name}
                {p.id === me.id && <span className="tag">YOU</span>}
              </div>
            </div>
            <div className="wc-text">{p.toSimon}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
