import styled, { keyframes } from 'styled-components'

// Animations
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

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  100% { transform: scale(1.08); box-shadow: 0 6px 16px rgba(74,144,226,0.35); }
`

const whatsappSpin = keyframes`
  0% { transform: rotate(0deg); }
  80% { transform: rotate(385deg); }
  100% { transform: rotate(360deg); }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const fadeInBubble = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.98);}
  to { opacity: 1; transform: none;}
`

const blink = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.3; }
`

const botIconPulsate = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const subtlePulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
`

// Base components
export const ChatbotContainer = styled.div`
  z-index: 1000;
  position: static;
`

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

export const ChatWindowWrapper = styled.div`
  position: fixed;
  top: ${props => props.$position.y}px;
  left: ${props => props.$position.x}px;
  width: ${props => props.$viewport.width <= 768 ? '100%' : '340px'}; /* Reduced from 380px to 340px */
  height: ${props => props.$viewport.width <= 768 
    ? (props.$viewport.isMobile ? '90vh' : '75vh') 
    : '520px'};
  z-index: 1000;
  color: ${props => props.$theme === 'dark' ? '#f0f4f8' : '#3a4555'};
  border: ${props => props.$theme === 'dark' 
    ? '1.5px solid #3d4352' 
    : '1.5px solid #e6eeff'};
  backdrop-filter: blur(2px);
  padding: 0;
  overflow: hidden;
`

export const ChatWindow = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  background: ${props => props.$theme === 'dark' 
    ? 'linear-gradient(135deg, #2a2e38 0%, #323742 50%, #3a3f4a 100%)'
    : 'linear-gradient(135deg, #f5faff 0%, #edf7ff 50%, #e8f4ff 100%)'};
  border-radius: ${props => props.$viewport.width <= 768 
    ? (props.$viewport.isMobile ? '18px 18px 0 0' : '18px 18px 0 0') 
    : '18px'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: none; /* Changed from 1.5px solid to none */
  animation: ${fadeSlideIn} 0.4s cubic-bezier(.4,1.2,.6,1) both;
  box-sizing: border-box;
`

export const Header = styled.div`
  background: ${props => props.$theme === 'dark'
    ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 50%, #5a6070 100%)'
    : 'linear-gradient(135deg, #4a90e2 0%, #5a9ae8 50%, #6aa9f0 100%)'};
  color: #fff;
  padding: ${props => props.$viewport.isMobile ? '0.8rem 1rem' : '1rem 1.25rem'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: ${props => props.$viewport.isMobile ? '1rem' : '1.1rem'};
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-top-left-radius: ${props => props.$viewport.width <= 768 ? 0 : '18px'};
  border-top-right-radius: ${props => props.$viewport.width <= 768 ? 0 : '18px'};
  border-bottom: 1.5px solid ${props => props.$theme === 'dark' ? '#3d4352' : '#e6eeff'};
  width: 100%;
  cursor: ${props => props.$viewport.width <= 768 
    ? 'default' 
    : (props.$dragging ? 'grabbing' : 'grab')};
  user-select: none;
`

export const HeaderTitle = styled.span`
  display: flex;
  align-items: center;
`

export const BotIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 8px;
  animation: ${botIconPulsate} 1s ease-in-out infinite;
  display: inline-block;
  transform-origin: center;
`

export const BotName = styled.span`
  animation: ${subtlePulse} 3s infinite;
`

export const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 20px;
`

export const ThemeButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 5px;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0 5px;
  margin-right: 5px;
  
  &:hover {
    color: #e0eaff;
  }
`

export const Messages = styled.div`
  flex: 1;
  padding: ${props => props.$viewport.isMobile ? '0.8rem' : '1rem'};
  overflow-y: scroll;
  background: ${props => props.$theme === 'dark'
    ? '#2a2e38' /* Removed the repeating linear gradient pattern */
    : '#f0f7ff'}; /* Simplified to a solid color */
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

export const MessageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 2px;
  flex-direction: ${props => props.$sender === 'user' ? 'row-reverse' : 'row'};
`

export const Avatar = styled.div`
  font-size: ${props => props.$viewport.isMobile ? '1.2rem' : '1.3rem'};
  margin: ${props => props.$sender === 'user' ? '0 0 0 8px' : '0 8px 0 0'};
  user-select: none;
