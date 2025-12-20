import React from 'react'
import './Button.css'

/**
 * Reusable button component
 * Handles loading states and variants
 */
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const btnClass = `btn btn-${variant} ${loading ? 'loading' : ''} ${className}`

  return (
    <button
      type={type}
      className={btnClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <span className="spinner"></span> : children}
    </button>
  )
}

export default Button
