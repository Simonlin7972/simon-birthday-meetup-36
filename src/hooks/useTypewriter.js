import { useEffect, useState } from 'react'

// 打字機效果：逐字顯示 text。
// speed：每個字的間隔（ms）；delay：開始前等待（ms，可讓它在進場動畫後才開始打字）。
export function useTypewriter(text, { speed = 120, delay = 0 } = {}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval)
            return c
          }
          return c + 1
        })
      }, speed)
    }, delay)

    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [text, speed, delay])

  return { text: text.slice(0, count), done: count >= text.length }
}
