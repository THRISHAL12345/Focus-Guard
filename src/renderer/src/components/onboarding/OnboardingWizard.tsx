import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '../../store/useSettingsStore'
import { useTaskStore } from '../../store/useTaskStore'
import { PERSONA_CATEGORIES } from '../../lib/constants'
import { Terminal, Shield, User, Briefcase } from 'lucide-react'
import { ScanlineEffect } from '../overlay/ScanlineEffect'

export function OnboardingWizard(): React.ReactElement {
  const [step, setStep] = useState(1)
  const [nameInput, setNameInput] = useState('')
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const updateSetting = useSettingsStore(s => s.updateSetting)
  const setCategories = useTaskStore(s => s.setCategories)

  // Typewriter effect state for screen 1
  const [typedText, setTypedText] = useState('')
  const fullText = "INITIALIZING SECURE PROTOCOL...\nESTABLISHING UPLINK...\nWELCOME TO FOCUSGUARD."

  useEffect(() => {
    if (step === 1) {
      let i = 0
      const interval = setInterval(() => {
        setTypedText(fullText.substring(0, i))
        i++
        if (i > fullText.length) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    }
    return undefined
  }, [step])

  const handleComplete = async () => {
    if (!nameInput.trim() || !selectedPersona) return
    
    // Apply settings
    await updateSetting('userName', nameInput.trim())
    await updateSetting('persona', selectedPersona)
    
    // Apply categories
    const categories = PERSONA_CATEGORIES[selectedPersona] || PERSONA_CATEGORIES['General']
    setCategories(categories)

    // Finish onboarding
    await updateSetting('hasCompletedOnboarding', true)
  }

  const btnStyle = {
    padding: '12px 24px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 32,
    letterSpacing: '0.1em'
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'var(--bg-void)',
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <ScanlineEffect />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', zIndex: 10 }}
          >
            <Terminal size={48} color="var(--accent)" style={{ marginBottom: 24, opacity: 0.8 }} />
            <pre style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              color: 'var(--accent)',
              textAlign: 'left',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              textShadow: '0 0 8px var(--accent)'
            }}>
              {typedText}
              <span className="cursor-blink">_</span>
            </pre>
            {typedText.length >= fullText.length && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={btnStyle}
                onClick={() => setStep(2)}
              >
                PROCEED
              </motion.button>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ maxWidth: 500, textAlign: 'center', zIndex: 10 }}
          >
            <Shield size={48} color="var(--accent)" style={{ marginBottom: 24, margin: '0 auto' }} />
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 16 }}>SYSTEM BRIEFING</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              FocusGuard operates on a strict compliance protocol. Every time your system boots, you will be confronted with a mandatory briefing overlay.
            </p>
            <p style={{ color: 'var(--critical)', lineHeight: 1.6, fontWeight: 600 }}>
              You cannot bypass this overlay until you have reviewed your overdue tasks. Discipline equals freedom.
            </p>
            <button style={btnStyle} onClick={() => setStep(3)}>UNDERSTOOD</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ maxWidth: 400, width: '100%', textAlign: 'center', zIndex: 10 }}
          >
            <User size={48} color="var(--accent)" style={{ marginBottom: 24, margin: '0 auto' }} />
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 16 }}>IDENTIFICATION</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Please enter your callsign, Operative.</p>
            
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="e.g. John, Commander, Alpha..."
              autoFocus
              onKeyDown={e => e.key === 'Enter' && nameInput.trim() && setStep(4)}
              style={{
                width: '100%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--accent)',
                color: 'var(--text-primary)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                textAlign: 'center',
                outline: 'none',
                boxShadow: '0 0 12px rgba(255, 69, 0, 0.2)'
              }}
            />
            
            <button 
              style={{...btnStyle, opacity: nameInput.trim() ? 1 : 0.5, cursor: nameInput.trim() ? 'pointer' : 'not-allowed'}} 
              onClick={() => nameInput.trim() && setStep(4)}
              disabled={!nameInput.trim()}
            >
              VERIFY IDENTITY
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ maxWidth: 600, width: '100%', textAlign: 'center', zIndex: 10 }}
          >
            <Briefcase size={48} color="var(--accent)" style={{ marginBottom: 24, margin: '0 auto' }} />
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 24, marginBottom: 8 }}>SELECT SPECIALIZATION</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Your task categories will be calibrated based on your role.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              {Object.keys(PERSONA_CATEGORIES).map(persona => (
                <div
                  key={persona}
                  onClick={() => setSelectedPersona(persona)}
                  style={{
                    padding: '20px',
                    background: selectedPersona === persona ? 'rgba(255, 69, 0, 0.1)' : 'var(--bg-elevated)',
                    border: `1px solid ${selectedPersona === persona ? 'var(--accent)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-mono)', color: selectedPersona === persona ? 'var(--accent)' : 'var(--text-primary)', marginBottom: 8 }}>
                    {persona.toUpperCase()}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {PERSONA_CATEGORIES[persona].map(cat => (
                      <span key={cat} style={{ fontSize: 10, background: 'var(--bg-base)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-secondary)' }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              style={{...btnStyle, opacity: selectedPersona ? 1 : 0.5, cursor: selectedPersona ? 'pointer' : 'not-allowed', marginTop: 0}} 
              onClick={handleComplete}
              disabled={!selectedPersona}
            >
              INITIALIZE WORKSPACE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
