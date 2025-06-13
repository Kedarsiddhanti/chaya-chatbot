import React from 'react';
import FileUploadButton from './FileUploadButton';
import SendButton from './SendButton';

const ChatInput = ({ 
  input, 
  setInput, 
  handleSend, 
  handleKeyPress, 
  file, 
  setFile, 
  filePreview, 
  setFilePreview, 
  uploadButtonRotating, 
  setUploadButtonRotating, 
  showEmojiPicker, 
  setShowEmojiPicker, 
  theme, 
  viewport 
}) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      flexDirection: 'column',
      gap: 8,
      background: theme === 'dark' ? '#2a2e38' : '#f5faff',
      padding: viewport.isMobile ? '0.6rem' : '0.75rem',
      borderTop: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff',
      borderBottomLeftRadius: viewport.width <= 768 ? 0 : '18px',
      borderBottomRightRadius: viewport.width <= 768 ? 0 : '18px'
    }}>
      {/* File preview and summarize button */}
      {file && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          width: '100%',
          background: theme === 'dark' ? '#3a4050' : '#e6f0ff',
          padding: '0.5rem',
          borderRadius: '8px',
          marginBottom: '0.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            flex: 1 
          }}>
            <span style={{ fontSize: '1.2rem' }}>📄</span>
            <span style={{ 
              fontSize: '0.9rem',
              color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {file.name}
            </span>
          </div>
          <button
            onClick={() => {
              setFile(null);
              setFilePreview(null);
              setUploadButtonRotating(false);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Input area with buttons */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        width: '100%' 
      }}>
        <FileUploadButton 
          setFile={setFile} 
          setFilePreview={setFilePreview}
          uploadButtonRotating={uploadButtonRotating}
          setUploadButtonRotating={setUploadButtonRotating}
          theme={theme}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '0.8rem 1rem',
            borderRadius: '24px',
            border: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff',
            background: theme === 'dark' ? '#23272f' : '#ffffff',
            color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
            outline: 'none',
            fontSize: '0.95rem'
          }}
        />
        
        {/* Send button component */}
        <SendButton 
          handleSend={handleSend}
          input={input}
          file={file}
          theme={theme}
          viewport={viewport}
        />
        
        {/* Emoji picker button with improved styling */}
        <button
          className="emoji-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{
            background: showEmojiPicker 
              ? (theme === 'dark' ? '#3d4352' : '#e6eeff')
              : (theme === 'dark'
                  ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 100%)'
                  : 'linear-gradient(135deg, #e6eeff 0%, #d8e6ff 100%)'),
            color: showEmojiPicker 
              ? (theme === 'dark' ? '#f0f4f8' : '#4a90e2') 
              : (theme === 'dark' ? '#f0f4f8' : '#4a90e2'),
            border: 'none',
            borderRadius: '50%',
            width: viewport?.isMobile ? '36px' : '40px',
            height: viewport?.isMobile ? '36px' : '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            boxShadow: showEmojiPicker 
              ? '0 0 0 2px rgba(74, 144, 226, 0.2)'
              : '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
            transform: showEmojiPicker ? 'scale(1.1)' : 'scale(1)',
            marginLeft: '8px'
          }}
          onMouseEnter={(e) => {
            if (!showEmojiPicker) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showEmojiPicker) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            } else {
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          title="Emoji picker"
        >
          {showEmojiPicker ? '✕' : '😊'}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
