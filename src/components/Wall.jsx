import Avatar from './Avatar'
import Card from './Card'
import { people } from '../data/payload'

// 「留言牆」：所有來賓想對 Simon 說的話。
export default function Wall() {
  const wishes = people.filter((p) => p.toSimon)
  return (
    <div className="screen screen-wall">
      <div className="h-title h-title-bold">大家想對 Simon 說的話</div>
      <div className="h-sub">每個人都留了一句 · 一起送給今晚的壽星</div>
      <div className="wall">
        {wishes.map((p) => (
          <Card key={p.id} className="wcard">
            <div className="wc-head">
              <Avatar person={p} />
              <div className="wc-name">{p.name}</div>
            </div>
            <div className="wc-text">{p.toSimon}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
