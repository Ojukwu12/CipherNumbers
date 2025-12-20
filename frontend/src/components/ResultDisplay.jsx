import React, { useState, useEffect } from 'react'
import './ResultDisplay.css'

/**
 * Component to display encrypted and decrypted results
 */
const ResultDisplay = ({ 
  encryptedValue, 
  decryptedValue,
  operation,
  operand,
  originalValue
}) => {
  const [showDecrypted, setShowDecrypted] = useState(false)

  return (
    <div className="result-display card">
      <h3>Computation Result</h3>
      
      <div className="result-section">
        <h4>🔐 Encrypted Value</h4>
        <code className="encrypted-value">
          {encryptedValue ? encryptedValue.substring(0, 50) + '...' : 'N/A'}
        </code>
      </div>

      <div className="result-section">
        <h4>Operation Performed</h4>
        <p className="operation">
          {operation?.toUpperCase()} with {operand}
        </p>
        <p className="explanation">
          This operation was computed on encrypted data without revealing the plaintext.
        </p>
      </div>

      {decryptedValue !== undefined && (
        <div className="result-section decrypted">
          <h4>✓ Decrypted Result</h4>
          <div className="result-value">{decryptedValue}</div>
          <p className="verification">
            Original: {originalValue} | Operation: {operation}({operand}) = {decryptedValue}
          </p>
        </div>
      )}
    </div>
  )
}

export default ResultDisplay
