import React from 'react';
import './Button.css';

/**
 * Button component with customizable styles
 * @param {Object} props Component props
 * @returns {JSX.Element} Rendered button component
 */
const Button = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false 
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''}`;
  
  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
