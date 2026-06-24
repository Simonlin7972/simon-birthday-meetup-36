import { useState, useEffect, useCallback, useRef } from 'react'
import { config, people } from '../data/payload'
import Avatar from './Avatar'
import gateShot from '../asset/slide_gate.png'
import bingoShot from '../asset/slide_bingo.png'

// P4 Gate / P5 Bingo 直接放實際截圖（.slm-shot 用 cqh，縮圖 / present 同步縮放）。
function GateMock() {
  return <img className="slm-shot" src={gateShot} alt="PIN 入場畫面" draggable="false" />
}
function BingoMock() {
  return <img className="slm-shot" src={bingoShot} alt="賓果遊戲畫面" draggable="false" />
}

// 簡報 deck：網址 /slides 或 ?slides 進入（見 App.jsx），跳過 Splash / Gate。
// 三種檢視：grid 格狀總覽（預設）/ list 列表總覽 / present 全螢幕簡報。
//   - 總覽用右上 toolbar 切 列表/格狀，「全螢幕模式」或點任一頁 → 進 present。
//   - present 用真・瀏覽器全螢幕（requestFullscreen），ESC / ✕ 退回總覽。
// 10 頁 deck（現場流程簡報）：封面 → 來賓 → Agenda → 開 App → 賓果 → 悄悄話
//   → 朋友分享 → 蛋糕 → 大合照 → 感謝。（編號沿用 P1–P11 但無 P7。）
// 內容都是純文字 / placeholder，之後直接改這個檔案即可。縮圖直接縮放真實卡片（cqh/cqw 自動縮放）。
// 缺圖頁先放 .sl-ph placeholder 框；之後丟圖進 src/asset/ 再把框換成 <img>。


