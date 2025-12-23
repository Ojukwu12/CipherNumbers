import React, { useState, useEffect } from 'react'
import InputField from './components/InputField'
import Button from './components/Button'
import Modal from './components/Modal'
import Alert from './components/Alert'
import ResultDisplay from './components/ResultDisplay'
import * as api from './utils/api'
import './App.css'

/**
 * Main App Component
 * Orchestrates the FHE demo flow:
 * 1. Initialize encryption session
 * 2. User enters secret number
 * 3. Choose operation
 * 4. Encrypt and compute
 * 5. Decrypt with original input
 */
function App() {
  // State Management
  const [sessionId, setSessionId] = useState(null)
  const [secretNumber, setSecretNumber] = useState('')
  const [operand, setOperand] = useState('')
  const [operation, setOperation] = useState('add')
  const [encryptedNumber, setEncryptedNumber] = useState(null)
  const [encryptedResult, setEncryptedResult] = useState(null)
  const [decryptedValue, setDecryptedValue] = useState(null)
  const [verifySecret, setVerifySecret] = useState('')

  // UI State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDecryptModal, setShowDecryptModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [step, setStep] = useState(1)

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true)
        const response = await api.initializeSession()
        setSessionId(response.data.sessionId)
        setLoading(false)
      } catch (err) {
        setError('Failed to initialize encryption session. Backend may be offline.')
        setLoading(false)
      }
    }

    initialize()
  }, [])

  /**
   * Step 1: Encrypt secret number
   */
  const handleEncrypt = async (e) => {
    e.preventDefault()
    setError(null)

    if (!secretNumber || isNaN(secretNumber)) {
      setError('Please enter a valid number')
      return
    }

    try {
      setLoading(true)
      const response = await api.encryptNumber(parseInt(secretNumber), sessionId)
      setEncryptedNumber(response.data)
      setStep(2)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Encryption failed')
      setLoading(false)
    }
  }

  /**
   * Step 2: Compute on encrypted data
   */
  const handleCompute = async (e) => {
    e.preventDefault()
    setError(null)

    if (!operand || isNaN(operand)) {
      setError('Please enter a valid operand')
      return
    }

    try {
      setLoading(true)
      let response

      if (operation === 'add') {
        response = await api.performAddition(encryptedNumber, parseInt(operand))
      } else if (operation === 'multiply') {
        response = await api.performMultiplication(encryptedNumber, parseInt(operand))
      }

      setEncryptedResult(response.data)
      setShowDecryptModal(true)
      setStep(3)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Computation failed')
      setLoading(false)
    }
  }

  /**
   * Step 3: Decrypt result
   */
  const handleDecrypt = async (e) => {
    e.preventDefault()
    setError(null)

    if (!verifySecret || isNaN(verifySecret)) {
      setError('Please enter the original secret number')
      return
    }

    if (parseInt(verifySecret) !== parseInt(secretNumber)) {
      setError('Secret number does not match. Cannot decrypt.')
      return
    }

    try {
      setLoading(true)
      const response = await api.decryptResult(encryptedResult, parseInt(verifySecret))
      setDecryptedValue(response.data.decryptedValue)
      setShowDecryptModal(false)
      setShowResultModal(true)
      setStep(4)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Decryption failed')
      setLoading(false)
    }
  }

  /**
   * Reset for new computation
   */
  const handleReset = () => {
    setSecretNumber('')
    setOperand('')
    setVerifySecret('')
    setEncryptedNumber(null)
    setEncryptedResult(null)
    setDecryptedValue(null)
    setError(null)
    setStep(1)
    setShowResultModal(false)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>CipherNumbers</h1>
              <p>Understand FHE in under 2 minutes</p>
            </div>
            {sessionId && (
              <div className="session-info">
                <span className="status-badge">🔐 Encrypted Session Active</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container main-content">
        {/* Introduction */}
        <section className="intro card">
          <h2>What is Cipher Numbers?</h2>
          <p>
            This demo shows <strong>Fully Homomorphic Encryption (FHE)</strong> in action.
            You'll encrypt a secret number, perform math on it <em>without decryption</em>,
            and then decrypt the result using only your original secret.
          </p>
          <p>
            <strong>The key insight:</strong> If you don't have the secret, you learn nothing.
          </p>
        </section>

        {/* Error Alert */}
        {error && (
          <Alert 
            type="error" 
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Step Indicators */}
        <div className="steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <p>Secret</p>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <p>Compute</p>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <p>Verify</p>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <p>Result</p>
          </div>
        </div>

        {/* Step 1: Enter Secret */}
        {step === 1 && !encryptedNumber && (
          <section className="form-section card">
            <h2>Step 1: Your Secret Number</h2>
            <p>Choose any number. It will be encrypted immediately and never sent in plaintext.</p>
            
            <form onSubmit={handleEncrypt}>
              <InputField
                label="Enter a Secret Number"
                value={secretNumber}
                onChange={(e) => setSecretNumber(e.target.value)}
                placeholder="e.g., 42"
                type="number"
                required
              />
              <Button 
                type="submit" 
                loading={loading}
                variant="primary"
              >
                Encrypt & Continue
              </Button>
            </form>
          </section>
        )}

        {/* Step 2: Choose Operation */}
        {step === 2 && encryptedNumber && (
          <section className="form-section card">
            <h2>Step 2: Choose an Operation</h2>
            <p>Pick an operation to perform on your encrypted number.</p>
            
            <form onSubmit={handleCompute}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="operation">Operation</label>
                  <select 
                    id="operation"
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                  >
                    <option value="add">Add (+)</option>
                    <option value="multiply">Multiply (×)</option>
                  </select>
                </div>

                <div className="form-group">
                  <InputField
                    label="Operand"
                    value={operand}
                    onChange={(e) => setOperand(e.target.value)}
                    placeholder="e.g., 10"
                    type="number"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <Button 
                  type="submit" 
                  loading={loading}
                  variant="primary"
                >
                  Compute on Encrypted Data
                </Button>
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEncryptedNumber(null)
                    setStep(1)
                  }}
                >
                  Back
                </Button>
              </div>
            </form>

            <div className="info-box">
              <strong>💡 Key Point:</strong> The computation happens on encrypted data.
              Your number is never decrypted on the server.
            </div>
          </section>
        )}

        {/* Step 3 & 4: Results */}
        {(step === 3 || step === 4) && encryptedNumber && (
          <ResultDisplay
            encryptedValue={encryptedNumber?.ciphertext}
            decryptedValue={decryptedValue}
            operation={operation}
            operand={parseInt(operand)}
            originalValue={parseInt(secretNumber)}
          />
        )}
      </main>

      {/* Decrypt Modal */}
      <Modal
        isOpen={showDecryptModal}
        title="Verify & Decrypt"
        onClose={() => {
          setShowDecryptModal(false)
          setVerifySecret('')
          setError(null)
          handleReset()
        }}
      >
        <p>
          To decrypt the result, re-enter your original secret number.
          <br />
          <strong>This proves you know the decryption key.</strong>
        </p>
        
        <form onSubmit={handleDecrypt}>
          <InputField
            label="Original Secret Number"
            value={verifySecret}
            onChange={(e) => setVerifySecret(e.target.value)}
            placeholder="Re-enter your secret"
            type="number"
            required
          />

          {error && (
            <Alert type="error" message={error} />
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button 
              type="submit" 
              loading={loading}
              variant="primary"
              style={{ flex: 1 }}
            >
              Decrypt Result
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              style={{ flex: 1 }}
              onClick={() => {
                setShowDecryptModal(false)
                setVerifySecret('')
                setError(null)
                handleReset()
              }}
            >
              Cancel & Reset
            </Button>
          </div>
        </form>
      </Modal>

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        title="✅ Computation Complete!"
        onClose={() => {}}
        footer={
          <Button 
            onClick={handleReset}
            variant="primary"
          >
            Try Another Computation
          </Button>
        }
      >
        <div className="success-message">
          <p>
            You entered <strong>{secretNumber}</strong> and performed <strong>{operation}({operand})</strong>.
          </p>
          <div className="result-final">
            <span className="result-label">Decrypted Result:</span>
            <span className="result-value">{decryptedValue}</span>
          </div>
          <p className="explanation-text">
            This result was computed on encrypted data without ever exposing your secret number.
            That's the power of FHE.
          </p>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            CipherNumbers is an educational demo of{' '}
            <a href="https://www.zama.ai/" target="_blank" rel="noopener noreferrer">
              Zama's
            </a>
            {' '}Fully Homomorphic Encryption.
          </p>
          <p className="small">
            No data is stored. All computation is local or on ephemeral sessions.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
