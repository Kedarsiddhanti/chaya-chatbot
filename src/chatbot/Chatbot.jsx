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
    const fileObj = e.target.files[0]
    setFile(fileObj)
    if (fileObj && fileObj.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => setFilePreview(ev.target.result)
      reader.readAsDataURL(fileObj)
    } else {
      setFilePreview(null)
    }
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
    const text = msgText !== null ? msgText : input
    if (!text.trim()) return
    const now = new Date()
    setMessages((msgs) => [
      ...msgs,
      { text, sender: 'user', time: now, status: 'sent', avatar: userAvatar }
    ])
    if (!userName) {
      setUserName(text.trim())
      setInput('')
      setBotTyping(true)
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { text: `Nice to meet you, ${text.trim()}! How can I help you today?`, sender: 'bot', time: new Date(), status: 'delivered' },
        ])
        setBotTyping(false)
      }, 1200)
      return
    }
    setInput('')
    setBotTyping(true)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { text: `You said: ${text}`, sender: 'bot', time: new Date(), status: 'delivered' },
      ])
      setBotTyping(false)
    }, 1200)
  }

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

  // Reset position when closed
  const handleClose = () => {
    setOpen(false)
    setPosition({ x: window.innerWidth - 420, y: window.innerHeight - 520 })
  }

  // Handle chat open
  const handleOpen = () => {
    setOpen(true)
    // Ensure position is correct for the larger size
    setPosition({ x: window.innerWidth - 420, y: window.innerHeight - 520 })
  }

  // Theme styles
  const themeStyles = theme === 'dark'
    ? {
        background: '#23272f',
        color: '#fafdff',
        border: '1.5px solid #333',
      }
    : {}

  return (
    
    <ChatbotContainer style={{ position: 'static' }}>
      {!open && (
        <StyledFloatingButton
          onClick={handleOpen}
          style={{
            animation: 'bounce 1.2s infinite alternate'
          }}
        >
          💬
        </StyledFloatingButton>
      )}
      {open && (
        <div style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'transform 0.2s',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          borderRadius: 18,
          width: '400px',
          height: '500px',
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
            borderRadius: 18
          }}>
            <Header
              style={{
                cursor: dragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                background: theme === 'dark'
                  ? 'linear-gradient(90deg, #23272f 60%, #3a3f4b 100%)'
                  : 'linear-gradient(90deg, #007bff 60%, #00c6ff 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                width: '100%'
              }}
              onPointerDown={handlePointerDown}
            >
              <span>
                <span style={{ fontSize: '1.5rem', marginRight: 8 }}>🤖</span>
                Chaya
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
                ? 'repeating-linear-gradient(135deg, #23272f, #23272f 20px, #2a2f3a 20px, #2a2f3a 40px)'
                : 'repeating-linear-gradient(135deg, #f7f7f7, #f7f7f7 20px, #f0f4ff 20px, #f0f4ff 40px)'
            }}>
              {messages.map((msg, i) => (
                
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  marginBottom: 2,
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}>
                  
                  <div style={{
                    fontSize: '1.3rem',
                    margin: msg.sender === 'user' ? '0 0 0 8px' : '0 8px 0 0',
                    userSelect: 'none'
                  }}>
                    {msg.sender === 'user' ? (msg.avatar || userAvatar) : BOT_AVATAR}
                  </div>
                  <MessageBubble $sender={msg.sender} style={{
                    background: msg.sender === 'user'
                      ? (theme === 'dark'
                        ? 'linear-gradient(90deg, #0056b3 70%, #00aaff 100%)'
                        : 'linear-gradient(90deg, #007bff 70%, #00c6ff 100%)')
                      : (theme === 'dark'
                        ? 'linear-gradient(90deg, #2a2f3a 70%, #3a3f4b 100%)'
                        : 'linear-gradient(90deg, #e5e5ea 70%, #f0f4ff 100%)'),
                    color: msg.sender === 'user' ? '#fff' : (theme === 'dark' ? '#fafdff' : '#222'),
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    position: 'relative',
                    animation: 'fadeInBubble 0.4s'
                  }}>
                    {msg.text}
                    {msg.file && (
                      <span style={{ display: 'block', fontSize: '0.9em', marginTop: 4 }}>
                        <span role="img" aria-label="file" style={{ marginRight: 4 }}>📄</span>
                        {msg.filePreview && msg.file.type.startsWith('image/') ? (
                          <img src={msg.filePreview} alt="preview" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 6, marginTop: 4 }} />
                        ) : msg.file.name}
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
                gap: '0.5rem',
                padding: '0.5rem 1rem 0.25rem 1rem',
                background: theme === 'dark' ? '#23272f' : '#fafdff'
              }}>
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(reply)}
                    style={{
                      background: theme === 'dark'
                        ? 'linear-gradient(90deg, #0056b3 70%, #00aaff 100%)'
                        : 'linear-gradient(90deg, #007bff 70%, #00c6ff 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '0.3rem 0.8rem',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            <StyledInputArea style={{
              maxWidth: 400,
              flexDirection: 'column',
              gap: 0,
              background: theme === 'dark' ? '#23272f' : 'transparent'
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
                    border: '1.5px solid #cce0ff',
                    background: theme === 'dark' ? '#23272f' : '#fafdff',
                    color: theme === 'dark' ? '#fafdff' : '#222',
                    borderRadius: 8,
                    fontSize: '1rem',
                    transition: 'border 0.2s'
                  }}
                />
                <button onClick={handleSend} style={{
                  flexShrink: 0,
                  background: theme === 'dark'
                    ? 'linear-gradient(90deg, #0056b3 70%, #00aaff 100%)'
                    : 'linear-gradient(90deg, #007bff 70%, #00c6ff 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.5rem 1.1rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                }}>Send</button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{
                    marginLeft: '0.5rem',
                    background: theme === 'dark'
                      ? 'linear-gradient(90deg, #0056b3 70%, #00aaff 100%)'
                      : 'linear-gradient(90deg, #007bff 70%, #00c6ff 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '2rem',
                    height: '2rem',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  title="Emoji picker"
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <div style={{
                    position: 'absolute',
                    bottom: '3.5rem',
                    right: 0,
                    zIndex: 9999
                  }}>
                    <EmojiPicker
                      theme={theme}
                      onEmojiClick={handleEmojiClick}
                      autoFocusSearch={false}
                    />
                  </div>
                )}
              </div>
              {/* Second line: + icon and upload */}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', width: '100%' }}>
                <input
                  id="file-upload"
                  type="file"
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
                    {filePreview && file.type.startsWith('image/') && (
                      <img src={filePreview} alt="preview" style={{ maxWidth: 60, maxHeight: 40, borderRadius: 6, marginRight: 8 }} />
                    )}
                    <button
                      onClick={handleFileUpload}
                      style={{
                        background: theme === 'dark'
                          ? 'linear-gradient(90deg, #0056b3 70%, #00aaff 100%)'
                          : 'linear-gradient(90deg, #007bff 70%, #00c6ff 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        marginRight: '0.5rem',
                        fontWeight: 600,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                      }}
                    >
                      Upload
                    </button>
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
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                      }}
                    >
                      Summarize
                    </button>

                    <span style={{
                      fontSize: '0.9rem',
                      maxWidth: 100,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      background: theme === 'dark' ? '#23272f' : '#fafdff',
                      borderRadius: 6,
                      padding: '0.2rem 0.5rem'
                    }}>
                      <span role="img" aria-label="file" style={{ marginRight: 4 }}>📄</span>
                      {file.name}
                    </span>
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
        `}
      </style>
    </ChatbotContainer>
  )
}

export default Chatbot


