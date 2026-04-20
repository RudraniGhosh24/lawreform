import React, { useState, useEffect, useRef } from 'react'

export default function TestAudio() {
  const [log, setLog] = useState([])
  const voicesRef = useRef([])

  const addLog = (msg) => setLog(prev => [...prev, new Date().toLocaleTimeString() + ': ' + msg])

  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) voicesRef.current = v
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const pickVoice = () => {
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices()
    const bad = /bad news|bells|boing|bubbles|cellos|good news|hysterical|junior|organ|superstar|trinoids|whisper|wobble|zarvox|albert|ralph|fred|rishi|daniel|david|thomas/i
    const enVoices = voices.filter(v => v.lang.startsWith('en') && !bad.test(v.name))
    const good = ['samantha', 'karen', 'victoria', 'susan', 'fiona', 'moira', 'tessa', 'google']
    const best = enVoices.find(v => good.some(g => v.name.toLowerCase().includes(g)))
    return best || enVoices[0] || null
  }

  const testSpeak = () => {
    addLog('--- TEST ---')
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices()
    addLog('voices: ' + voices.length)

    const voice = pickVoice()
    addLog('picked voice: ' + (voice ? voice.name + ' (' + voice.lang + ')' : 'NONE'))

    const u = new SpeechSynthesisUtterance('Hello, this is a test of the speech system on your device.')
    if (voice) u.voice = voice
    u.lang = 'en-US'
    u.rate = 0.9
    u.pitch = 1.1

    u.onstart = () => addLog('EVENT: onstart')
    u.onend = () => addLog('EVENT: onend')
    u.onerror = (e) => addLog('EVENT: onerror - ' + e.error)

    window.speechSynthesis.speak(u)
    addLog('speak() called')

    setTimeout(() => {
      addLog('after 1s — speaking:' + window.speechSynthesis.speaking + ' paused:' + window.speechSynthesis.paused + ' pending:' + window.speechSynthesis.pending)
    }, 1000)
  }

  const listVoices = () => {
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices()
    const en = voices.filter(v => v.lang.startsWith('en'))
    addLog('--- EN VOICES (' + en.length + ') ---')
    en.forEach(v => addLog(v.name + ' | ' + v.lang + ' | local:' + v.localService))
  }

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', fontSize: 13 }}>
      <h1>TTS Debug v2</h1>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <button onClick={testSpeak} style={{ padding: '12px 20px', fontSize: 16, background: '#9333ea', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          Test Speak
        </button>
        <button onClick={listVoices} style={{ padding: '12px 20px', fontSize: 16, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          List EN Voices
        </button>
        <button onClick={() => setLog([])} style={{ padding: '12px 20px', fontSize: 16, cursor: 'pointer' }}>Clear</button>
      </div>
      <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 8, maxHeight: 500, overflow: 'auto' }}>
        {log.length === 0 ? <p>Click a button</p> : log.map((l, i) => <div key={i} style={{ marginBottom: 2 }}>{l}</div>)}
      </div>
    </div>
  )
}
