import React, { useState, useEffect, useRef } from 'react'

export default function TestAudio() {
  const [log, setLog] = useState([])
  const voicesRef = useRef([])

  const addLog = (msg) => setLog(prev => [...prev, new Date().toLocaleTimeString() + ': ' + msg])

  // Pre-load voices on mount
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) voicesRef.current = v
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  // Test 1: Simplest possible speak — NO cancel, NO async
  const testSimple = () => {
    addLog('--- TEST SIMPLE ---')
    const u = new SpeechSynthesisUtterance('Hello, testing one two three.')
    u.onstart = () => addLog('onstart fired')
    u.onend = () => addLog('onend fired')
    u.onerror = (e) => addLog('onerror: ' + e.error)
    window.speechSynthesis.speak(u)
    addLog('speak() called, voices: ' + voicesRef.current.length)
  }

  // Test 2: With voice set
  const testWithVoice = () => {
    addLog('--- TEST WITH VOICE ---')
    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices()
    addLog('voices: ' + voices.length)
    const u = new SpeechSynthesisUtterance('This test uses a specific voice.')
    const enVoice = voices.find(v => v.lang.startsWith('en') && !/rishi|albert|daniel|david/i.test(v.name))
    if (enVoice) { u.voice = enVoice; addLog('voice: ' + enVoice.name) }
    else addLog('no en voice found')
    u.onstart = () => addLog('onstart fired')
    u.onend = () => addLog('onend fired')
    u.onerror = (e) => addLog('onerror: ' + e.error)
    window.speechSynthesis.speak(u)
  }

  // Test 3: Cancel then speak
  const testCancelThenSpeak = () => {
    addLog('--- TEST CANCEL+SPEAK ---')
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance('Testing after cancel.')
    u.onstart = () => addLog('onstart fired')
    u.onend = () => addLog('onend fired')
    u.onerror = (e) => addLog('onerror: ' + e.error)
    window.speechSynthesis.speak(u)
    addLog('speak() called after cancel()')
  }

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', fontSize: 14 }}>
      <h1>TTS Debug</h1>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <button onClick={testSimple} style={{ padding: '12px 20px', fontSize: 16, cursor: 'pointer', background: '#9333ea', color: 'white', border: 'none', borderRadius: 8 }}>
          Test Simple
        </button>
        <button onClick={testWithVoice} style={{ padding: '12px 20px', fontSize: 16, cursor: 'pointer', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8 }}>
          Test With Voice
        </button>
        <button onClick={testCancelThenSpeak} style={{ padding: '12px 20px', fontSize: 16, cursor: 'pointer', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8 }}>
          Test Cancel+Speak
        </button>
        <button onClick={() => setLog([])} style={{ padding: '12px 20px', fontSize: 16, cursor: 'pointer' }}>Clear</button>
      </div>
      <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 8, maxHeight: 400, overflow: 'auto' }}>
        {log.length === 0 ? <p>Click a test button</p> : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  )
}
