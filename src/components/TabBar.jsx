// 底部導覽列。icon 為 SVG path 內容字串。
export const TABS = [
  {
    id: 'profile',
    label: '我的卡',
    icon: '<path d="M4 5h16v14H4z"/><circle cx="9" cy="11" r="2"/><path d="M14 9h4M14 13h4M6 16h8"/>',
  },
  {
    id: 'guests',
    label: '來賓',
    icon: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M4 19c0-3 2.5-5 5-5s5 2 5 5M15 19c0-2 1-3.5 3-3.5"/>',
  },
  {
    id: 'message',
    label: '給你的話',
    icon: '<path d="M4 5h16v11H8l-4 3z"/>',
  },
  {
    id: 'wall',
    label: '留言牆',
    icon: '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <svg
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: t.icon }}
          />
          {t.label}
        </button>
      ))}
    </nav>
  )
}
