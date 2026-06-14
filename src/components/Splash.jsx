import { config } from '../data/payload'
import charImg from '../asset/simon_char.png'

// 啟動畫面：角色從畫面下方升起，上方顯示歡迎詞，
// 下方 CTA「參與聚會」點擊後呼叫 onStart 進入 PIN 頁。
export default function Splash({ onStart }) {
  return (
    <section className="splash">
      <div className="splash-top">
        <svg className="splash-hi" viewBox="0 0 320 120" aria-label="Welcome">
          <defs>
            <path id="welcomeArc" d="M 28 118 A 200 150 0 0 1 292 118" fill="none" />
          </defs>
          <text>
            <textPath href="#welcomeArc" startOffset="50%" textAnchor="middle">
              Welcome
            </textPath>
          </text>
        </svg>
        <h1 className="splash-title">
          歡迎來到<br />Simon 的生日小聚
        </h1>
        <div className="splash-meta">{config.meta}</div>
      </div>

      <div className="splash-char">
        <img src={charImg} alt="Simon" draggable="false" />
      </div>

      <button className="splash-cta" onClick={onStart}>
        <span className="cta-edge" />
        <span className="cta-front">參與聚會</span>
      </button>
    </section>
  )
}
