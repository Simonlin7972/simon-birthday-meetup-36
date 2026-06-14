import { useState, useCallback } from 'react'
import { people } from '../data/payload'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del']

// 入場畫面：輸入 4 位數 PIN，正確後呼叫 onEnter(person)。
export default function Gate({ onEnter }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const submit = useCallback((value) => {
    const found = people.find((p) => p.pin === value)
    if (found) {
      onEnter(found)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 440)
      setPin('')
    }
  }, [onEnter])

  const press = useCallback((k) => {
    setError(false)
    setPin((prev) => {
      let next = prev
      if (k === 'del') next = prev.slice(0, -1)
      else if (k === 'clear') next = ''
      else if (prev.length < 4) next = prev + k
      if (next.length === 4) setTimeout(() => submit(next), 140)
      return next
    })
  }, [submit])

  return (
    <section className="gate">
      <div className={`pin-wrap${shake ? ' shake' : ''}`}>
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
              {k === 'clear' ? '清除' : k === 'del' ? '⌫' : k}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
