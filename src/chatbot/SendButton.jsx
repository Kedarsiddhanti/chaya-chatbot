import React from 'react';

const SendButton = ({ 
  handleSend, 
  input, 
  file, 
  theme, 
  viewport 
}) => {
  const isDisabled = !input.trim() && !file;

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
      style={{
        background: 'transparent',
        color: isDisabled 
          ? (theme === 'dark' ? '#6a7383' : '#a0b4d8') 
          : (theme === 'dark' ? '#f0f4f8' : '#4a90e2'),
        border: 'none',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        minWidth: '44px',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxShadow: 'none',
        padding: 0,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      onTouchStart={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(0.95)';
        }
      }}
      onTouchEnd={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      aria-label="Send message"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="24px"
        height="24px"
        style={{
          flexShrink: 0,
          pointerEvents: 'none'
        }}
      >
        <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
      </svg>
    </button>
  );
};

export default SendButton;

