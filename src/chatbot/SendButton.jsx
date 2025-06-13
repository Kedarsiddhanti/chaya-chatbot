import React from 'react';

const SendButton = ({ 
  handleSend, 
  input, 
  file, 
  theme, 
  viewport 
}) => {
  const isDisabled = !input.trim() && !file;

  // Create a click handler that explicitly calls the passed handleSend function
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
        background: isDisabled 
          ? (theme === 'dark' ? '#3a4050' : '#d8e6ff') 
          : (theme === 'dark' 
              ? 'linear-gradient(135deg, #4a90e2 0%, #6aa9f0 100%)' 
              : 'linear-gradient(135deg, rgb(142, 185, 234) 0%, rgb(133, 184, 242) 100%)'),
        color: isDisabled 
          ? (theme === 'dark' ? '#6a7383' : '#a0b4d8') 
          : '#ffffff',
        border: 'none',
        borderRadius: '50%',
        width: viewport.isMobile ? '36px' : '40px',
        height: viewport.isMobile ? '36px' : '40px',
        minWidth: viewport.isMobile ? '36px' : '40px',
        minHeight: viewport.isMobile ? '36px' : '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxShadow: isDisabled 
          ? 'none' 
          : '0 2px 5px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
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
        width={viewport.isMobile ? "18px" : "20px"}
        height={viewport.isMobile ? "18px" : "20px"}
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



