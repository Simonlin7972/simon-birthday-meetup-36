import Avatar from './Avatar'
import Field from './Field'

// 「我的卡」：顯示目前登入來賓自己的資料。
export default function Profile({ me }) {
  return (
    <div className="screen">
      <div className="pf-hero">
        <Avatar person={me} className="pf-av" />
        <div className="pf-name">{me.name}</div>
        {me.intro && <div className="pf-intro">{me.intro}</div>}
      </div>
      <div className="pf-divider" />
      <Field label="怎麼認識 Simon" value={me.howMet} />
      <Field label="跟 Simon 認識多久" value={me.howLong} />
      <Field label="Simon 在你心中" value={me.simonIs} />
      <Field label="你觀察到 Simon 最大的改變" value={me.change} />
    </div>
  )
}
