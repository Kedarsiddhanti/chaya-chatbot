import styled, { keyframes } from 'styled-components'

// Animation for chat window entrance
const fadeSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

// Animation for floating button pulse
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  100% { transform: scale(1.08); box-shadow: 0 6px 16px rgba(74,144,226,0.35); }
`

// Animation for message bubble fade-in
const fadeInBubble = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.98);}
  to { opacity: 1; transform: none;}
`

// Animation for typing indicator dots
const blink = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.3; }
`

// Container for the chatbot widget
export const ChatbotContainer = styled.div`
  z-index: 1000;
  position: static;
`

// Floating chat button (shows when chat is closed)
export const FloatingButton = styled.button`
  position: fixed;
  bottom: ${props => props.$isMobile ? '16px' : '24px'};
  right: ${props => props.$isMobile ? '16px' : '24px'};
  width: ${props => props.$isMobile ? '48px' : '56px'};
  height: ${props => props.$isMobile ? '48px' : '56px'};
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2 60%, #6aa9f0 100%);
  color: #fff;
  border: none;
  font-size: ${props => props.$isMobile ? '1.7rem' : '2rem'};
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  animation: ${pulse} 0.8s infinite alternate;
  &:hover {
    background: linear-gradient(135deg, #3a80d2 0%, #4a8ad8 50%, #5a99e0 100%);
    box-shadow: 0 6px 16px rgba(0,0,0,0.18);
  }
`

// Main chat window container, responsive to viewport
export const ChatWindow = styled.div`
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  background: ${({ $theme }) => $theme === 'dark' ? '#2a2e38' : '#f0f7ff'};
  border-radius: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @media (min-width: 481px) {
    width: 95vw;
    max-width: 420px;
    height: 80vh;
    border-radius: 18px;
  }
  @media (min-width: 769px) {
    width: 380px;
    height: 520px;
    border-radius: 18px;
  }
  animation: ${fadeSlideIn} 0.4s cubic-bezier(.4,1.2,.6,1) both;
  box-sizing: border-box;
`

// Message list area, scrollable and responsive
export const Messages = styled.div`
  flex: 1;
  padding: ${props => props.$viewport.isMobile ? '0.8rem' : '1rem'};
  overflow-y: auto;
  background: ${props => props.$theme === 'dark'
    ? '#2a2e38'
    : '#f0f7ff'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.02);
  scrollbar-width: thin;
  scrollbar-color: ${props => props.$theme === 'dark' ? '#4a5060 #2a2e38' : '#c0d5f0 #e8f4ff'};
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${props => props.$theme === 'dark' ? '#2a2e38' : '#e8f4ff'};
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$theme === 'dark' ? '#4a5060' : '#c0d5f0'};
    border-radius: 4px;
  }
`

// Individual message bubble, styled for user/bot and responsive
export const MessageBubble = styled.div`
  max-width: ${props => props.$viewport.isMobile ? '90vw' : '80%'};
  padding: ${props => props.$viewport.isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem'};
  font-size: ${props => props.$viewport.isMobile ? '0.95rem' : '1rem'};
  align-self: ${props => props.$sender === 'user' ? 'flex-end' : 'flex-start'};
  background: ${props => {
    if (props.$sender === 'user') {
      return props.$theme === 'dark'
        ? 'linear-gradient(90deg, #4a6da0 70%, #5a7db0 100%)'
        : 'linear-gradient(90deg, #4a90e2 70%, #6aa9f0 100%)';
    } else {
      return props.$theme === 'dark'
        ? 'linear-gradient(90deg, #2a2f3a 70%, #3a3f4b 100%)'
        : 'linear-gradient(90deg, #ffffff 70%, #f8fbff 100%)';
    }
  }};
  color: ${props => props.$sender === 'user'
    ? '#fff'
    : (props.$theme === 'dark' ? '#f0f4f8' : '#3a4555')};
  border-radius: 18px;
  border-bottom-right-radius: ${props => props.$sender === 'user' ? '0' : '18px'};
  border-bottom-left-radius: ${props => props.$sender === 'user' ? '18px' : '0'};
  margin-bottom: 2px;
  word-break: break-word;
  white-space: pre-wrap;
  animation: ${fadeInBubble} 0.4s;
`

// Input area at the bottom of the chat window
export const InputArea = styled.div`
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: ${props => props.$theme === 'dark' ? '#2a2e38' : '#f5faff'};
  padding: ${props => props.$viewport.isMobile ? '0.5rem' : '0.6rem'};
  border-top: ${props => props.$theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff'};
  border-bottom-left-radius: ${props => props.$viewport.width <= 768 ? 0 : '18px'};
  border-bottom-right-radius: ${props => props.$viewport.width <= 768 ? 0 : '18px'};
  position: relative;
  box-sizing: border-box;
`