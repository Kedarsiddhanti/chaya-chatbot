import React from 'react';
import styled from 'styled-components';

// Create a styled button component
const ResponsiveButton = styled.button`
  background: transparent;
  color: ${props => props.theme === 'dark' ? '#f0f4f8' : '#4a90e2'};
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: none;
  transition: transform 0.2s;
  transform: ${props => props.showEmojiPicker ? 'scale(1.1)' : 'scale(1)'};
  margin-left: 8px;
  flex-shrink: 0;
  z-index: 5;
  position: relative;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline: none;
`;

const EmojiPickerButton = ({ 
  showEmojiPicker, 
  setShowEmojiPicker, 
  theme 
}) => {
  return (
    <ResponsiveButton
      className="emoji-button"
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      showEmojiPicker={showEmojiPicker}
      theme={theme}
      title="Emoji picker"
      type="button"
      aria-label="Open emoji picker"
    >
      {showEmojiPicker ? (
        <span style={{ fontSize: '1.5rem' }}>✕</span>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
        </svg>
      )}
    </ResponsiveButton>
  );
};

export default EmojiPickerButton;







