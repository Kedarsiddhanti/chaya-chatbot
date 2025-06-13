import React from 'react';
import styled from 'styled-components';

// Create a styled button component with media queries
const ResponsiveButton = styled.button`
  background: ${props => props.showEmojiPicker 
    ? (props.theme === 'dark' ? '#3d4352' : '#e6eeff')
    : (props.theme === 'dark'
        ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 100%)'
        : 'linear-gradient(135deg, #e6eeff 0%, #d8e6ff 100%)')};
  color: ${props => props.theme === 'dark' ? '#f0f4f8' : '#4a90e2'};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: ${props => props.showEmojiPicker 
    ? '0 0 0 2px rgba(74, 144, 226, 0.2)'
    : '0 2px 5px rgba(0,0,0,0.1)'};
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  transform: ${props => props.showEmojiPicker ? 'scale(1.1)' : 'scale(1)'};
  margin-left: 8px;
  flex-shrink: 0;
  z-index: 5;
  position: relative;
  font-size: 1.2rem;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  
  /* Media query for mobile devices */
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    margin-left: 4px;
    font-size: 1.1rem;
  }
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
      {showEmojiPicker ? '✕' : '😊'}
    </ResponsiveButton>
  );
};

export default EmojiPickerButton;

