import React from 'react';
import FileUploadButton from './FileUploadButton';
import SendButton from './SendButton';
import EmojiPickerButton from './EmojiPickerButton';
import EmojiPickerContainer from './EmojiPickerContainer';

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
  handleEmojiClick,
  theme, 
  viewport  // Make sure this is included
}) => {
  // Log viewport to debug
  console.log('ChatInput viewport:', viewport);
  
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
      borderBottomRightRadius: viewport.width <= 768 ? 0 : '18px',
      position: 'relative'
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
        
        <SendButton 
          handleSend={handleSend}
          input={input}
          file={file}
          theme={theme}
          viewport={viewport}
        />
        
        <EmojiPickerButton
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          theme={theme}
        />
      </div>
      
      <EmojiPickerContainer
        showEmojiPicker={showEmojiPicker}
        handleEmojiClick={handleEmojiClick}
        theme={theme}
      />
    </div>
  );
};

export default ChatInput;
