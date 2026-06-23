import { useState, useEffect, useCallback, useRef } from 'react'
import { config, people } from '../data/payload'
import Avatar from './Avatar'

// 簡報 deck：網址 /slides 或 ?slides 進入（見 App.jsx），跳過 Splash / Gate。
// 三種檢視：grid 格狀總覽（預設）/ list 列表總覽 / present 全螢幕簡報。
//   - 總覽用右上 toolbar 切 列表/格狀，「全螢幕模式」或點任一頁 → 進 present。
//   - present 用真・瀏覽器全螢幕（requestFullscreen），ESC / ✕ 退回總覽。
// 5 頁 deck：介紹活動 → 派對資訊 → 來賓 → 給大家的話 → 感謝。
// 內容都是純文字，之後直接改這個檔案即可。縮圖直接縮放真實卡片（cqh/cqw 自動縮放）。

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
  const [view, setView] = useState('grid') // 'grid' | 'list' | 'present'
  const last = slides.length - 1
  const presenting = view === 'present'
  const containerRef = useRef(null)
  const prevViewRef = useRef('grid') // 進 present 前的總覽模式，退出時還原

  const go = useCallback((n) => setI((cur) => Math.max(0, Math.min(last, n))), [last])
  const next = useCallback(() => go(i + 1), [go, i])
  const prev = useCallback(() => go(i - 1), [go, i])

  // 進入簡報：記住目前頁，切到 present，並要求真・全螢幕（不支援則降級為頁內 overlay）
  const enterPresent = useCallback((n) => {
    if (view !== 'present') prevViewRef.current = view
    setI(Math.max(0, Math.min(last, n)))
    setView('present')
    containerRef.current?.requestFullscreen?.().catch(() => {})
  }, [view, last])

  const exitPresent = useCallback(() => {
    setView(prevViewRef.current || 'grid')
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
  }, [])

  // 全螢幕被使用者用 ESC / 系統手勢關掉時，同步退出 present
  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement && view === 'present') setView(prevViewRef.current || 'grid')
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [view])

  // 鍵盤：present 時左右 / 空白鍵切頁，Esc 退出
  useEffect(() => {
    if (!presenting) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'Escape') exitPresent()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [presenting, next, prev, exitPresent])

  // 觸控：present 時左右滑切頁
  const [touchX, setTouchX] = useState(null)
  const onTouchStart = (e) => { if (presenting) setTouchX(e.touches[0].clientX) }
  const onTouchEnd = (e) => {
    if (!presenting || touchX == null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (dx < -40) next()
    else if (dx > 40) prev()
    setTouchX(null)
  }

  // 螢光圓點游標：present 時跟著滑鼠移動，靜止一段時間後淡出
  const cursorRef = useRef(null)
  useEffect(() => {
    if (!presenting) return
    const dot = cursorRef.current
    if (!dot) return
    let hideId
    const onMove = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      dot.classList.add('on')
      clearTimeout(hideId)
      hideId = setTimeout(() => dot.classList.remove('on'), 2200)
    }
    window.addEventListener('pointermove', onMove)
    return () => { window.removeEventListener('pointermove', onMove); clearTimeout(hideId) }
  }, [presenting])

  // ===== 簡報模式 =====
  if (presenting) {
    const Slide = slides[i]
    return (
      <div className="slides" ref={containerRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="sl-cursor" ref={cursorRef} />
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

        <button className="sl-exit" onClick={exitPresent} aria-label="退出簡報">✕</button>
        <div className="sl-page">{i + 1} / {slides.length}</div>
      </div>
    )
  }

  // ===== 總覽：列表 / 格狀 =====
  return (
    <div className="slides-viewer" ref={containerRef}>
      <div className="sl-toolbar">
        <div className="sl-seg" role="tablist" aria-label="檢視模式">
          <button
            className={`sl-seg-btn${view === 'list' ? ' on' : ''}`}
            onClick={() => setView('list')}
            role="tab" aria-selected={view === 'list'}
          >列表</button>
          <button
            className={`sl-seg-btn${view === 'grid' ? ' on' : ''}`}
            onClick={() => setView('grid')}
            role="tab" aria-selected={view === 'grid'}
          >格狀</button>
        </div>
        <button className="sl-fs-btn" onClick={() => enterPresent(i)}>
          全螢幕模式
        </button>
      </div>

      <div className="sl-overview">
        <div className={`sl-deck sl-${view}`}>
          {slides.map((Slide, n) => (
            <div className="sl-tile" key={n}>
              <div className="sl-tile-label">PAGE {n + 1}</div>
              <button
                className="sl-thumb"
                onClick={() => enterPresent(n)}
                aria-label={`簡報第 ${n + 1} 頁`}
              >
                <div className="sl-card">
                  <Slide />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
