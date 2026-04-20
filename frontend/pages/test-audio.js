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

    // Force voice loading first
    let voices = window.speechSynthesis.getVoices()
    addLog('voices count (immediate): ' + voices.length)

    const doSpeak = (v) => {
      addLog('voices count (final): ' + v.length)
      if (v.length > 0) {
        addLog('first 5 voices: ' + v.slice(0, 5).map(x => x.name + ' (' + x.lang + ')').join(', '))
      }

      window.speechSynthesis.cancel()

      const u = new SpeechSynthesisUtterance('Hello, this is a test of the speech system.')
      u.lang = 'en-US'

      if (v.length > 0) {
        const enVoice = v.find(x => x.lang.startsWith('en'))
        if (enVoice) {
          u.voice = enVoice
          addLog('using voice: ' + enVoice.name + ' (' + enVoice.lang + ')')
        }
      }

      u.onstart = () => addLog('EVENT: onstart fired')
      u.onend = () => addLog('EVENT: onend fired')
      u.onerror = (e) => addLog('EVENT: onerror - ' + e.error)

      addLog('calling speak()...')
      window.speechSynthesis.speak(u)
      addLog('speak() called')
    }

    if (voices.length > 0) {
      doSpeak(voices)
    } else {
      addLog('waiting for voiceschanged event...')
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices()
        addLog('voiceschanged fired! count: ' + voices.length)
        doSpeak(voices)
      }
      // Also try after a delay
      setTimeout(() => {
        const v2 = window.speechSynthesis.getVoices()
        if (v2.length > 0 && voices.length === 0) {
          addLog('voices loaded via timeout: ' + v2.length)
          doSpeak(v2)
        }
      }, 2000)
    }
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