`

export const MessageBubble = styled.div`
  max-width: ${props => props.$viewport.isMobile ? '75%' : '80%'};
  padding: ${props => props.$viewport.isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem'};
  font-size: ${props => props.$viewport.isMobile ? '0.95rem' : '1rem'};
  align-self: ${props => props.$sender === 'user' ? 'flex-end' : 'flex-start'};
  background: ${props => {
    if (props.$sender === 'user') {
      return props.$theme === 'dark'
        ? 'linear-gradient(135deg, rgb(142, 185, 234) 0%, rgb(133, 184, 242) 100%)' // Match header gradient
        : 'linear-gradient(135deg, rgb(142, 185, 234) 0%, rgb(133, 184, 242) 100%)'; // Same for light theme
    } else {
      return props.$theme === 'dark'
        ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 50%, #5a6070 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f5f8ff 50%, #f0f7ff 100%)';
    }
  }};
  color: ${props => {
    if (props.$sender === 'user') {
      return '#ffffff'; // White text for user messages in both themes
    } else {
      return props.$theme === 'dark' ? '#f0f4f8' : '#3a4555';
    }
  }};
  box-shadow: ${props => props.$sender === 'user' ? 
    '0 2px 5px rgba(0,0,0,0.1)' : 
    '0 1px 3px rgba(0,0,0,0.04)'};
  position: relative;
  animation: ${fadeInBubble} 0.4s;
  border: ${props => {
    if (props.$sender === 'user') {
      return props.$theme === 'dark' 
        ? '1px solid rgb(133, 184, 242)' // Matching border for dark theme
        : '1px solid rgb(133, 184, 242)'; // Matching border for light theme
    } else {
      return props.$theme === 'dark' ? '1px solid #4a5060' : '1px solid #d8e6ff';
    }
  }};
  
  /* Adjust border radius to create speech bubble effect */
  border-radius: 18px;
  border-bottom-right-radius: ${props => props.$sender === 'user' ? '0' : '18px'};
  border-bottom-left-radius: ${props => props.$sender === 'user' ? '18px' : '0'};
`

export const TypingIndicatorContainer = styled(MessageContainer)`
  margin-bottom: 2px;
`

export const TypingBubble = styled(MessageBubble)`
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
  color: ${props => props.$theme === 'dark' ? '#fafdff' : '#3a4555'};
  font-style: italic;
  opacity: 0.7;
  border: ${props => {
    if (props.$sender === 'user') {
      return props.$theme === 'dark' ? '1px solid #5a7db0' : '1px solid #6aa9f0';
    } else {
      return props.$theme === 'dark' ? '1px solid #4a5060' : '1px solid #d8e6ff';
    }
  }};
`

export const TypingDot = styled.span`
  animation: ${blink} 1s infinite;
  animation-delay: ${props => props.$delay || '0s'};
  color: ${props => props.$theme === 'dark' ? '#e6eeff' : '#d8e6ff'};
`

export const InputArea = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px; /* Reduced gap */
  background: ${props => props.$theme === 'dark' ? '#2a2e38' : '#f5faff'};
  padding: ${props => props.$viewport.isMobile ? '0.5rem' : '0.6rem'}; /* Reduced padding */
  border-top: ${props => props.$theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff'};
  border-bottom-left-radius: ${props => props.$viewport.width <= 768 ? 0 : '18px'};
  border-bottom-right-radius: ${props => props.$viewport.width <= 768 ? 0 : '18px'};
  position: relative;
  box-sizing: border-box;
`

export const FilePreview = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: ${props => props.$theme === 'dark' ? '#3a4050' : '#e6f0ff'};
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`

export const FileIcon = styled.span`
  font-size: 1.2rem;
`

export const FileName = styled.span`
  font-size: 0.9rem;
  color: ${props => props.$theme === 'dark' ? '#f0f4f8' : '#3a4555'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const RemoveFileButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.$theme === 'dark' ? '#f0f4f8' : '#3a4555'};
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
`

export const InputControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem; /* Reduced gap */
  width: 100%;
  padding: 0 0.2rem;
`

export const TextInput = styled.input`
  flex: 1;
  min-width: ${props => props.$viewport.isMobile ? '140px' : '180px'};
  max-width: ${props => props.$viewport.isMobile ? '220px' : '280px'};
  border: ${props => props.$theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff'};
  background: ${props => props.$theme === 'dark' ? '#23272f' : '#ffffff'};
  color: ${props => props.$theme === 'dark' ? '#f0f4f8' : '#3a4555'};
  outline: none;
  font-size: 0.85rem; /* Reduced font size */
  padding: 0.4rem 0.8rem; /* Reduced padding */
  height: ${props => props.$viewport.isMobile ? '32px' : '34px'}; /* Reduced height */
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: border 0.2s, box-shadow 0.2s;
  
  &:focus {
    border-color: ${props => props.$theme === 'dark' ? '#4a5060' : '#4a90e2'};
    box-shadow: 0 1px 5px rgba(74, 144, 226, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.$theme === 'dark' ? '#6a7383' : '#a0a8b8'};
  }
`

export const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: ${props => props.$viewport.isMobile ? '60px' : '70px'};
  right: ${props => props.$viewport.isMobile ? '5px' : '10px'};
  z-index: 10;
  box-shadow: ${props => props.$theme === 'dark' 
    ? '0 5px 20px rgba(0,0,0,0.3)' 
    : '0 5px 20px rgba(0,0,0,0.15)'};
  border-radius: 10px;
  overflow: hidden;
  border: ${props => props.$theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff'};
`
