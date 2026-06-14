// 全站音效模組，用 Web Audio API 合成，零外部檔案。
let ctx

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ── 木頭敲擊（tab 切換）──────────────────────
export function playWoodTap() {
  const c = getCtx()
  const now = c.currentTime

  const bufLen = Math.floor(c.sampleRate * 0.06)
  const buf = c.createBuffer(1, bufLen, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.6

  const noise = c.createBufferSource()
  noise.buffer = buf

  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1000
  bp.Q.value = 1.2

  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0.7, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

  noise.connect(bp).connect(noiseGain).connect(c.destination)
  noise.start(now)
  noise.stop(now + 0.06)

  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(480, now)
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.08)

  const oscGain = c.createGain()
  oscGain.gain.setValueAtTime(0.35, now)
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

  osc.connect(oscGain).connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.08)
}

// ── 柔和氣泡 pop（一般按鈕 / CTA）──────────────
export function playPop() {
  const c = getCtx()
  const now = c.currentTime

  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(600, now)
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.12)

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.3, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

  osc.connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.12)
}

// ── 打字機按鍵音（PIN 鍵盤）─────────────────────
export function playKey() {
  const c = getCtx()
  const now = c.currentTime

  // 極短噪音脈衝模擬機械按鍵
  const bufLen = Math.floor(c.sampleRate * 0.03)
  const buf = c.createBuffer(1, bufLen, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.5

  const noise = c.createBufferSource()
  noise.buffer = buf

  const hp = c.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 2000

  const noiseGain = c.createGain()
  noiseGain.gain.setValueAtTime(0.45, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

  noise.connect(hp).connect(noiseGain).connect(c.destination)
  noise.start(now)
  noise.stop(now + 0.03)

  // 短促金屬感 click tone
  const osc = c.createOscillator()
  osc.type = 'square'
  osc.frequency.setValueAtTime(1800, now)
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.025)

  const oscGain = c.createGain()
  oscGain.gain.setValueAtTime(0.08, now)
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)

  osc.connect(oscGain).connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.025)
}

// React hooks
export function useWoodTap() { return playWoodTap }
export function usePop() { return playPop }
export function useKey() { return playKey }
