import { useState } from 'react'
import { config } from '../data/payload'
import { usePop } from '../hooks/useSfx'
import charImg from '../asset/simon_char.png'
import logoImg from '../asset/logo_m310.png'
import { useTypewriter } from '../hooks/useTypewriter'

// 啟動畫面：角色從畫面下方升起，上方顯示歡迎詞，
// 下方 CTA「參與聚會」點擊後呼叫 onStart 進入 PIN 頁。
export default function Splash({ onStart }) {
  const pop = usePop()
  // 第二行「Simon 的生日小聚」打字機效果，等進場動畫後才開始打字。
  const typed = useTypewriter('Simon 的生日小聚', { speed: 130, delay: 900 })
  // 轉場：橘色圓形從點擊處放大覆蓋全畫面，動畫結束後進入 Gate。
  const [reveal, setReveal] = useState(null) // null | {x, y}

  const handleStart = (e) => {
    pop()
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { onStart(); return }
    const rect = e.currentTarget.getBoundingClientRect()
    setReveal({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <section className="splash">
      <div className="splash-top">
        <svg className="splash-hi" viewBox="0 30 380 92" aria-label="Welcome">
          <defs>
            <path id="welcomeArc" d="M 20 140 A 240 200 0 0 1 360 140" fill="none" />
          </defs>
          <text>
            <textPath href="#welcomeArc" startOffset="50%" textAnchor="middle">
              Welcome
            </textPath>
          </text>
        </svg>
        <h1 className="splash-title">
          歡迎你來到<br />
          <span className="tw">
            {typed.text}
            <span className={`tw-caret${typed.done ? ' done' : ''}`} />
          </span>
        </h1>
        <div className="splash-meta">{config.meta}</div>
      </div>

      <div className="splash-char">
        <img src={charImg} alt="Simon" draggable="false" />
      </div>

      <img className="splash-logo" src={logoImg} alt="M310" draggable="false" />

      <button className="splash-cta" onClick={handleStart} disabled={!!reveal}>
        <span className="cta-edge" />
        <span className="cta-front">
          馬上進入會場
          <svg className="cta-arrow" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
          </svg>
        </span>
      </button>

      {reveal && (
        <span
          className="splash-reveal"
          style={{ left: reveal.x, top: reveal.y }}
          onAnimationEnd={onStart}
        />
      )}
    </section>
  )
}
