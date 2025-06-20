import React from 'react'
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
}) => (
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
    <button
      type="button"
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      className="emoji-button"
      style={{
        flexShrink: 0,
        background: 'transparent',
        color: theme === 'dark' ? '#f0f4f8' : '#4a90e2',
        border: 'none',
        borderRadius: '50%',
        width: viewport.isMobile ? '32px' : '36px',
        height: viewport.isMobile ? '32px' : '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'none',
        padding: 0
      }}
      title="Emoji picker"
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
    </button>
  </div>
)

export default ChatInput