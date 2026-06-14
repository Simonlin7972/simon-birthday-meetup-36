import { useRef, useState } from 'react'

// Simon 的生日：7/2 → 0702。輸入正確才能看到「給你的話」。
const CODE = '0702'

// 「給你的話」：先輸入通關密碼（Simon 生日 0702），通過後顯示 Simon 寫給這位來賓的話。
export default function Message({ me }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const submit = (value) => {
    if (value === CODE) {
      setUnlocked(true)
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
          <div className="msg-gate-mark">🔒</div>
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
          <div className="code-tip">提示：Simon 的生日（月月日日）</div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="msg-wrap">
        <div className="msg-from">Simon 給 {me.name} 的話</div>
        {me.fromSimon ? (
          <>
            <div className="msg-mark">“</div>
            <div className="msg-body">{me.fromSimon}</div>
            <div className="msg-sign">
              — <b>Simon</b>
            </div>
          </>
        ) : (
          <div className="msg-empty">
            Simon 正在為你寫一句話 ✍️
            <br />
            當天見面時親口告訴你。
          </div>
        )}
      </div>
    </div>
  )
}
