// 依名字產生固定的漸層頭像；若有 photo 則顯示照片。
// className 用來套用不同尺寸（pf-av / sh-hero 等）。
export default function Avatar({ person, className = '', vt }) {
  let h = 0
  for (const c of person.name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const a = h % 360
  const b = (a + 38) % 360
  const ch = person.name.trim()[0] || '?'

  const style = {
    ...(person.photo
      ? { backgroundImage: `url('${person.photo}')` }
      : { backgroundImage: `linear-gradient(135deg,hsl(${a} 62% 60%),hsl(${b} 70% 50%))` }),
    ...(vt ? { viewTransitionName: vt } : {}),
  }

  return (
    <div className={`av ${className}`} style={style}>
      {!person.photo && <span>{ch}</span>}
    </div>
  )
}
