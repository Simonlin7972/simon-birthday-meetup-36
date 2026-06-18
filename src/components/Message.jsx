import { useRef, useState, useEffect } from 'react'
import illustrationMessage from '../asset/illustration_message.png'

// 「給你的話」：先輸入通關密碼（來賓 PIN 反轉），通過後顯示 Simon 寫給這位來賓的話。
export default function Message({ me, onUnlockedChange = () => {} }) {
  const CODE = me.pin.split('').reverse().join('')
  const [digits, setDigits] = useState(['', '', '', ''])
  const [unlocked, setUnlocked] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [typed, setTyped] = useState('')
  const [showSign, setShowSign] = useState(false)
  const [cursorDone, setCursorDone] = useState(false)
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const bodyText = me.fromSimon || ''

  // 解鎖後播放信封動畫，結束才讓信紙就定位（reduced-motion 直接跳過）
  useEffect(() => {
    if (!unlocked) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setRevealed(true)
      return
    }
    const id = setTimeout(() => setRevealed(true), 3050)
    return () => clearTimeout(id)
  }, [unlocked])

  useEffect(() => {
    if (!revealed || !bodyText) return
    setTyped('')
    setShowSign(false)
    setCursorDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(bodyText.slice(0, i))
      if (i >= bodyText.length) {
        clearInterval(id)
        setTimeout(() => setShowSign(true), 400)
        setTimeout(() => setCursorDone(true), 1200)
      }
    }, 105)
    return () => clearInterval(id)
  }, [revealed, bodyText])

  const submit = (value) => {
    if (value === CODE) {
      setUnlocked(true)
      onUnlockedChange(true)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 440)
      setDigits(['', '', '', ''])
      refs[0].current?.focus()
    }
  }

  const handleChange = (i, raw) => {
    const v = raw.replace(/\D/g, '').slice(-1) // 只取最後輸入的數字
    setError(false)
    setDigits((prev) => {
      const next = [...prev]
      next[i] = v
      if (v && i < 3) refs[i + 1].current?.focus()
      if (next.every((d) => d !== '')) setTimeout(() => submit(next.join('')), 140)
      return next
    })
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      e.preventDefault()
      refs[i - 1].current?.focus()
      setDigits((prev) => {
        const next = [...prev]
        next[i - 1] = ''
        return next
      })
    }
  }

  if (!unlocked) {
    return (
      <div className="screen">
        <div className="msg-gate">
          <img src={illustrationMessage} alt="" className="msg-gate-illust" />
          <div className="msg-gate-title">給 {me.name} 的悄悄話</div>
          <div className="msg-gate-hint">輸入通關密碼解鎖</div>
          <div className={`code-boxes${shake ? ' shake' : ''}`}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                className={`code-box${d ? ' filled' : ''}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                aria-label={`密碼第 ${i + 1} 碼`}
              />
            ))}
          </div>
          <div className={`code-err${error ? ' show' : ''}`}>密碼不對，再試一次 🤔</div>
        </div>
      </div>
    )
  }

  const exitMessage = () => {
    setUnlocked(false)
    setRevealed(false)
    onUnlockedChange(false)
    setDigits(['', '', '', ''])
    setError(false)
  }

  return (
    <div className="screen screen-letter">
      <button className="bingo-exit" onClick={exitMessage}>{"回到主頁"}</button>
      {!revealed && (
        <div className="env-stage" aria-hidden="true">
          <div className="env">
            <div className="env-body" />
            <div className="env-letter">
              <span className="env-letter-line" />
              <span className="env-letter-line" />
              <span className="env-letter-line short" />
            </div>
            <div className="env-pocket" />
            <div className="env-flap" />
            <div className="env-seal">S</div>
          </div>
        </div>
      )}
      <div className={`letter${revealed ? ' in' : ' pre'}`}>
        <div className="letter-lines" />
        <div className="letter-content">
          <div className="letter-to">Dear {me.name},</div>
          {bodyText ? (
            <>
              <div className="letter-body">
                {typed}
                <span className={`letter-cursor${cursorDone ? ' done' : ''}`} />
              </div>
              <div className={`letter-sign${showSign ? ' show' : ''}`}>
                {"— Simon"}
              </div>
            </>
          ) : (
            <div className="msg-empty">
              {"Simon 正在為你寫一封信..."}
              <br />
              {"當天見面時親口告訴你。"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
