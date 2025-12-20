import React from 'react'
import './InputField.css'

/**
 * Reusable input field component
 * Handles number input with validation and error states
 */
const InputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'number',
  error,
  disabled = false,
  required = false
}) => {
  return (
    <div className="input-field">
      <label htmlFor="input">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default InputField
