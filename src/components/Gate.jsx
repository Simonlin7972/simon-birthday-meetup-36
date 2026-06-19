import { useState, useCallback, useRef } from 'react'
import { people } from '../data/payload'
import { useKey, usePop, useFanfare } from '../hooks/useSfx'
import logoImg from '../asset/logo_m310.png'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del']
const CONFETTI_COLORS = ['#e88b3a', '#f0a45a', '#c75b3f', '#804220', '#4a3322', '#f5ecdd']

// 入場畫面：輸入 4 位數 PIN，正確後呼叫 onEnter(person)。
export default function Gate({ onEnter }) {
  const key = useKey()
  const pop = usePop()
  const fanfare = useFanfare()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [expanding, setExpanding] = useState(false)
  const btnRef = useRef(null)
  const circleRef = useRef(null)

  const submit = useCallback((value) => {
    const found = people.find((p) => p.pin === value)
    if (found) {
      // 取得按鈕中心位置，從那裡展開圓圈
      const btn = btnRef.current
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // 計算需要多大的半徑才能覆蓋整個螢幕
      const maxDist = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(window.innerWidth - cx, cy),
        Math.hypot(cx, window.innerHeight - cy),
        Math.hypot(window.innerWidth - cx, window.innerHeight - cy)
      )
      const circle = circleRef.current
      circle.style.left = cx + 'px'
      circle.style.top = cy + 'px'
      circle.style.setProperty('--radius', maxDist + 'px')
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      setExpanding(true)
      if (!reduce) fanfare()
      // 撒花 + 轉場展示後再進主畫面（減少動態時直接進入）
      setTimeout(() => onEnter(found), reduce ? 300 : 1500)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 440)
      setPin('')
    }
  }, [fanfare, onEnter])

  const press = useCallback((k) => {
    key()
    setError(false)
    setPin((prev) => {
      let next = prev
      if (k === 'del') next = prev.slice(0, -1)
      else if (k === 'clear') next = ''
      else if (prev.length < 4) next = prev + k
      return next
    })
  }, [])

  const confirm = useCallback(() => {
    if (pin.length !== 4) return
    pop()
    submit(pin)
  }, [pin, pop, submit])

  return (
    <section className="gate">
      <div className={`pin-wrap${shake ? ' shake' : ''}`}>
        <img className="pin-logo" src={logoImg} alt="M310" draggable="false" />
        <div className="pin-hint">輸入你的專屬 PIN 入場</div>
        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`pin-dot${i < pin.length ? ' on' : ''}`} />
          ))}
        </div>
        <div className={`pin-err${error ? ' show' : ''}`}>PIN 不正確，再試一次</div>
        <div className="keypad">
          {KEYS.map((k) => (
            <button
              key={k}
              className={`key${k === 'clear' || k === 'del' ? ' fn' : ''}`}
              onClick={() => press(k)}
            >
              <span className="key-face">
                {k === 'clear' ? '清除' : k === 'del' ? '⌫' : k}
              </span>
            </button>
          ))}
        </div>
        <button
          ref={btnRef}
          className="gate-submit"
          onClick={confirm}
          disabled={pin.length !== 4}
        >
          <span className="cta-edge" />
          <span className="cta-front">報到完成</span>
        </button>
      </div>
      <div
        ref={circleRef}
        className={`gate-circle${expanding ? ' go' : ''}`}
      />
      {expanding && (
        <div className="confetti-container gate-confetti">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                '--x': `${Math.random() * 100}vw`,
                '--delay': `${Math.random() * 0.4}s`,
                '--color': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                '--rot': `${Math.random() * 360}deg`,
                '--dur': `${1 + Math.random() * 1.2}s`,
                width: i % 3 === 0 ? '8px' : '12px',
                height: i % 3 === 0 ? '12px' : '8px',
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
