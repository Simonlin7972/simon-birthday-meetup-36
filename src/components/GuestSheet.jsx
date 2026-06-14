import Avatar from './Avatar'
import Field from './Field'

// 來賓詳細的底部彈出 sheet。guest 為 null 時收合。
export default function GuestSheet({ guest, onClose }) {
  return (
    <>
      <div className={`sheet-bg${guest ? ' show' : ''}`} onClick={onClose} />
      <div className={`sheet${guest ? ' show' : ''}`}>
        <div className="sheet-handle" />
        {guest && (
          <>
            <div className="sh-hero">
              <Avatar person={guest} />
              <div className="sh-name">{guest.name}</div>
            </div>
            {guest.intro && <div className="sh-intro">{guest.intro}</div>}
            <Field label="怎麼認識 Simon" value={guest.howMet} />
            <Field label="認識多久" value={guest.howLong} />
            <Field label={`在 ${guest.name} 心中，Simon 是`} value={guest.simonIs} />
            <Field label="觀察到 Simon 最大的改變" value={guest.change} />
          </>
        )}
      </div>
    </>
  )
}
