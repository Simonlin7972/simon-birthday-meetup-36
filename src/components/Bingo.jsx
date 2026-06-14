import { useState, useEffect, useRef } from 'react'

const TASKS = [
  { id: 0, text: '找到和自己一樣 MBTI 的朋友，請他簽名', type: 'text', placeholder: '朋友的名字' },
  { id: 1, text: '上衣顏色穿一樣的朋友，一起拍張照片', type: 'check' },
  { id: 2, text: '找一位現場你不認識的朋友，請他簽名', type: 'text', placeholder: '朋友的名字' },
  { id: 3, text: '找跟 Simon 認識超過五年的，請他簽名', type: 'text', placeholder: '朋友的名字' },
  { id: 4, text: '目前正職工作「不是」設計師的，請他簽名', type: 'text', placeholder: '朋友的名字' },
  { id: 5, text: '請寫出 Simon 的中文名字（可以現場用問的）', type: 'text', placeholder: 'Simon 的中文名字' },
  { id: 6, text: '跟你不認識的新朋友交換一個興趣', type: 'text', placeholder: '交換到的興趣' },
  { id: 7, text: '在「台灣以外」的地方跟 Simon 見過面的人，請他寫下地點＋名字', type: 'text', placeholder: '地點 + 名字' },
  { id: 8, text: '過去曾經和 Simon 一起工作過，請他簽名', type: 'text', placeholder: '朋友的名字' },
]

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = Math.abs(seed) || 1
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647
    const j = s % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function hashId(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = h * 31 + id.charCodeAt(i)
  return h
}

const CONFETTI_COLORS = ['#e88b3a', '#f0a45a', '#c75b3f', '#804220', '#4a3322', '#f5ecdd']

export default function Bingo({ me }) {
  const storageKey = `bingo_${me.id}`
  const inputRef = useRef(null)

  const [order] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) return JSON.parse(saved).order
    return seededShuffle([0, 1, 2, 3, 4, 5, 6, 7, 8], hashId(me.id))
  })

  const [cells, setCells] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) return JSON.parse(saved).cells
    return Array(9).fill(null)
  })

  const [activeCell, setActiveCell] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const [showBingo, setShowBingo] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ order, cells }))
  }, [cells, order, storageKey])

  const completedLines = LINES.filter(line => line.every(i => cells[i]))
  const isBingo = completedLines.length >= 2
  const inLineSet = new Set(completedLines.flat())

  useEffect(() => {
    if (isBingo && !localStorage.getItem(`${storageKey}_celebrated`)) {
      setShowBingo(true)
      localStorage.setItem(`${storageKey}_celebrated`, '1')
    }
  }, [isBingo, storageKey])

  useEffect(() => {
    if (activeCell !== null && inputRef.current) inputRef.current.focus()
  }, [activeCell])

  const handleCellClick = (index) => {
    if (cells[index]) return
    const task = TASKS[order[index]]
    if (task.type === 'check') {
      const next = [...cells]
      next[index] = '✓'
      setCells(next)
    } else {
      setActiveCell(index)
      setInputVal('')
    }
  }

  const handleSubmit = () => {
    if (!inputVal.trim()) return
    const next = [...cells]
    next[activeCell] = inputVal.trim()
    setCells(next)
    setActiveCell(null)
  }

  const completedCount = cells.filter(Boolean).length

  return (
    <div className="screen screen-bingo">
      <div className="h-title h-title-bold">派對賓果</div>
      <div className="h-sub">和現場朋友互動，完成任務連成兩條線就 BINGO！</div>

      <div className="bingo-status">
        <span>{completedCount}/9 完成</span>
        <span className="bingo-status-dot" />
        <span>{completedLines.length}/2 條線</span>
        {isBingo && (
          <button className="bingo-replay" onClick={() => setShowBingo(true)}>
            BINGO!
          </button>
        )}
      </div>

      <div className="bingo-grid">
        {order.map((taskIdx, cellIdx) => {
          const task = TASKS[taskIdx]
          const done = !!cells[cellIdx]
          const inLine = inLineSet.has(cellIdx)
          return (
            <button
              key={cellIdx}
              className={`bingo-cell${done ? ' done' : ''}${inLine ? ' in-line' : ''}`}
              onClick={() => handleCellClick(cellIdx)}
            >
              {done && <span className="bingo-check">✓</span>}
              <span className="bingo-task">{task.text}</span>
              {done && cells[cellIdx] !== '✓' && (
                <span className="bingo-answer">{cells[cellIdx]}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Input modal */}
      {activeCell !== null && (
        <>
          <div className="bingo-overlay" onClick={() => setActiveCell(null)} />
          <div className="bingo-modal">
            <div className="bingo-modal-task">{TASKS[order[activeCell]].text}</div>
            <input
              ref={inputRef}
              className="bingo-input"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={TASKS[order[activeCell]].placeholder}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button className="bingo-submit" onClick={handleSubmit} disabled={!inputVal.trim()}>
              <span className="cta-edge" />
              <span className="cta-front bingo-submit-front">確認完成</span>
            </button>
          </div>
        </>
      )}

      {/* Bingo celebration */}
      {showBingo && (
        <div className="bingo-celebrate" onClick={() => setShowBingo(false)}>
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  '--x': `${Math.random() * 100}vw`,
                  '--delay': `${Math.random() * 0.6}s`,
                  '--color': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                  '--rot': `${Math.random() * 360}deg`,
                  '--dur': `${1.2 + Math.random() * 1.4}s`,
                  width: i % 3 === 0 ? '8px' : '12px',
                  height: i % 3 === 0 ? '12px' : '8px',
                }}
              />
            ))}
          </div>
          <div className="bingo-celebrate-card">
            <div className="bingo-celebrate-title">BINGO!</div>
            <div className="bingo-celebrate-msg">恭喜完成兩條線！</div>
            <div className="bingo-celebrate-hint">點擊任意處關閉</div>
          </div>
        </div>
      )}
    </div>
  )
}
