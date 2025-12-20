import React from 'react'
import './Modal.css'

/**
 * Reusable modal component
 * Displays results or confirmations
 */
const Modal = ({ isOpen, title, children, onClose, footer }) => {
  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </>
  )
}

export default Modal
