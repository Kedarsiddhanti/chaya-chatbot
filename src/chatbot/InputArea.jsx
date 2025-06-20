import React from 'react';
import styled from 'styled-components';

// Container for the input area, responsive gap and padding
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.4rem;
  padding: 0 0.2rem;
  @media (max-width: 480px) {
    gap: 0.3rem;
  }
`;

// Styled input field, adapts to theme and viewport
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
  height: ${props => props.isMobile ? '32px' : '34px'};
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

/**
 * InputArea renders a styled input field for chat messages.
 */
const InputArea = ({ 
  input, 
  setInput, 
  handleSend, 
  placeholder, 
  theme, 
  viewport,
  onKeyDown 
}) => {
  return (
    <InputContainer>
      <StyledInput
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKeyDown || (e => e.key === 'Enter' && handleSend())}
        placeholder={placeholder || "Type a message..."}
        autoComplete="off"
        spellCheck="true"
        autoCorrect="off"
        autoCapitalize="off"
        theme={theme}
        isMobile={viewport?.isMobile}
      />
    </InputContainer>
  );
};

export default InputArea;