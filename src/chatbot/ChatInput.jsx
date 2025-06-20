import React, { useState } from 'react'
import FileUploadButton from './FileUploadButton'
import SendButton from './SendButton'

/**
 * ChatInput renders the input area with file upload, text input, send, and emoji picker buttons.
 */
const ChatInput = ({
  input,
  setInput,
  handleSend,
  file,
  setFile,
  filePreview,
  setFilePreview,
  uploadButtonRotating,
  setUploadButtonRotating,
  showEmojiPicker,
  setShowEmojiPicker,
  theme,
  viewport,
  userName,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: viewport.isMobile ? '0.2rem' : '0.4rem',
        padding: '0 0.2rem'
      }}
    >
      {/* File upload button for PDF files */}
      <FileUploadButton
        onFileSelect={fileObj => {
          setFile(fileObj)
          setFilePreview(fileObj ? null : null)
        }}
        theme={theme}
        hasFile={file !== null}
        style={{
          flexShrink: 0,
          width: viewport.isMobile ? '30px' : '34px',
          height: viewport.isMobile ? '30px' : '34px'
        }}
      />

      {/* Main text input */}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder={userName ? "Type a message..." : "Enter your name..."}
        autoComplete="off"
        spellCheck="true"
        autoCorrect="off"
        autoCapitalize="off"
        style={{
          flex: 1,
          minWidth: viewport.isMobile ? '140px' : '180px',
          maxWidth: viewport.isMobile ? '220px' : '280px',
          border: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e4ff',
          background: theme === 'dark' ? '#323742' : '#ffffff',
          color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
          borderRadius: 24,
          fontSize: viewport.isMobile ? '0.85rem' : '0.9rem',
          padding: '0.4rem 0.8rem',
          height: viewport.isMobile ? '32px' : '34px',
          transition: 'border 0.2s, box-shadow 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          outline: 'none'
        }}
      />

      {/* Send button */}
      <SendButton
        handleSend={handleSend}
        input={input}
        file={file}
        theme={theme}
        viewport={viewport}
      />

      {/* Emoji picker toggle button */}
      {/* Emoji picker toggle button */}
<button
  type="button"
  onClick={() => setShowEmojiPicker(prev => !prev)}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  title="Emoji picker"
  style={{
    background: isHovered
      ? (theme === 'dark' ? '#3a4050' : '#daeaff')
      : (theme === 'dark' ? '#2e3440' : '#f5faff'),
    color: theme === 'dark' ? '#f0f4f8' : '#4a90e2',
    border: 'none',
    borderRadius: '50%',
    width: viewport.isMobile ? '34px' : '38px',
    height: viewport.isMobile ? '34px' : '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
    marginRight: '0.3rem',
    transition: 'all 0.25s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
  }}
>
  {showEmojiPicker ? (
    <span style={{ 
      fontSize: '1.25rem',
      fontWeight: 600,
      transform: isHovered ? 'scale(1.1)' : 'none',
      transition: 'transform 0.2s ease'
    }}>
      ✕
    </span>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={viewport.isMobile ? 20 : 22}
      height={viewport.isMobile ? 20 : 22}
      fill="none"
      stroke={theme === 'dark' ? '#f0f4f8' : '#4a90e2'}
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{
        transition: 'transform 0.2s ease',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)'
      }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="10" r=".5" fill="currentColor" />
      <circle cx="15" cy="10" r=".5" fill="currentColor" />
    </svg>
  )}
</button>
    </div>
  )
}

export default ChatInput
