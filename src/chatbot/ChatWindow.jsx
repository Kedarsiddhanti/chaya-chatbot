import React from 'react'
import styled from 'styled-components'

// Styled container for the chat window, adapts to theme and viewport
const StyledChatWindow = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  background: ${props => props.theme === 'dark'
    ? '#2a2e38'
    : '#f0f7ff'};
  border-radius: ${props => props.viewport?.width <= 768
    ? (props.viewport?.isMobile ? '18px 18px 0 0' : '18px 18px 0 0')
    : '18px'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: none;
  box-sizing: border-box;
`

/**
 * ChatWindow wraps chat content with styled container.
 */
const ChatWindow = ({ children, theme, viewport }) => {
  return (
    <StyledChatWindow theme={theme} viewport={viewport}>
      {children}
    </StyledChatWindow>
  )
}

export default ChatWindow