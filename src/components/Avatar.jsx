// 依名字產生固定的漸層頭像；若有 photo 則顯示照片。
// className 用來套用不同尺寸（pf-av / sh-hero 等）。
// 彩蛋：雙擊頭像會彈跳旋轉 + 噴出 confetti，配 pop 音效。
import { useRef } from 'react'
import { usePop } from '../hooks/useSfx'

const CONFETTI_COLORS = ['#ff7a1a', '#ffd23f', '#5ec5b5', '#ff5d8f', '#7c5cff', '#fbf3e6']

export default function Avatar({ person, className = '', vt }) {
  let h = 0
  for (const c of person.name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const a = h % 360
  const b = (a + 38) % 360
  const ch = person.name.trim()[0] || '?'

  const ref = useRef(null)
  const pop = usePop()

  const style = {
    ...(person.photo
      ? { backgroundImage: `url('${person.photo}')` }
      : { backgroundImage: `linear-gradient(135deg,hsl(${a} 62% 60%),hsl(${b} 70% 50%))` }),
    ...(vt ? { viewTransitionName: vt } : {}),
  }

  function burst() {
    const el = ref.current
    if (!el) return

    // 彈跳旋轉：重設動畫好讓連續雙擊都能再次觸發
    el.classList.remove('av-bounce')
    void el.offsetWidth
    el.classList.add('av-bounce')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    pop()

    // confetti 噴在 body 上（fixed 定位），避開 .av 的 overflow:hidden
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const n = 14
    for (let i = 0; i < n; i++) {
      const p = document.createElement('div')
      p.className = 'av-confetti'
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5
      const dist = 36 + Math.random() * 40
      p.style.left = cx + 'px'
      p.style.top = cy + 'px'
      p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px')
      p.style.setProperty('--dy', Math.sin(ang) * dist + 'px')
      p.style.setProperty('--rot', Math.random() * 540 - 270 + 'deg')
      document.body.appendChild(p)
      p.addEventListener('animationend', () => p.remove())
    }
  }

  return (
    <div
      ref={ref}
      className={`av ${className}`}
      style={style}
      onDoubleClick={burst}
    >
      {!person.photo && <span>{ch}</span>}
    </div>
  )
}
