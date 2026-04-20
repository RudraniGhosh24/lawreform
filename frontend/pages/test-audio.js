import React, { useState } from 'react'

export default function TestAudio() {
  const [log, setLog] = useState([])

  const addLog = (msg) => setLog(prev => [...prev, new Date().toLocaleTimeString() + ': ' + msg])

  const testSpeak = () => {
    addLog('Testing speechSynthesis...')
    
    if (!window.speechSynthesis) {
      addLog('ERROR: speechSynthesis not available')
      return
    }

    addLog('speechSynthesis exists: true')
    addLog('speaking: ' + window.speechSynthesis.speaking)
    addLog('paused: ' + window.speechSynthesis.paused)
    addLog('pending: ' + window.speechSynthesis.pending)

    const voices = window.speechSynthesis.getVoices()
    addLog('voices count: ' + voices.length)
    if (voices.length > 0) {
      addLog('first 5 voices: ' + voices.slice(0, 5).map(v => v.name + ' (' + v.lang + ')').join(', '))
    }

    window.speechSynthesis.cancel()

    const u = new SpeechSynthesisUtterance('Hello, this is a test of the speech system.')
    u.lang = 'en-US'
    u.rate = 1
    u.pitch = 1

    if (voices.length > 0) {
      const enVoice = voices.find(v => v.lang.startsWith('en'))
      if (enVoice) {
        u.voice = enVoice
        addLog('using voice: ' + enVoice.name)
      }
    }

    u.onstart = () => addLog('EVENT: onstart fired')
    u.onend = () => addLog('EVENT: onend fired')
    u.onerror = (e) => addLog('EVENT: onerror - ' + e.error)
    u.onpause = () => addLog('EVENT: onpause fired')
    u.onresume = () => addLog('EVENT: onresume fired')

    addLog('calling speak()...')
    window.speechSynthesis.speak(u)
    addLog('speak() called. speaking: ' + window.speechSynthesis.speaking + ', pending: ' + window.speechSynthesis.pending)

    setTimeout(() => {
      addLog('after 500ms - speaking: ' + window.speechSynthesis.speaking + ', paused: ' + window.speechSynthesis.paused)
    }, 500)
  }

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', fontSize: 14 }}>
      <h1>TTS Debug Page</h1>
      <button onClick={testSpeak} style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer', background: '#9333ea', color: 'white', border: 'none', borderRadius: 8 }}>
        Test Speak
      </button>
      <button onClick={() => setLog([])} style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer', marginLeft: 10 }}>
        Clear
      </button>
      <div style={{ marginTop: 20, background: '#f5f5f5', padding: 15, borderRadius: 8, maxHeight: 400, overflow: 'auto' }}>
        {log.length === 0 ? <p>Click "Test Speak" to debug TTS</p> : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  )
}
