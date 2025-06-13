import React from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerContainer = ({ 
  showEmojiPicker, 
  handleEmojiClick, 
  theme 
}) => {
  if (!showEmojiPicker) return null;
  
  return (
    <div className="emoji-picker-container" style={{
      position: 'absolute',
      bottom: '70px',
      right: '10px',
      zIndex: 10,
      boxShadow: theme === 'dark' 
        ? '0 5px 20px rgba(0,0,0,0.3)' 
        : '0 5px 20px rgba(0,0,0,0.15)',
      borderRadius: '10px',
      overflow: 'hidden',
      border: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff'
    }}>
      <EmojiPicker 
        onEmojiClick={handleEmojiClick} 
        height={350} 
        width={320}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};

export default EmojiPickerContainer;