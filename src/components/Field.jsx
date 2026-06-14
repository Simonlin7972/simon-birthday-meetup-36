// 一個標籤 + 內容的欄位，內容為空時不顯示。
export default function Field({ label, value }) {
  if (!value) return null
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-val">{value}</div>
    </div>
  )
}
