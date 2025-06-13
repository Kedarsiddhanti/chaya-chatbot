import React, { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'
import {
  ChatbotContainer,
  FloatingButton,
  ChatWindow,
  Header,
  CloseButton,
  Messages,
  MessageBubble,
  InputArea,
} from './Chatbot.styles'
import FileUploadButton from './FileUploadButton'
import QuickReplies from './QuickReplies'
import { summarizePdf } from './SummarizeService'
import SendButton from './SendButton'
import ChatInput from './ChatInput'
import ChatHeader from './ChatHeader'

// Add responsive breakpoints
const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024
}

// Helper function to check current viewport
const getViewportWidth = () => {
  return window.innerWidth || document.documentElement.clientWidth
}

const BOT_AVATAR = "🤖"
const DEFAULT_USER_AVATAR = "🧑"
const QUICK_REPLIES = [
  "Tell me a joke",
  "What's the weather?",
  "Help",
  "Show me an emoji 😄"
]

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Chatbot() {
  // Theme: 'light' or 'dark'
  const [theme, setTheme] = useState('light')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: 'Hi! What is your name?', sender: 'bot', time: new Date(), status: 'delivered' },
  ])
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState(DEFAULT_USER_AVATAR)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [botTyping, setBotTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const [uploadButtonRotating, setUploadButtonRotating] = useState(false)
  const messagesEndRef = useRef(null)

  // Position state for the chat window (bottom right)
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 520 })
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Add state to track viewport size
  const [viewport, setViewport] = useState({
    width: getViewportWidth(),
    isMobile: getViewportWidth() <= breakpoints.mobile,
    isTablet: getViewportWidth() <= breakpoints.tablet && getViewportWidth() > breakpoints.mobile
  })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, botTyping])

  // Theme switching
  useEffect(() => {
    document.body.setAttribute('data-chatbot-theme', theme)
  }, [theme])

  // Set a default user avatar and name
  useEffect(() => {
    if (!userAvatar) {
      setUserAvatar(DEFAULT_USER_AVATAR);
    }
    
    // Try to load saved name from localStorage
    try {
      const savedName = localStorage.getItem('chatbot-user-name');
      if (savedName) {
        setUserName(savedName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  }, [userAvatar]);

  // Save user name to localStorage when it changes
  useEffect(() => {
    if (userName) {
      try {
        localStorage.setItem('chatbot-user-name', userName);
      } catch (error) {
        console.error('Error saving user name:', error);
      }
    }
  }, [userName]);

  // Handle pointer events for dragging
  const handlePointerDown = (e) => {
    setDragging(true)
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e) => {
    if (!dragging) return
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    })
  }

  const handlePointerUp = () => {
    setDragging(false)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  // User typing indicator
  useEffect(() => {
    if (!input) {
      setUserTyping(false)
      return
    }
    setUserTyping(true)
    const timeout = setTimeout(() => setUserTyping(false), 1500)
    return () => clearTimeout(timeout)
  }, [input])

  // Handle emoji picker
  const handleEmojiClick = (emojiData) => {
    setInput(input + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  // Handle file change
  const handleFileChange = (e) => {
    const fileObj = e.target.files[0];
    
    if (fileObj && fileObj.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      e.target.value = null;
      setUploadButtonRotating(false);
      return;
    }
    
    if (fileObj) {
      setFile(fileObj);
      setFilePreview(null);
    } else {
      setFile(null);
      setFilePreview(null);
      setUploadButtonRotating(false);
    }
  };

  // Handle send message
  const handleSend = (msgText = null) => {
    const text = msgText !== null ? msgText : input;
    
    // Handle file upload if a file is selected
    if (file) {
      setMessages((msgs) => [
        ...msgs,
        {
          text: `uploaded PDF: ${file.name}`,
          sender: 'user',
          time: new Date(),
          file,
          status: 'sent',
          avatar: userAvatar,
          isPdf: true
        },
      ]);
      
      // Reset file state
      setFile(null);
      setFilePreview(null);
      setUploadButtonRotating(false);
    }
    
    // Handle text message if not empty
    if (text.trim()) {
      const now = new Date();
      setMessages((msgs) => [
        ...msgs,
        { text, sender: 'user', time: now, status: 'sent', avatar: userAvatar }
      ]);
      
      if (!userName) {
        setUserName(text.trim());
        setInput('');
        setBotTyping(true);
        setTimeout(() => {
          setMessages((msgs) => [
            ...msgs,
            { text: `Nice to meet you, ${text.trim()}! How can I help you today?`, sender: 'bot', time: new Date(), status: 'delivered' },
          ]);
          setBotTyping(false);
        }, 1200);
        return;
      }
      
      setInput('');
      setBotTyping(true);
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { text: `You said: ${text}`, sender: 'bot', time: new Date(), status: 'delivered' },
        ]);
        setBotTyping(false);
      }, 1200);
    }
  };

  // Handle summarization for file uploads
  const handleSummarize = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    try {
      setBotTyping(true);
      const summary = await summarizePdf(file);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: summary, sender: "bot", time: new Date(), status: "delivered" },
      ]);
      
      setFile(null);
      setFilePreview(null);
      setUploadButtonRotating(false);
      setBotTyping(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong during summarization.");
      setBotTyping(false);
    }
  };

  // Toggle theme
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  // Reset position when closed
  const handleClose = () => {
    setOpen(false)
    
    // Position based on screen size
    if (viewport.width <= breakpoints.tablet) {
      setPosition({ x: 0, y: window.innerHeight })
    } else {
      setPosition({ x: window.innerWidth - 485, y: window.innerHeight - 570 })
    }
  }

  // Handle open
  const handleOpen = () => {
    setOpen(true)
    
    // Position based on screen size
    if (viewport.width <= breakpoints.tablet) {
      setPosition({ x: 0, y: window.innerHeight - (viewport.isMobile ? '90vh' : '75vh') })
    } else {
      setPosition({ x: window.innerWidth - 485, y: window.innerHeight - 570 })
    }
  }

  // Theme styles
  const themeStyles = theme === 'dark'
    ? {
        background: '#2a2e38',
        color: '#f0f4f8',
        border: '1.5px solid #3d4352',
      }
    : {
        background: '#f8faff',
        color: '#3a4555',
        border: '1.5px solid #e6eeff',
      }

  return (
    <ChatbotContainer>
      {!open && (
        <FloatingButton
          onClick={handleOpen}
          $isMobile={viewport.isMobile}
        >
          💬
        </FloatingButton>
      )}

      {open && (
        <div style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: viewport.width <= breakpoints.tablet ? '100%' : '380px',
          height: viewport.width <= breakpoints.tablet ? (viewport.isMobile ? '90vh' : '75vh') : '520px',
          zIndex: 1000,
          color: themeStyles.color,
          border: 'none', // Remove the border here
          backdropFilter: 'blur(2px)',
          padding: 0,
          overflow: 'hidden'
        }}>
          <ChatWindow 
            $theme={theme}
            $viewport={viewport}
            style={{ border: 'none' }} // Add this to ensure no border on the ChatWindow
          >
            <ChatHeader 
              theme={theme}
              handleClose={handleClose}
              toggleTheme={toggleTheme}
              viewport={viewport}
              isResponding={botTyping}
            />
            
            <Messages
              $theme={theme}
              $viewport={viewport}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginBottom: 2,
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{
                    fontSize: viewport.isMobile ? '1.2rem' : '1.3rem',
                    margin: msg.sender === 'user' ? '0 0 0 8px' : '0 8px 0 0',
                    userSelect: 'none'
                  }}>
                    {msg.sender === 'user' ? (msg.avatar || userAvatar) : BOT_AVATAR}
                  </div>
                  <MessageBubble
                    $sender={msg.sender}
                    $theme={theme}
                    $viewport={viewport}
                  >
                    {msg.text}
                    {msg.file && (
                      <span style={{ display: 'block', fontSize: '0.9em', marginTop: 4 }}>
                        {msg.isPdf ? (
                          <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            color: theme === 'dark' ? '#f0f4f8' : '#3a4555'
                          }}>
                            <span>📄</span>
                            <span style={{ fontStyle: 'italic' }}>{msg.file.name}</span>
                          </span>
                        ) : (
                          <span>📎 {msg.file.name}</span>
                        )}
                      </span>
                    )}
                    <span style={{ 
                      fontSize: '0.7em', 
                      opacity: 0.7, 
                      marginLeft: '4px',
                      float: 'right',
                      marginTop: '4px'
                    }}>
                      {formatTime(msg.time)}
                    </span>
                  </MessageBubble>
                </div>
              ))}
              
              {userTyping && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginBottom: 2,
                  flexDirection: 'row-reverse'
                }}>
                  <div style={{
                    fontSize: viewport.isMobile ? '1.2rem' : '1.3rem',
                    margin: '0 0 0 8px',
                    userSelect: 'none'
                  }}>
                    {userAvatar}
                  </div>
                  <MessageBubble
                    $sender="user"
                    $theme={theme}
                    $viewport={viewport}
                    style={{
                      background: theme === 'dark'
                        ? 'linear-gradient(90deg, #4a6da0 70%, #5a7db0 100%)'
                        : 'linear-gradient(90deg, #4a90e2 70%, #6aa9f0 100%)',
                      color: '#ffffff',
                      fontStyle: 'italic',
                      opacity: 0.7
                    }}
                  >
                    <span>You are typing</span>
                    <span style={{ 
                      animation: 'blink 1s infinite 0.33s',
                      color: theme === 'dark' ? '#e6eeff' : '#f0f7ff'
                    }}>.</span>
                    <span style={{ 
                      animation: 'blink 1s infinite 0.66s',
                      color: theme === 'dark' ? '#e6eeff' : '#f0f7ff'
                    }}>.</span>
                    <span style={{ 
                      animation: 'blink 1s infinite 0.99s',
                      color: theme === 'dark' ? '#e6eeff' : '#f0f7ff'
                    }}>.</span>
                  </MessageBubble>
                </div>
              )}
              
              {botTyping && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginBottom: 2,
                  flexDirection: 'row'
                }}>
                  <div style={{
                    fontSize: viewport.isMobile ? '1.2rem' : '1.3rem',
                    margin: '0 8px 0 0',
                    userSelect: 'none'
                  }}>
                    {BOT_AVATAR}
                  </div>
                  <MessageBubble
                    $sender="bot"
                    $theme={theme}
                    $viewport={viewport}
                    style={{
                      background: theme === 'dark'
                        ? 'linear-gradient(90deg, #2a2f3a 70%, #3a3f4b 100%)'
                        : 'linear-gradient(90deg, #ffffff 70%, #f8fbff 100%)',
                      fontStyle: 'italic',
                      opacity: 0.7
                    }}
                  >
                    <span>Chaya is typing</span>
                    <span style={{ 
                      animation: 'blink 1s infinite 0.33s',
                      color: theme === 'dark' ? '#e6eeff' : '#d8e6ff'
                    }}>.</span>
                    <span style={{ 
                      animation: 'blink 1s infinite 0.66s',
                      color: theme === 'dark' ? '#e6eeff' : '#d8e6ff'
                    }}>.</span>
                    <span style={{ 
                      animation: 'blink 1s infinite 0.99s',
                      color: theme === 'dark' ? '#e6eeff' : '#d8e6ff'
                    }}>.</span>
                  </MessageBubble>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </Messages>
            
            <QuickReplies 
              userName={userName}
              theme={theme}
              viewport={viewport}
              handleSend={handleSend}
              quickReplies={QUICK_REPLIES}
            />
            
            <InputArea
              $theme={theme}
              $viewport={viewport}
            >
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
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
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '0.8rem' }}>
                <FileUploadButton 
                  onFileSelect={(fileObj) => {
                    setFile(fileObj);
                    setFilePreview(fileObj ? null : null);
                  }}
                  theme={theme}
                  hasFile={file !== null}
                />
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
                    minWidth: 0,
                    marginRight: '0.5rem',
                    border: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e4ff',
                    background: theme === 'dark' ? '#323742' : '#ffffff',
                    color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
                    borderRadius: 8,
                    fontSize: viewport.isMobile ? '0.95rem' : '1rem',
                    padding: viewport.isMobile ? '0.4rem' : '0.5rem',
                    transition: 'border 0.2s'
                  }}
                />
                <SendButton 
                  handleSend={() => handleSend()} // Explicitly wrap in a function
                  input={input}
                  file={file}
                  theme={theme}
                  viewport={viewport}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="emoji-button"
                  style={{
                    marginLeft: '0.5rem',
                    background: showEmojiPicker 
                      ? (theme === 'dark' ? '#3d4352' : 'rgba(142, 185, 234, 0.3)') 
                      : (theme === 'dark'
                        ? 'linear-gradient(90deg, #4a6da0 70%, #5a7db0 100%)'
                        : 'linear-gradient(135deg, rgb(142, 185, 234) 0%, rgb(133, 184, 242) 100%)'),
                    color: showEmojiPicker 
                      ? (theme === 'dark' ? '#f0f4f8' : '#ffffff') 
                      : '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: viewport.isMobile ? '2rem' : '2.2rem',
                    height: viewport.isMobile ? '2rem' : '2.2rem',
                  }}
                  title="Emoji picker"
                >
                  {showEmojiPicker ? '✕' : '😊'}
                </button>
              </div>
            </InputArea>
            {/* Emoji picker */}
            {showEmojiPicker && (
              <div className="emoji-picker-container" style={{
                position: 'absolute',
                bottom: '70px',
                right: '10px',
                zIndex: 10,
                boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={320} />
              </div>
            )}
          </ChatWindow>
        </div>
      )}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            100% { transform: scale(1.08); box-shadow: 0 6px 16px rgba(74,144,226,0.35); }
          }
          @keyframes whatsappSpin {
            0% { transform: rotate(0deg); }
            80% { transform: rotate(385deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeInBubble {
            from { opacity: 0; transform: translateY(10px) scale(0.98);}
            to { opacity: 1; transform: none;}
          }
          @keyframes blink {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.3; }
          }
          @keyframes botIconPulsate {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes subtle-pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </ChatbotContainer>
  )
}

export default Chatbot


