import React, { useState } from 'react';

const SendButton = ({ 
  handleSend, 
  input, 
  file, 
  theme, 
  viewport 
}) => {
  const isDisabled = !input.trim() && !file;
  const [isHovered, setIsHovered] = useState(false);

  const onClickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      handleSend();
    }
  };

  return (
    <button 
      onClick={onClickHandler} 
      disabled={isDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'transparent', // Always transparent background
        color: isDisabled 
          ? (theme === 'dark' ? '#6a7383' : '#a0b4d8') 
          : (theme === 'dark' ? '#f0f4f8' : '#4a90e2'),
        border: 'none', // No border on the button itself
        borderRadius: '50%',
        width: viewport?.isMobile ? '32px' : '36px',
        height: viewport?.isMobile ? '32px' : '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        padding: 0,
        boxShadow: 'none', // No shadow on the button itself
        transition: 'all 0.2s ease',
        transform: 'none' // No transform on the button itself
      }}
      aria-label="Send message"
      type="button"
    >
      <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill={
    isDisabled
      ? 'currentColor'
      : (isHovered
          ? (theme === 'dark' ? '#ffffff' : '#4a90e2')
          : 'currentColor')
  }
  width={isHovered && !isDisabled ? '22px' : '24px'}
  height={isHovered && !isDisabled ? '22px' : '24px'}
  style={{
    flexShrink: 0,
    pointerEvents: 'none',
    transition: 'all 0.2s ease',
    strokeWidth: isHovered && !isDisabled ? 2.5 : 2,
    filter: isHovered && !isDisabled 
      ? (theme === 'dark' 
          ? 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' 
          : 'drop-shadow(0 0 3px rgba(74,144,226,0.7))')
      : 'none',
    transform: isHovered && !isDisabled ? 'scale(1.1)' : 'scale(1)'
  }}
>
  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
</svg>

    </button>
  );
};

export default SendButton;






