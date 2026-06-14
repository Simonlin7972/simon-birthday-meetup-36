// 共用卡片容器：統一背景、圓角與立體陰影。
// 各頁面以額外的 className（pf-card / gcard / wcard）疊加各自的尺寸與排版。
export default function Card({ className = '', ...props }) {
  return <div className={`card ${className}`} {...props} />
}
