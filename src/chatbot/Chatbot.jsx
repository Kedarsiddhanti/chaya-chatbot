import axios from 'axios'
import React, { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'
import {
  ChatbotContainer,
  FloatingButton as StyledFloatingButton,
  ChatWindow as StyledChatWindow,
  Header,
  CloseButton,
  Messages as StyledMessages,
  MessageBubble,
  InputArea as StyledInputArea,
} from './Chatbot.styles'

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

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, botTyping])

  // Theme switching
  useEffect(() => {
    document.body.setAttribute('data-chatbot-theme', theme)
  }, [theme])

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

  // Handle file preview
  const handleFileChange = (e) => {
    const fileObj = e.target.files[0];
    
    // Check if file is a PDF
    if (fileObj && fileObj.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      e.target.value = null; // Reset the input
      return;
    }
    
    setFile(fileObj);
    setFilePreview(null); // No preview for PDFs
  }
  // Handle file upload
  const handleFileUpload = () => {
    if (!file) return
    setMessages((msgs) => [
      ...msgs,
      {
        text: `uploaded file: ${file.name}`,
        sender: 'bot',
        time: new Date(),
        file,
        filePreview,
        status: 'delivered'
      },
    ])
    setFile(null)
    setFilePreview(null)
  }

  // Handle send
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
          isPdf: true  // Add a flag to indicate this is a PDF
        },
      ]);
      
      // Don't reset file state here to allow summarization
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

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("http://localhost:5000/summarize", formData);
    const summary = res.data.summary;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: summary, sender: "bot", time: new Date(), status: "delivered" },
    ]);
  } catch (error) {
    console.error(error);
    alert("Something went wrong during summarization.");
  }
};

  // Message status simulation
  useEffect(() => {
    // Mark last user message as delivered after 1s
    if (messages.length > 1 && messages[messages.length - 1].sender === 'user') {
      const idx = messages.length - 1
      setTimeout(() => {
        setMessages(msgs => {
          if (msgs[idx] && msgs[idx].status === 'sent') {
            const updated = [...msgs]
            updated[idx] = { ...updated[idx], status: 'delivered' }
            return updated
          }
          return msgs
        })
      }, 1000)
    }
  }, [messages])

  // User profile: change avatar and name
  const handleAvatarChange = (e) => {
    setUserAvatar(e.target.value)
  }
  const handleNameChange = (e) => {
    setUserName(e.target.value)
  }

  // Theme toggle
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  // Update viewport state on resize
  useEffect(() => {
    const handleResize = () => {
      const width = getViewportWidth()
      setViewport({
        width,
        isMobile: width <= breakpoints.mobile,
        isTablet: width <= breakpoints.tablet && width > breakpoints.mobile
      })
      
      // Adjust chat window position based on screen size
      if (width <= breakpoints.tablet) {
        // On mobile/tablet, position at bottom
        setPosition({ 
          x: 0, 
          y: window.innerHeight - (viewport.isMobile ? 500 : 520) 
        })
      } else {
        // On desktop, position at bottom right
        setPosition({ 
          x: window.innerWidth - 420, 
          y: window.innerHeight - 520 
        })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [viewport.isMobile])

  // Reset position when closed
  const handleClose = () => {
    setOpen(false)
    
    // Position based on screen size
    if (viewport.width <= breakpoints.tablet) {
      setPosition({ x: 0, y: window.innerHeight })
    } else {
      setPosition({ x: window.innerWidth - 420, y: window.innerHeight - 520 })
    }
  }

  // Handle chat open
  const handleOpen = () => {
    setOpen(true)
    
    // Position based on screen size
    if (viewport.width <= breakpoints.tablet) {
      setPosition({ x: 0, y: window.innerHeight - (viewport.isMobile ? 500 : 520) })
    } else {
      setPosition({ x: window.innerWidth - 420, y: window.innerHeight - 520 })
    }
  }

  // Theme styles
  const themeStyles = theme === 'dark'
    ? {
        background: '#2a2e38', // Lightened from #23272f
        color: '#f0f4f8',      // Lightened from #fafdff
        border: '1.5px solid #3d4352', // Lightened from #333
      }
    : {
        background: '#f8faff', // Lightened from white
        color: '#3a4555',      // Darkened from #222 for less contrast
        border: '1.5px solid #e6eeff', // Lightened from #e0eaff
      }

  // Add a function to handle clicking outside the emoji picker
  const handleClickOutside = (e) => {
    if (showEmojiPicker && !e.target.closest('.emoji-picker-container')) {
      setShowEmojiPicker(false);
    }
  };

  // Add event listener for clicking outside
  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    
    <ChatbotContainer style={{ position: 'static' }}>
      {!open && (
        <StyledFloatingButton
          onClick={handleOpen}
          style={{
            animation: 'pulse 1.5s infinite alternate',
            bottom: viewport.isMobile ? '16px' : '24px',
            right: viewport.isMobile ? '16px' : '24px',
            width: viewport.isMobile ? '48px' : '56px',
            height: viewport.isMobile ? '48px' : '56px',
            fontSize: viewport.isMobile ? '1.7rem' : '2rem',
            background: 'linear-gradient(135deg, #4a90e2 60%, #6aa9f0 100%)', // Lightened
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)' // Reduced shadow
          }}
        >
          💬
        </StyledFloatingButton>
      )}
      {open && (
        <div style={{
          position: 'fixed',
          left: viewport.width <= breakpoints.tablet ? 0 : position.x,
          top: viewport.width <= breakpoints.tablet ? 'auto' : position.y,
          bottom: viewport.width <= breakpoints.tablet ? 0 : 'auto',
          zIndex: 1000,
          cursor: dragging ? 'grabbing' : (viewport.width <= breakpoints.tablet ? 'default' : 'grab'),
          transition: dragging ? 'none' : 'transform 0.2s',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          borderRadius: viewport.width <= breakpoints.tablet ? 
            (viewport.isMobile ? '18px 18px 0 0' : '18px 18px 0 0') : 18,
          width: viewport.width <= breakpoints.tablet ? '100%' : '400px',
          height: viewport.width <= breakpoints.tablet ? 
            (viewport.isMobile ? '90vh' : '70vh') : '500px',
          background: themeStyles.background || 'rgba(255,255,255,0.95)',
          color: themeStyles.color,
          border: themeStyles.border,
          backdropFilter: 'blur(2px)',
          padding: 0,
          overflow: 'hidden'
        }}>
          <StyledChatWindow style={{
            width: '100%',
            height: '100%',
            margin: 0,
            borderRadius: viewport.width <= breakpoints.tablet ? 
              (viewport.isMobile ? '18px 18px 0 0' : '18px 18px 0 0') : 18
          }}>
            <Header
              style={{
                cursor: viewport.width <= breakpoints.tablet ? 'default' : (dragging ? 'grabbing' : 'grab'),
                userSelect: 'none',
                background: theme === 'dark'
                  ? 'linear-gradient(90deg, #3a4050 60%, #4a5060 100%)' // Lightened
                  : 'linear-gradient(90deg, #4a90e2 60%, #6aa9f0 100%)', // Lightened from #007bff
                color: '#fff',
                fontWeight: 600,
                fontSize: viewport.isMobile ? '1rem' : '1.1rem',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', // Reduced shadow
                width: '100%',
                padding: viewport.isMobile ? '0.8rem 1rem' : '1rem 1.25rem'
              }}
              onPointerDown={viewport.width <= breakpoints.tablet ? null : handlePointerDown}
            >
              <span>
                <span style={{ 
                  fontSize: '1.5rem', 
                  marginRight: 8,
                  animation: 'botIconPulsate 2s ease-in-out infinite',
                  display: 'inline-block',
                  transformOrigin: 'center'
                }}>🤖</span>
                <span style={{ animation: 'subtle-pulse 3s infinite' }}>Chaya</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 20 }}>
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    marginRight: 5
                  }}
                  title="Toggle theme"
                >
                  {theme === 'dark' ? '🌙' : '☀️'}
                </button>
                <button 
                  onClick={handleClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0 8px',
                    alignContent: 'center',
                    display: 'flex',
                    marginRight: 10
                  }}
                >
                  ×
                </button>
              </div>
            </Header>
            
            

            {/* User profile controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.5rem 1rem 0.25rem 1rem',
              background: theme === 'dark' ? '#23272f' : '#fafdff'
            }}>
              <span style={{ fontSize: '1.3rem' }}>Avatar:</span>
              <select value={userAvatar} onChange={handleAvatarChange} style={{ fontSize: '1.2rem' }}>
                <option value="🧑">🧑</option>
                <option value="👩">👩</option>
                <option value="👨">👨</option>
                <option value="🦸">🦸</option>
                <option value="🧙">🧙</option>
                <option value="🧑‍💻">🧑‍💻</option>
                <option value="🧑‍🎨">🧑‍🎨</option>
              </select>
              <input
                type="text"
                value={userName}
                onChange={handleNameChange}
                placeholder="Your name"
                style={{
                  borderRadius: 6,
                  border: '1px solid #cce0ff',
                  padding: '0.2rem 0.5rem',
                  fontSize: '1rem',
                  background: theme === 'dark' ? '#23272f' : '#fff',
                  color: theme === 'dark' ? '#fafdff' : '#222'
                }}
              />
            </div>
            <StyledMessages style={{
              background: theme === 'dark'
                ? 'repeating-linear-gradient(135deg, #2a2e38, #2a2e38 20px, #323742 20px, #323742 40px)' // Lightened
                : 'repeating-linear-gradient(135deg, #f8faff, #f8faff 20px, #f0f6ff 20px, #f0f6ff 40px)', // Lightened
              padding: viewport.isMobile ? '0.8rem' : '1rem',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)' // Reduced shadow
            }}>
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
                  <MessageBubble $sender={msg.sender} style={{
                    background: msg.sender === 'user'
                      ? (theme === 'dark'
                        ? 'linear-gradient(90deg, #4a6da0 70%, #5a7db0 100%)' // Lightened
                        : 'linear-gradient(90deg, #4a90e2 70%, #6aa9f0 100%)') // Lightened
                      : (theme === 'dark'
                        ? 'linear-gradient(90deg, #3a4050 70%, #4a5060 100%)' // Lightened
                        : 'linear-gradient(90deg, #edf0f5 70%, #e6eeff 100%)'), // Lightened
                    color: msg.sender === 'user' ? '#fff' : (theme === 'dark' ? '#f0f4f8' : '#3a4555'),
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', // Reduced shadow
                    position: 'relative',
                    animation: 'fadeInBubble 0.4s',
                    fontSize: viewport.isMobile ? '0.95rem' : '1rem',
                    padding: viewport.isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
                    maxWidth: viewport.isMobile ? '75%' : '80%',
                    border: msg.sender === 'user'
                      ? (theme === 'dark' ? '1px solid #5a7db0' : '1px solid #6aa9f0') // Lightened
                      : (theme === 'dark' ? '1px solid #4a5060' : '1px solid #e6eeff') // Lightened
                  }}>
                    {msg.text}
                    {msg.file && (
                      <span style={{ display: 'block', fontSize: '0.9em', marginTop: 4 }}>
                        {msg.isPdf ? (
                          <span style={{ 
                            background: theme === 'dark' ? '#e05252' : '#ff5252', // Lightened from #ff0000
                            color: 'white',
                            padding: '0.1rem 0.3rem',
                            borderRadius: 4,
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            marginRight: 6,
                            display: 'inline-block',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)' // Reduced shadow
                          }}>PDF</span>
                        ) : (
                          <span role="img" aria-label="file" style={{ marginRight: 4 }}>📄</span>
                        )}
                        {msg.file.name}
                      </span>
                    )}
                    <span style={{
                      display: 'block',
                      fontSize: '0.75em',
                      color: msg.sender === 'user'
                        ? (theme === 'dark' ? '#b3e0ff' : '#e0eaff')
                        : (theme === 'dark' ? '#aaa' : '#888'),
                      marginTop: 2,
                      textAlign: msg.sender === 'user' ? 'right' : 'left'
                    }}>
                      {formatTime(msg.time)}{' '}
                      {msg.sender === 'user' && (
                        <span style={{ marginLeft: 4, fontSize: '1em' }}>
                          {msg.status === 'sent' && '🕑'}
                          {msg.status === 'delivered' && '✔️'}
                          {msg.status === 'read' && '✅'}
                        </span>
                      )}
                    </span>
                  </MessageBubble>
                </div>
              ))}
              
              {/* Typing indicators */}
              {userTyping && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginBottom: 2,
                  flexDirection: 'row-reverse'
                }}>
                  <div style={{ fontSize: '1.3rem', marginLeft: 8 }}>{userAvatar}</div>
                  <MessageBubble $sender="user" style={{
                    background: theme === 'dark'
                      ? 'linear-gradient(90deg, #0056b3 70%, #00aaff 100%)'
                      : 'linear-gradient(90deg, #007bff 70%, #00c6ff 100%)',
                    color: '#fff',
                    fontStyle: 'italic',
                    opacity: 0.7
                  }}>
                    <span className="typing">
                      <span style={{ animation: 'blink 1s infinite' }}>You are typing</span>
                      <span style={{ animation: 'blink 1s infinite 0.33s' }}>.</span>
                      <span style={{ animation: 'blink 1s infinite 0.66s' }}>.</span>
                      <span style={{ animation: 'blink 1s infinite 0.99s' }}>.</span>
                    </span>
                  </MessageBubble>
                </div>
              )}
              {botTyping && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginBottom: 2
                }}>
                  <div style={{ fontSize: '1.3rem', marginRight: 8 }}>🤖</div>
                  <MessageBubble $sender="bot" style={{
                    background: theme === 'dark'
                      ? 'linear-gradient(90deg, #2a2f3a 70%, #3a3f4b 100%)'
                      : 'linear-gradient(90deg, #e5e5ea 70%, #f0f4ff 100%)',
                    color: theme === 'dark' ? '#fafdff' : '#222',
                    fontStyle: 'italic',
                    opacity: 0.7
                  }}>
                    <span className="typing">
                      <span style={{ animation: 'blink 1s infinite' }}>Chaya is typing</span>
                      <span style={{ animation: 'blink 1s infinite 0.33s' }}>.</span>
                      <span style={{ animation: 'blink 1s infinite 0.66s' }}>.</span>
                      <span style={{ animation: 'blink 1s infinite 0.99s' }}>.</span>
                    </span>
                  </MessageBubble>
                </div>
              )}
              <div ref={messagesEndRef} />
            </StyledMessages>
            {/* Quick replies */}
            {userName && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: viewport.isMobile ? '0.4rem' : '0.5rem',
                padding: viewport.isMobile ? '0.4rem 0.8rem 0.2rem 0.8rem' : '0.5rem 1rem 0.25rem 1rem',
                background: theme === 'dark' ? '#2a2e38' : '#f8faff' // Lightened
              }}>
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply)}
                    style={{
                      background: theme === 'dark'
                        ? 'linear-gradient(90deg, #4a6da0 70%, #5a7db0 100%)' // Lightened
                        : 'linear-gradient(90deg, #4a90e2 70%, #6aa9f0 100%)', // Lightened
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: viewport.isMobile ? '0.25rem 0.6rem' : '0.3rem 0.8rem',
                      fontSize: viewport.isMobile ? '0.85rem' : '0.95rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)' // Reduced shadow
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            <StyledInputArea style={{
              maxWidth: viewport.width <= breakpoints.tablet ? '100%' : 400,
              flexDirection: 'column',
              gap: 0,
              background: theme === 'dark' ? '#2a2e38' : '#f8faff', // Lightened
              padding: viewport.isMobile ? '0.6rem' : '0.75rem',
              borderTop: theme === 'dark' ? '1px solid #3d4352' : '1px solid #e6eeff' // Lightened
            }}>
              {/* First line: input and send */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={userName ? "Type a message..." : "Enter your name..."}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    marginRight: '0.5rem',
                    border: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e4ff', // Lightened
                    background: theme === 'dark' ? '#323742' : '#ffffff', // Lightened
                    color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
                    borderRadius: 8,
                    fontSize: viewport.isMobile ? '0.95rem' : '1rem',
                    padding: viewport.isMobile ? '0.4rem' : '0.5rem',
                    transition: 'border 0.2s'
                  }}
                />
                <button onClick={handleSend} style={{
                  flexShrink: 0,
                  background: theme === 'dark'
                    ? 'linear-gradient(90deg, #4a6da0 70%, #5a7db0 100%)' // Lightened
                    : 'linear-gradient(90deg, #4a90e2 70%, #6aa9f0 100%)', // Lightened
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: viewport.isMobile ? '0.4rem 0.9rem' : '0.5rem 1.1rem',
                  fontWeight: 600,
                  fontSize: viewport.isMobile ? '0.95rem' : '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)' // Reduced shadow
                }}>Send</button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{
                    marginLeft: '0.5rem',
                    background: showEmojiPicker 
                      ? (theme === 'dark' ? '#3d4352' : '#e6eeff') // Lightened
                      : (theme === 'dark'
                        ? 'linear-gradient(90deg, #4a6da0 70%, #5a7db0 100%)' // Lightened
                        : 'linear-gradient(90deg, #4a90e2 70%, #6aa9f0 100%)'), // Lightened
                    color: showEmojiPicker 
                      ? (theme === 'dark' ? '#f0f4f8' : '#4a90e2') 
                      : '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: viewport.isMobile ? '2rem' : '2.2rem',
                    height: viewport.isMobile ? '2rem' : '2.2rem',
                    fontSize: viewport.isMobile ? '1.1rem' : '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'transform 0.2s, background 0.2s',
                    transform: showEmojiPicker ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: showEmojiPicker 
                      ? '0 0 0 2px rgba(74, 144, 226, 0.2)' // Lightened
                      : '0 1px 3px rgba(0,0,0,0.05)' // Reduced shadow
                  }}
                  title="Emoji picker"
                >
                  {showEmojiPicker ? '✕' : '😊'}
                </button>
                {showEmojiPicker && (
                  <>
                    {viewport.width > breakpoints.mobile && (
                      <div 
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 9998
                        }}
                        onClick={() => setShowEmojiPicker(false)}
                      />
                    )}
                    <div 
                      className="emoji-picker-container"
                      style={{
                        position: 'absolute',
                        bottom: viewport.isMobile ? '4.5rem' : '3.5rem',
                        right: viewport.isMobile ? '0' : '0',
                        zIndex: 9999,
                        width: viewport.isMobile ? '100%' : 'auto',
                        maxWidth: viewport.isMobile ? '100%' : '320px',
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.15)',
                        borderRadius: viewport.isMobile ? '16px 16px 0 0' : '12px',
                        overflow: 'hidden',
                        border: theme === 'dark' ? '1px solid #3a3f4b' : '1px solid #e0eaff',
                        animation: viewport.isMobile ? 'slideUpFade 0.3s ease-out' : 'fadeIn 0.2s'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        background: theme === 'dark' ? '#23272f' : '#f0f4ff',
                        borderBottom: theme === 'dark' ? '1px solid #3a3f4b' : '1px solid #e0eaff'
                      }}>
                        <span style={{ 
                          fontWeight: 'bold', 
                          fontSize: viewport.isMobile ? '0.9rem' : '1rem',
                          color: theme === 'dark' ? '#fafdff' : '#333'
                        }}>
                          Select Emoji
                        </span>
                        <button
                          onClick={() => setShowEmojiPicker(false)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            color: theme === 'dark' ? '#fafdff' : '#333',
                            padding: '0.25rem'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <EmojiPicker
                        theme={theme}
                        onEmojiClick={handleEmojiClick}
                        autoFocusSearch={false}
                        width={viewport.isMobile ? '100%' : '320px'}
                        height={viewport.isMobile ? '300px' : '350px'}
                        searchPlaceHolder="Search emoji..."
                        previewConfig={{
                          showPreview: viewport.isMobile ? false : true,
                          defaultCaption: 'Click to add',
                          defaultEmoji: '😊'
                        }}
                        skinTonesDisabled={viewport.isMobile}
                        searchDisabled={viewport.isMobile}
                        lazyLoadEmojis={true}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Second line: + icon and upload */}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', width: '100%' }}>
                <input
                  id="file-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('file-upload').click()}
                  style={{
                    background: theme === 'dark'
                      ? 'linear-gradient(90deg, #0056b3 70%, #00aaff 100%)'
                      : 'linear-gradient(90deg, #007bff 70%, #00c6ff 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    marginRight: '0.5rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                  }}
                  title="Attach file"
                >
                  +
                </button>
                {file && (
                  <>
                    <div style={{ position: 'relative', marginRight: 12 }}>
                      <div style={{ position: 'relative' }}>
                        <span style={{
                          fontSize: '0.9rem',
                          maxWidth: 100,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          background: theme === 'dark' ? '#23272f' : '#fafdff',
                          borderRadius: 6,
                          padding: '0.2rem 0.5rem',
                          display: 'inline-block'
                        }}>
                          <span style={{ 
                            background: '#ff0000',
                            color: 'white',
                            padding: '0.1rem 0.3rem',
                            borderRadius: 4,
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            marginRight: 6,
                            display: 'inline-block'
                          }}>PDF</span>
                          {file.name}
                        </span>
                        <button
                          onClick={() => { setFile(null); setFilePreview(null); }}
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#ff3b30',
                            color: 'white',
                            border: 'none',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            fontWeight: 'bold',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }}
                          title="Cancel upload"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleSummarize}
                      style={{
                        background: theme === 'dark'
                          ? 'linear-gradient(90deg, #23272f 70%, #3a3f4b 100%)'
                          : 'linear-gradient(90deg, #28a745 70%, #5cd67f 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        marginLeft: 4
                      }}
                    >
                      Summarize
                    </button>
                  </>
                )}
              </div>
            </StyledInputArea>
          </StyledChatWindow>
        </div>
      )}
      <style>
        {`
          @keyframes fadeInBubble {
            from { opacity: 0; transform: translateY(20px) scale(0.98);}
            to { opacity: 1; transform: none;}
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          @keyframes bounce {
            0% { transform: scale(1);}
            100% { transform: scale(1.08);}
          }
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 4px 16px rgba(0,0,0,0.3);}
            100% { transform: scale(1.05); box-shadow: 0 4px 20px rgba(0,0,0,0.6);}
          }
          @keyframes glow {
            0% { text-shadow: 0 0 5px rgba(255,255,255,0.5);}
            100% { text-shadow: 0 0 15px rgba(255,255,255,0.8);}
          }
          @keyframes subtle-pulse {
            0% { opacity: 0.9; }
            50% { opacity: 1; }
            100% { opacity: 0.9; }
          }
          @keyframes botIconPulsate {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </ChatbotContainer>
  )
}

export default Chatbot


