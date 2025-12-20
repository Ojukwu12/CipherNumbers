import React from 'react'
import './Alert.css'

/**
 * Reusable alert component
 * Shows success, error, or warning messages
 */
const Alert = ({ type = 'success', message, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span>{message}</span>
        {onClose && (
          <button className="alert-close" onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert
