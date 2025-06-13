import React, { useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerContainer = ({ 
  showEmojiPicker, 
  handleEmojiClick, 
  theme
}) => {
  const [isMobile, setIsMobile] = useState(false); // Start with false to avoid mismatch

  useEffect(() => {
    // Set immediately on mount
    const updateIsMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 480px)').matches);
    };

    updateIsMobile(); // Initial check
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  if (!showEmojiPicker) return null;

  return (
    <div
      className="emoji-picker-container"
      style={{
        position: 'absolute',
        bottom: isMobile ? '60px' : '70px',
        right: isMobile ? '5px' : '10px',
        zIndex: 10,
        boxShadow:
          theme === 'dark'
            ? '0 5px 20px rgba(0,0,0,0.3)'
            : '0 5px 20px rgba(0,0,0,0.15)',
        borderRadius: '10px',
        overflow: 'hidden',
        border:
          theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff',
        maxWidth: '100vw',
        maxHeight: isMobile ? '300px' : '350px',
      }}
    >
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        height={isMobile ? 300 : 350}
        width={isMobile ? 280 : 320}
        theme={theme === 'dark' ? 'dark' : 'light'}
        searchDisabled={isMobile}
      />
    </div>
  );
};

export default EmojiPickerContainer;
