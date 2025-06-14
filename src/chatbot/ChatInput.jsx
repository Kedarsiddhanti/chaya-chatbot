import React from 'react';
import styled from 'styled-components';
import FileUploadButton from './FileUploadButton';
import SendButton from './SendButton';
import EmojiPickerButton from './EmojiPickerButton';
import EmojiPickerContainer from './EmojiPickerContainer';
import PdfIcon from './PdfIcon';

const StyledInput = styled.input`
  flex: 1;
  min-width: ${props => props.isMobile ? '140px' : '180px'};
  max-width: ${props => props.isMobile ? '220px' : '280px'};
  border: ${props => props.theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e4ff'};
  background: ${props => props.theme === 'dark' ? '#323742' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#f0f4f8' : '#3a4555'};
  border-radius: 24px;
  font-size: ${props => props.isMobile ? '0.85rem' : '0.9rem'};
  padding: 0.4rem 0.8rem;
  height: ${props => props.isMobile ? '32px' : '34px'}; /* Reduced height */
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  outline: none;
  
  &:focus {
    border-color: ${props => props.theme === 'dark' ? '#4a5060' : '#4a90e2'};
    box-shadow: 0 1px 5px rgba(74, 144, 226, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme === 'dark' ? '#6a7383' : '#a0a8b8'};
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.4rem; /* Reduced gap */
  padding: 0 0.2rem;
  
  @media (max-width: 480px) {
    gap: 0.3rem;
  }
`;

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
            <PdfIcon size={20} color="#ff5050" />
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
      <InputContainer>
        <FileUploadButton 
          setFile={setFile} 
          setFilePreview={setFilePreview}
          uploadButtonRotating={uploadButtonRotating}
          setUploadButtonRotating={setUploadButtonRotating}
          theme={theme}
        />
        <StyledInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          isMobile={viewport.isMobile}
          theme={theme}
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
      </InputContainer>
      
      <EmojiPickerContainer
        showEmojiPicker={showEmojiPicker}
        handleEmojiClick={handleEmojiClick}
        theme={theme}
      />
    </div>
  );
};

export default ChatInput;
