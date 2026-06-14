import Avatar from './Avatar'
import Field from './Field'

// 來賓詳細的底部彈出 sheet。guest 為 null 時收合。
export default function GuestSheet({ guest, onClose }) {
  return (
    <>
      <div
        className={`sheet-bg${guest ? ' show' : ''}`}
        onClick={onClose}
        style={{ viewTransitionName: 'g-backdrop' }}
      />
      <div
        className={`sheet${guest ? ' show' : ''}`}
        style={guest ? { viewTransitionName: 'g-active-box' } : undefined}
      >
        <div className="sheet-handle" />
        {guest && (
          <>
            <button className="sh-close" onClick={onClose} aria-label="關閉">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6 18 18 M18 6 6 18" />
              </svg>
            </button>
            <div className="sh-hero">
              <Avatar person={guest} vt="g-active-av" />
              <div className="sh-name" style={{ viewTransitionName: 'g-active-name' }}>{guest.name}</div>
            </div>
            <div className="sh-details" style={{ viewTransitionName: 'g-details' }}>
              {guest.intro && <div className="sh-intro">{guest.intro}</div>}
              <Field label="怎麼認識 Simon" value={guest.howMet} />
              <Field label="跟 Simon 認識多久" value={guest.howLong} />
              <Field label={`在 ${guest.name} 心中，Simon 是`} value={guest.simonIs} />
              <Field label="觀察到 Simon 最大的改變" value={guest.change} />
            </div>
          </>
        )}
      </div>
    </>
  )
}
