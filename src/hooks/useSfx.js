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

// ── 信封開封（蠟封啪一聲 + 紙張撕裂感）──────────────
export function playEnvelopeOpen() {
  const c = getCtx()
  const now = c.currentTime

  // 低頻「啪」：蠟封迸開
  const osc = c.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(180, now)
  osc.frequency.exponentialRampToValueAtTime(70, now + 0.09)
  const og = c.createGain()
  og.gain.setValueAtTime(0.35, now)
  og.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
  osc.connect(og).connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.12)

  // 高頻撕裂噪音：封口掀開
  const bufLen = Math.floor(c.sampleRate * 0.18)
  const buf = c.createBuffer(1, bufLen, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) {
    const env = 1 - i / bufLen
    data[i] = (Math.random() * 2 - 1) * 0.5 * env
  }
  const noise = c.createBufferSource()
  noise.buffer = buf
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 3200
  bp.Q.value = 0.7
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.0001, now + 0.02)
  ng.gain.exponentialRampToValueAtTime(0.22, now + 0.06)
  ng.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
  noise.connect(bp).connect(ng).connect(c.destination)
  noise.start(now + 0.02)
  noise.stop(now + 0.2)
}

// ── 信紙滑出（柔和紙張摩擦）──────────────────────
export function playPaperSlide() {
  const c = getCtx()
  const now = c.currentTime
  const dur = 0.45

  // 篩過的噪音，慢起慢落 → 紙張滑動的「咻—」
  const bufLen = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, bufLen, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1
  const noise = c.createBufferSource()
  noise.buffer = buf

  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime(1800, now)
  bp.frequency.linearRampToValueAtTime(4200, now + dur)
  bp.Q.value = 0.6

  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.linearRampToValueAtTime(0.16, now + dur * 0.45)
  g.gain.exponentialRampToValueAtTime(0.001, now + dur)

  noise.connect(bp).connect(g).connect(c.destination)
  noise.start(now)
  noise.stop(now + dur)
}

// ── 打字機按鍵（信件逐字浮現）──────────────────────
export function playTypewriter() {
  const c = getCtx()
  const now = c.currentTime

  // 乾淨的「嗒」：極短高頻噪音脈衝
  const bufLen = Math.floor(c.sampleRate * 0.012)
  const buf = c.createBuffer(1, bufLen, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) {
    const env = 1 - i / bufLen
    data[i] = (Math.random() * 2 - 1) * env
  }
  const noise = c.createBufferSource()
  noise.buffer = buf
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 4000
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.16, now)
  ng.gain.exponentialRampToValueAtTime(0.001, now + 0.012)
  noise.connect(hp).connect(ng).connect(c.destination)
  noise.start(now)
  noise.stop(now + 0.012)

  // 輕脆敲擊感：短促高音 sine 點
  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1500, now)
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.015)
  const og = c.createGain()
  og.gain.setValueAtTime(0.07, now)
  og.gain.exponentialRampToValueAtTime(0.001, now + 0.015)
  osc.connect(og).connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.015)
}

// ── 報到成功歡呼（PIN 正確、撒花轉場）──────────────
export function playFanfare() {
  const c = getCtx()
  const now = c.currentTime
  // 上行大三和弦琶音，帶一聲頂音閃光
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) => {
    const t = now + i * 0.09
    const osc = c.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(f, t)

    const gain = c.createGain()
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)

    osc.connect(gain).connect(c.destination)
    osc.start(t)
    osc.stop(t + 0.5)
  })

  // 撒花「咻」的氣聲噪音層
  const tail = now + 0.18
  const bufLen = Math.floor(c.sampleRate * 0.5)
  const buf = c.createBuffer(1, bufLen, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.4
  const noise = c.createBufferSource()
  noise.buffer = buf
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 3000
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.0001, tail)
  ng.gain.exponentialRampToValueAtTime(0.18, tail + 0.04)
  ng.gain.exponentialRampToValueAtTime(0.001, tail + 0.45)
  noise.connect(hp).connect(ng).connect(c.destination)
  noise.start(tail)
  noise.stop(tail + 0.5)
}

// React hooks
export function useWoodTap() { return playWoodTap }
export function usePop() { return playPop }
export function useKey() { return playKey }
export function useFanfare() { return playFanfare }
export function useEnvelopeOpen() { return playEnvelopeOpen }
export function usePaperSlide() { return playPaperSlide }
export function useTypewriter() { return playTypewriter }
