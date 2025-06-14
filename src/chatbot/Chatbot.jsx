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
import PdfIcon from './PdfIcon';

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

  // Calculate initial position
  const calculateInitialPosition = () => {
    if (getViewportWidth() <= breakpoints.tablet) {
      return { x: 0, y: window.innerHeight }
    } else {
      const buttonSize = 38; // Size of the floating button when chat is open
      const chatWidth = 380;
      const chatHeight = 520;
      
      // Position the chat window to touch the floating button with additional offset
      return { 
        x: window.innerWidth - chatWidth - buttonSize + 20, // Added 20px offset towards left
        y: window.innerHeight - chatHeight - 20 // Added 20px offset towards top
      }
    }
  }

  // Position state for the chat window (bottom right)
  const [position, setPosition] = useState(calculateInitialPosition())
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
      // Adjust position to make the chat window touch the floating button
      const buttonSize = 38; // Size of the floating button when chat is open
      const chatWidth = 380;
      const chatHeight = 520;
      
      // Position the chat window with additional offset
      setPosition({ 
        x: window.innerWidth - chatWidth - buttonSize + 20, // Added 20px offset towards left
        y: window.innerHeight - chatHeight - 20 // Added 20px offset towards top
      })
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
      {/* Always show the floating button, but position it differently when chat is open */}
      <FloatingButton
        onClick={open ? handleClose : handleOpen}
        $isMobile={viewport.isMobile}
        className="floating-button"
        style={{
          boxShadow: open ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 6px 20px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(74, 144, 226, 0.25)',
          animation: open ? 'none' : 'pulse 0.8s infinite alternate',
          opacity: open ? 0.75 : 1, // Reduced opacity when open
          visibility: 'visible',
          pointerEvents: 'auto',
          position: 'fixed',
          bottom: viewport.isMobile 
            ? (open ? '19px' : '9px')
            : (open ? '20px' : '9px'),
          right: viewport.isMobile 
            ? (open ? '19px' : '9px')
            : (open ? '20px' : '9px'),
          zIndex: open ? 1002 : 1001,
          transform: 'rotate(0deg)',
          background: theme === 'dark' 
            ? (open ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 100%)' : 'linear-gradient(135deg, #3a4050 60%, #4a5060 100%)')
            : (open ? 'linear-gradient(135deg, #4a90e2 0%, #5a9ae8 100%)' : 'linear-gradient(135deg, #4a90e2 60%, #6aa9f0 100%)'),
          width: open ? (viewport.isMobile ? '28px' : '34px') : (viewport.isMobile ? '48px' : '56px'),
          height: open ? (viewport.isMobile ? '28px' : '34px') : (viewport.isMobile ? '48px' : '56px'),
          fontSize: open ? (viewport.isMobile ? '1rem' : '1.2rem') : (viewport.isMobile ? '1.7rem' : '2rem'),
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          borderRadius: '50%',
          transformOrigin: 'center center',
          filter: open ? 'brightness(0.95)' : 'none' // Slightly dimmer when open
        }}
      >
        {open ? '✕' : '💬'}
      </FloatingButton>

      {open && (
        <div style={{
          position: 'fixed',
          top: position.y - 30, // Move 25px up towards top (original 20px + 5px more)
          left: position.x - 30, // Move 25px left towards corner (original 20px + 5px more)
          width: viewport.width <= breakpoints.tablet ? '100%' : '380px',
          height: viewport.width <= breakpoints.tablet ? (viewport.isMobile ? '90vh' : '75vh') : '520px',
          zIndex: 1000,
          color: themeStyles.color,
          border: 'none',
          backdropFilter: 'blur(2px)',
          padding: 0,
          overflow: 'hidden',
          boxShadow: theme === 'dark' 
            ? '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 0, 0, 0.2)' 
            : '0 8px 30px rgba(0, 0, 0, 0.15), 0 0 15px rgba(74, 144, 226, 0.1)',
          borderRadius: viewport.width <= breakpoints.tablet ? '18px 18px 0 0' : '18px',
          animation: 'fadeSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          marginBottom: '60px'
        }}>
          <ChatWindow 
            $theme={theme}
            $viewport={viewport}
            style={{ 
              border: 'none',
              background: theme === 'dark' 
                ? '#2a2e38' // Solid dark background
                : '#f0f7ff', // Solid light background
              backgroundImage: 'none' // Explicitly remove any background image
            }} 
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
              style={{
                background: theme === 'dark' 
                  ? '#2a2e38' // Solid dark background
                  : '#f0f7ff', // Solid light background
                backgroundImage: 'none' // Explicitly remove any background image
              }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 8,
                }}>
                  {/* Add name tag above message */}
                  {msg.sender === 'bot' ? (
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      marginLeft: '12px',
                      marginBottom: '2px',
                      color: theme === 'dark' ? '#a0a8b8' : '#6a7383',
                    }}>
                      Chaya
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      marginRight: '12px',
                      marginBottom: '2px',
                      color: theme === 'dark' ? '#a0a8b8' : '#6a7383',
                    }}>
                      You
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                  }}>
                    <MessageBubble
                      $sender={msg.sender}
                      $theme={theme}
                      $viewport={viewport}
                    >
                      {msg.isPdf ? (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          color: msg.sender === 'user' ? '#ffffff' : (theme === 'dark' ? '#f0f4f8' : '#3a4555')
                        }}>
                          <PdfIcon size={20} color="#ff5050" />
                          <span style={{ 
                            fontStyle: 'italic',
                            color: msg.sender === 'user' ? '#ffffff' : 'inherit'
                          }}>
                            {msg.text}
                          </span>
                        </div>
                      ) : (
                        msg.text
                      )}
                      {msg.file && !msg.isPdf && (
                        <span style={{ display: 'block', fontSize: '0.9em', marginTop: 4 }}>
                          <span>📎 {msg.file.name}</span>
                        </span>
                      )}
                      <span style={{ 
                        fontSize: '0.7em', 
                        opacity: 0.9,
                        marginLeft: '8px',
                        float: 'right',
                        marginTop: '6px',
                        position: 'relative',
                        bottom: '-2px',
                        verticalAlign: 'sub',
                        color: msg.sender === 'user' ? '#ffffff' : 'inherit',
                        fontWeight: msg.sender === 'user' ? '500' : 'inherit'
                      }}>
                        {formatTime(msg.time)}
                      </span>
                    </MessageBubble>
                  </div>
                </div>
              ))}
              
              {userTyping && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  marginBottom: 8,
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    marginRight: '12px',
                    marginBottom: '2px',
                    color: theme === 'dark' ? '#a0a8b8' : '#6a7383',
                  }}>
                    You
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexDirection: 'row-reverse'
                  }}>
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
                </div>
              )}
              
              {botTyping && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    marginLeft: '12px',
                    marginBottom: '2px',
                    color: theme === 'dark' ? '#a0a8b8' : '#6a7383',
                  }}>
                    Chaya
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexDirection: 'row'
                  }}>
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
              hasFilePreview={file !== null}
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
                  maxWidth: '90%', // Limit width to create space on both sides
                  width: '90%', // Set width to be less than 100%
                  margin: '0 auto 0.5rem', // Center horizontally with bottom margin
                  background: theme === 'dark' ? '#3a4050' : '#e6f0ff',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    flex: 1,
                    paddingLeft: '4px'
                  }}>
                    <PdfIcon size={20} color="#ff5050" />
                    <span style={{ 
                      fontSize: '0.95rem',
                      fontWeight: '400',
                      color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingTop: '2px'
                    }}>
                      {file.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', marginRight: '4px' }}>
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
                        fontSize: '1.5rem',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%', 
                gap: '0.4rem', /* Reduced gap */
                padding: '0 0.2rem'
              }}>
                <FileUploadButton 
                  onFileSelect={(fileObj) => {
                    setFile(fileObj);
                    setFilePreview(fileObj ? null : null);
                  }}
                  theme={theme}
                  hasFile={file !== null}
                  style={{ 
                    flexShrink: 0,
                    width: viewport.isMobile ? '30px' : '34px', /* Reduced size */
                    height: viewport.isMobile ? '30px' : '34px' /* Reduced size */
                  }}
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
                    minWidth: viewport.isMobile ? '140px' : '180px',
                    maxWidth: viewport.isMobile ? '220px' : '280px',
                    border: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e4ff',
                    background: theme === 'dark' ? '#323742' : '#ffffff',
                    color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
                    borderRadius: 24,
                    fontSize: viewport.isMobile ? '0.85rem' : '0.9rem', /* Reduced font size */
                    padding: '0.4rem 0.8rem', /* Reduced padding */
                    height: viewport.isMobile ? '32px' : '34px', /* Reduced height */
                    transition: 'border 0.2s, box-shadow 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    outline: 'none'
                  }}
                />
                <SendButton 
                  handleSend={() => handleSend()}
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
          @keyframes fadeSlideIn {
            from { 
              opacity: 0; 
              transform: translateY(40px) scale(0.95);
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </ChatbotContainer>
  )
}

export default Chatbot


