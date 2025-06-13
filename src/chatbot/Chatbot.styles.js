import styled, { keyframes } from 'styled-components'

// Animation for chat window open/close
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

export const ChatbotContainer = styled.div`
  z-index: 1000;
`

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2 60%, #6aa9f0 100%); // Lightened
  color: #fff;
  border: none;
  font-size: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); // Reduced shadow
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  &:hover {
    background: linear-gradient(135deg, #3a80d2 60%, #5a99e0 100%); // Lightened
    box-shadow: 0 6px 16px rgba(0,0,0,0.18); // Reduced shadow
  }
`

export const ChatWindow = styled.div`
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(120deg, #f8faff 60%, #edf5ff 100%), // Lightened
    repeating-linear-gradient(135deg, #f8faff, #f8faff 20px, #f0f6ff 20px, #f0f6ff 40px); // Lightened
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1.5px solid #e6eeff; // Lightened
  animation: ${fadeSlideIn} 0.4s cubic-bezier(.4,1.2,.6,1) both;
  box-sizing: border-box;
`

export const Header = styled.div`
  background: linear-gradient(90deg, #4a90e2 60%, #6aa9f0 100%); // Lightened
  color: #fff;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); // Reduced shadow
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  border-bottom: 1.5px solid #e6eeff; // Lightened
  width: 100%;
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
  padding: 1rem;
  overflow-y: auto;
  background: 
    repeating-linear-gradient(135deg, #f8faff, #f8faff 20px, #f0f6ff 20px, #f0f6ff 40px); // Lightened
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  /* Subtle inner shadow for depth */
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.02); // Reduced shadow
`

export const MessageBubble = styled.div`
  max-width: 80%;
  padding: 0.5rem 1rem;
  border-radius: 18px;
  font-size: 1rem;
  align-self: ${({ $sender }) => ($sender === 'user' ? 'flex-end' : 'flex-start')};
  background: ${({ $sender }) =>
    $sender === 'user'
      ? 'linear-gradient(90deg, #4a90e2 70%, #6aa9f0 100%)' // Lightened
      : 'linear-gradient(90deg, #e5e5ea 70%, #f0f4ff 100%)'};
  color: ${({ $sender }) => ($sender === 'user' ? '#fff' : '#222')};
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  position: relative;
  margin-bottom: 2px;
  animation: fadeIn 0.4s;
  border: ${({ $sender }) => ($sender === 'user' ? '1.5px solid #b3e0ff' : '1.5px solid #e0eaff')};
`

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background: #fff;
  border-top: 1.5px solid #e0eaff;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.03);
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  input {
    flex: 1;
    border: 1.5px solid #cce0ff;
    border-radius: 8px;
    padding: 0.5rem;
    font-size: 1rem;
    background: #fafdff;
    transition: border 0.2s;
    &:focus {
      border: 1.5px solid #007bff;
      outline: none;
    }
  }
  button {
    background: linear-gradient(90deg, #007bff 70%, #00c6ff 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    transition: background 0.2s;
    &:hover {
      background: linear-gradient(90deg, #0056b3 70%, #00aaff 100%);
    }
  }
`