// 每頁一個物件，render 回傳該頁主體。改文案改這裡。
const slides = [
  // P1. 封面
  () => (
    <div className="sl-body">
      <h1 className="sl-title">{config.title}</h1>
      <h2 className="sl-title2">{config.title2}</h2>
      <p className="sl-lead">
        三十六歲，是個分號，不是句點。<br />
        在離開台灣前，想把這些年遇到的你們，好好聚在一起。
      </p>
      <div className="sl-host">by {config.host}</div>
    </div>
  ),

  // P2. 今天的來賓
  () => (
    <div className="sl-guests-page">
      <h2 className="sl-h2" style={{ textAlign: 'center', padding: '3cqh 0 1.5cqh' }}>歡迎大家參加今天的活動！</h2>
      <div className="sl-av-grid">
        {people.map((p) => (
          <Avatar key={p.id} person={p} className="sl-av" />
        ))}
      </div>
      <p className="sl-lead" style={{ textAlign: 'center', padding: '1.5cqh 0' }}>大學同學、前同事、設計圈好朋友、創業/社群夥伴</p>
    </div>
  ),

  // P3. Agenda
  () => (
    <div className="sl-body">
      <h2 className="sl-h2">今天活動的流程</h2>
      <div className="sl-agenda">
        <div className="sl-agenda-row">
          <span className="sl-agenda-time">19:00–19:30</span>
          <span className="sl-agenda-desc">歡迎大家 + 吃吃喝喝！</span>
        </div>
        <div className="sl-agenda-row">
          <span className="sl-agenda-time">19:30–20:00</span>
          <span className="sl-agenda-desc">小遊戲時間</span>
        </div>
        <div className="sl-agenda-row">
          <span className="sl-agenda-time">20:00–21:30</span>
          <span className="sl-agenda-desc">等等就知道 :)</span>
        </div>
        <div className="sl-agenda-row">
          <span className="sl-agenda-time">21:30</span>
          <span className="sl-agenda-desc">大家一起大合照！</span>
        </div>
        <div className="sl-agenda-row">
          <span className="sl-agenda-time">21:30–22:00</span>
          <span className="sl-agenda-desc">自由交流時間</span>
        </div>
      </div>
    </div>
  ),

  // P4. 打開今天活動 App
  () => (
    <div className="sl-body sl-split">
      <div className="sl-split-text">
        <h2 className="sl-h2">用這個 APP 來<br />體驗今天的活動</h2>
        <p className="sl-lead">登入方式：<span className="sl-hl">使用你手上的 PIN 碼</span></p>
      </div>
      <div className="sl-split-media">
        <GateMock />
      </div>
    </div>
  ),

  // P5. 賓果遊戲時間
  () => (
    <div className="sl-body sl-split">
      <div className="sl-split-text">
        <h2 className="sl-h2">賓果遊戲時間</h2>
        <div className="sl-pass">
          <span className="sl-pass-label">輸入 Simon 的生日當作密碼</span>
          <span className="sl-pass-code">0702</span>
        </div>
      </div>
      <div className="sl-split-media">
        <BingoMock />
      </div>
    </div>
  ),

  // P6. 悄悄話
  () => (
    <div className="sl-body sl-split">
      <div className="sl-split-text">
        <h2 className="sl-h2">Simon 想和大家<br />說的悄悄話</h2>
        <div className="sl-pass">
          <span className="sl-pass-label">密碼</span>
          <span className="sl-pass-code">PIN 碼反著打</span>
        </div>
      </div>
      <div className="sl-split-media">
        <div className="sl-ph sl-ph-ui">悄悄話頁面 UI 圖待上傳</div>
      </div>
    </div>
  ),

  // P8. 朋朋們的分享時間
  () => (
    <div className="sl-body">
      <h2 className="sl-h2">好朋友們的<br />分享時間</h2>
      <p className="sl-lead">把麥克風交給你們，說說我們之間的故事。</p>
    </div>
  ),

  // P9. Happy Birthday
  () => (
    <div className="sl-body sl-split">
      <div className="sl-split-text">
        <h1 className="sl-title">Happy<br />Birthday</h1>
      </div>
      <div className="sl-split-media">
        <div className="sl-ph sl-ph-icon">🎂 蛋糕 icon 待補</div>
      </div>
    </div>
  ),

  // P10. 大合照時間
  () => (
    <div className="sl-body sl-split">
      <div className="sl-split-text">
        <h2 className="sl-h2">大合照時間</h2>
      </div>
      <div className="sl-split-media">
        <div className="sl-ph sl-ph-icon">📷 相機 icon 待補</div>
      </div>
    </div>
  ),

  // P11. Thank you
  () => (
    <div className="sl-body">
      <h1 className="sl-title sl-thanks">謝謝大家</h1>
      <p className="sl-lead">期待下次再相見！</p>
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
  // 對 documentElement（穩定、永不卸載）要求全螢幕，而非對切換時會被卸載的
  // .slides-viewer / .slides 節點——否則退出全螢幕時被卸載的「全螢幕元素」會讓
  // Chromium 殘留錯誤的版面位移（toolbar 退出後跑版）。
  const enterPresent = useCallback((n) => {
    if (view !== 'present') prevViewRef.current = view
    setI(Math.max(0, Math.min(last, n)))
    setView('present')
    document.documentElement.requestFullscreen?.().catch(() => { })
  }, [view, last])

  const exitPresent = useCallback(() => {
    setView(prevViewRef.current || 'grid')
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => { })
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

  const PresentSlide = slides[i]

  // 總覽永遠掛載，present 以 overlay 疊在上層 —— 不做分支切換（不卸載/重掛總覽）。
  // 原因：退出原生全螢幕的轉場期間若 React 重建總覽 DOM，新節點會繼承到 Chromium
  // 殘留的錯誤版面（fixed 容器的 containing block 尚未 reflow），導致 toolbar 跑版。
  // 實測：總覽全程不被卸載時，全螢幕進出 12/12 皆正常。present overlay 本身進出不影響。
  return (
    <>
      {/* ===== 總覽：列表 / 格狀（永遠掛載）===== */}
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

      {/* ===== 簡報 overlay（疊在總覽上層）===== */}
      {presenting && (
        <div className="slides" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="sl-cursor" ref={cursorRef} />
          <div className="sl-stage">
            <div className="sl-card" key={i}>
              <PresentSlide />
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
      )}
    </>
  )
}
