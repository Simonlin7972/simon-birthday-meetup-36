import { useState, useEffect, useCallback } from 'react'
import { config, people } from '../data/payload'
import Avatar from './Avatar'

// 簡報模式：網址 /slides 或 ?slides 進入（見 App.jsx），跳過 Splash / Gate。
// 5 頁 deck：介紹活動 → 派對資訊 → 來賓 → 給大家的話 → 感謝。
// 內容都是純文字，之後直接改這個檔案即可。手機優先、直式。

// 每頁一個物件，render 回傳該頁主體。改文案改這裡。
const slides = [
  // 1. 封面 / 介紹活動
  () => (
    <div className="sl-body sl-cover">
      <div className="sl-kicker">{config.subtitle}</div>
      <h1 className="sl-title">{config.title}</h1>
      <h2 className="sl-title2">{config.title2}</h2>
      <p className="sl-lead">
        三十六歲，是個分號，不是句點。<br />
        在離開台灣前，想把這些年遇到的你們，好好聚在一起。
      </p>
      <div className="sl-host">by {config.host}</div>
    </div>
  ),

  // 2. 派對資訊
  () => (
    <div className="sl-body">
      <div className="sl-kicker">活動資訊</div>
      <h2 className="sl-h2">時間 & 地點</h2>
      <div className="sl-info">
        <div className="sl-info-row">
          <span className="sl-info-label">日期</span>
          <span className="sl-info-val">2026 / 6 / 26（五）</span>
        </div>
        <div className="sl-info-row">
          <span className="sl-info-label">場地</span>
          <span className="sl-info-val">M310</span>
        </div>
        <div className="sl-info-row">
          <span className="sl-info-label">主題</span>
          <span className="sl-info-val">生日 & 告別派對</span>
        </div>
      </div>
      <p className="sl-lead">帶上你自己就好，其他交給今晚。</p>
    </div>
  ),

  // 3. 來賓
  () => (
    <div className="sl-body">
      <div className="sl-kicker">今晚的人</div>
      <h2 className="sl-h2">{people.length} 位朋友</h2>
      <p className="sl-lead">大學室友、前同事、設計圈、社群夥伴⋯⋯各種緣分，今晚同框。</p>
      <div className="sl-avatars">
        {people.slice(0, 24).map((p) => (
          <Avatar key={p.id} person={p} className="sl-av" />
        ))}
      </div>
    </div>
  ),

  // 4. 給大家的話
  () => (
    <div className="sl-body">
      <div className="sl-kicker">想說的話</div>
      <h2 className="sl-h2">謝謝你們，<br />陪我走到這裡</h2>
      <p className="sl-quote">
        「有人陪我八年，有人才認識一個月，<br />
        但你們每一個，都在我這趟路上留下了東西。」
      </p>
    </div>
  ),

  // 5. 感謝
  () => (
    <div className="sl-body sl-cover">
      <div className="sl-kicker">See you there</div>
      <h1 className="sl-title sl-thanks">謝謝大家</h1>
      <p className="sl-lead">6/26，M310 見。<br />帶著故事來，帶著祝福走。</p>
      <div className="sl-host">— {config.host}</div>
    </div>
  ),
]

export default function Slides() {
  const [i, setI] = useState(0)
  const last = slides.length - 1

  const go = useCallback((n) => setI((cur) => Math.max(0, Math.min(last, n))), [last])
  const next = useCallback(() => go(i + 1), [go, i])
  const prev = useCallback(() => go(i - 1), [go, i])

  // 鍵盤：左右 / 空白鍵切頁
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // 觸控：左右滑切頁
  const [touchX, setTouchX] = useState(null)
  const onTouchStart = (e) => setTouchX(e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX == null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (dx < -40) next()
    else if (dx > 40) prev()
    setTouchX(null)
  }

  const Slide = slides[i]

  return (
    <div className="slides" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="sl-stage">
        <div className="sl-card" key={i}>
          <Slide />
        </div>
      </div>

      {/* 點點導覽 */}
      <div className="sl-dots">
        {slides.map((_, n) => (
          <button
            key={n}
            className={`sl-dot${n === i ? ' on' : ''}`}
            onClick={() => go(n)}
            aria-label={`第 ${n + 1} 頁`}
          />
        ))}
      </div>

      {/* 左右點擊區 */}
      <button className="sl-nav sl-prev" onClick={prev} disabled={i === 0} aria-label="上一頁" />
      <button className="sl-nav sl-next" onClick={next} disabled={i === last} aria-label="下一頁" />

      <div className="sl-page">{i + 1} / {slides.length}</div>
    </div>
  )
}
