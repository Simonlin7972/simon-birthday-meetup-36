// 「給你的話」：Simon 寫給這位來賓的話；若還沒寫，顯示佔位訊息。
export default function Message({ me }) {
  return (
    <div className="screen">
      <div className="msg-wrap">
        <div className="msg-from">Simon 給 {me.name} 的話</div>
        {me.fromSimon ? (
          <>
            <div className="msg-mark">“</div>
            <div className="msg-body">{me.fromSimon}</div>
            <div className="msg-sign">
              — <b>Simon</b>
            </div>
          </>
        ) : (
          <div className="msg-empty">
            Simon 正在為你寫一句話 ✍️
            <br />
            當天見面時親口告訴你。
          </div>
        )}
      </div>
    </div>
  )
}
