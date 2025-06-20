import React from 'react'
import EmojiPicker from 'emoji-picker-react'

/**
 * EmojiPickerContainer displays the emoji picker popup when triggered.
 * It is responsive and adapts its size and position based on the viewport.
 */
const EmojiPickerContainer = ({ showEmojiPicker, handleEmojiClick, theme }) => {
  if (!showEmojiPicker) return null

  // Responsive sizing and positioning for the emoji picker
  const width = window.innerWidth <= 480
    ? Math.min(window.innerWidth - 20, 320)
    : (window.innerWidth <= 768 ? 260 : 320)
  const height = window.innerWidth <= 480
    ? 220
    : (window.innerWidth <= 768 ? 280 : 350)
  const bottom = window.innerWidth <= 480
    ? 60
    : (window.innerWidth <= 768 ? 65 : 70)
  const right = window.innerWidth <= 480
    ? 5
    : (window.innerWidth <= 768 ? 10 : 10)

  return (
    <div
      className="emoji-picker-container"
      style={{
        position: 'absolute',
        bottom,
        right,
        zIndex: 10,
        boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
        borderRadius: '10px',
        overflow: 'hidden',
        width,
        height,
        background: theme === 'dark' ? '#23272f' : '#fff'
      }}
    >
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        height={height}
        width={width}
        theme={theme}
      />
    </div>
  )
}

export default EmojiPickerContainer