import React, { useState, useRef, useEffect } from 'react'
import {
  ChatbotContainer,
  FloatingButton,
  ChatWindow,
  Messages,
  InputArea,
} from './Chatbot.styles'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import TypingIndicator from './TypingIndicator'
import FilePreviewWithSummarize from './FilePreviewWithSummarize'
import ChatInput from './ChatInput'
import QuickReplies from './QuickReplies'
import EmojiPickerContainer from './EmojiPickerContainer'

const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024
}

const getViewportWidth = () => window.innerWidth || document.documentElement.clientWidth

const QUICK_REPLIES = [
  "Tell me a joke",
  "What's the weather?",
  "Help",
  "Show me an emoji 😄"
]

const LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Hindi", value: "hindi" },
  { label: "Kannada", value: "kannada" },
  { label: "Malayalam", value: "malayalam" },
  { label: "Tamil", value: "tamil" },
  { label: "Marathi", value: "marathi" },
]

// Format time for message timestamps
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Chatbot() {
  // State for theme, chat window open/close, messages, input, file upload, etc.
  const [theme, setTheme] = useState('light')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: 'Hi! What is your name?', sender: 'bot', time: new Date(), status: 'delivered' },
  ])
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [userName, setUserName] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [botTyping, setBotTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const [uploadButtonRotating, setUploadButtonRotating] = useState(false)
  const [copiedSummaryIdx, setCopiedSummaryIdx] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0].value)
  const [hoveredSummaryIdx, setHoveredSummaryIdx] = useState(null)
  const messagesEndRef = useRef(null)

  // Calculate initial chat window position based on viewport
  const calculateInitialPosition = () => {
    if (getViewportWidth() <= breakpoints.tablet) {
      return { x: 0, y: window.innerHeight }
    } else {
      const buttonSize = 38
      const chatWidth = 380
      const chatHeight = 520
      return {
        x: window.innerWidth - chatWidth - buttonSize + 20,
        y: window.innerHeight - chatHeight - 20
      }
    }
  }
  const [position, setPosition] = useState(calculateInitialPosition())
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const [viewport, setViewport] = useState({
    width: getViewportWidth(),
    isMobile: getViewportWidth() <= breakpoints.mobile,
    isTablet: getViewportWidth() <= breakpoints.tablet && getViewportWidth() > breakpoints.mobile
  })

  // Scroll to bottom when messages or typing state changes
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, botTyping])

  // Update theme attribute on body for global styling
  useEffect(() => {
    document.body.setAttribute('data-chatbot-theme', theme)
  }, [theme])

  // Handle sending messages and file uploads
  const handleSend = (msgText = null) => {
    const text = msgText !== null ? msgText : input
    if (file) {
      setMessages((msgs) => [
        ...msgs,
        {
          text: `uploaded PDF: ${file.name}`,
          sender: 'user',
          time: new Date(),
          file,
          status: 'sent',
          isPdf: true
        },
      ])
      setFile(null)
      setFilePreview(null)
      setUploadButtonRotating(false)
    }
    if (text.trim()) {
      const now = new Date()
      setMessages((msgs) => [
        ...msgs,
        { text, sender: 'user', time: now, status: 'sent' }
      ])
      // If userName is not set, treat first message as name
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
  }

  // Handle PDF summarization and update chat with summary
  const handleSummarize = async () => {
    if (!file) {
      alert("Please upload a file first.")
      return
    }
    const formData = new FormData()
    formData.append("file", file)
    try {
      setBotTyping(true)
      const response = await fetch(
        `http://122.165.80.8:8060/upload?method=lexrank&language=${selectedLanguage}`,
        { method: "POST", body: formData }
      )
      if (!response.ok) throw new Error("Server error")
      const data = await response.json()
      const summary = data.summary ? data.summary : "No summary returned."
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: summary, sender: "bot", time: new Date(), status: "delivered", isSummary: true },
      ])
      setTimeout(() => setCopiedSummaryIdx(null), 2000)
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Failed to summarise PDF.", sender: "bot", time: new Date(), status: "delivered" },
      ])
    } finally {
      setFile(null)
      setFilePreview(null)
      setUploadButtonRotating(false)
      setBotTyping(false)
    }
  }

  // Copy summary text to clipboard and show feedback
  const handleCopySummary = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedSummaryIdx(idx)
    setTimeout(() => setCopiedSummaryIdx(null), 2000)
  }

  // Render floating button when chat is closed, chat window when open
  return (
    <ChatbotContainer>
      {!open && (
        <FloatingButton onClick={() => setOpen(true)} $isMobile={viewport.isMobile}>
          💬
        </FloatingButton>
      )}
      {open && (
        <div style={{
          position: 'fixed',
          top: position.y - 30,
          left: position.x - 30,
          width: viewport.width <= breakpoints.tablet ? '100%' : '380px',
          height: viewport.width <= breakpoints.tablet ? (viewport.isMobile ? '90vh' : '75vh') : '520px',
          zIndex: 1000,
          border: 'none',
          backdropFilter: 'blur(2px)',
          overflow: 'hidden',
          borderRadius: viewport.width <= breakpoints.tablet ? '18px 18px 0 0' : '18px',
        }}>
          <ChatWindow $theme={theme} $viewport={viewport}>
            <ChatHeader
              theme={theme}
              handleClose={() => setOpen(false)}
              toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              viewport={viewport}
              isResponding={botTyping}
            />
            <Messages $theme={theme} $viewport={viewport}>
              <MessageList
                messages={messages}
                theme={theme}
                viewport={viewport}
                hoveredSummaryIdx={hoveredSummaryIdx}
                setHoveredSummaryIdx={setHoveredSummaryIdx}
                copiedSummaryIdx={copiedSummaryIdx}
                handleCopySummary={handleCopySummary}
                formatTime={formatTime}
              />
              <TypingIndicator userTyping={userTyping} botTyping={botTyping} theme={theme} viewport={viewport} />
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
            <InputArea $theme={theme} $viewport={viewport}>
              <FilePreviewWithSummarize
                file={file}
                theme={theme}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                handleSummarize={handleSummarize}
                setFile={setFile}
                setFilePreview={setFilePreview}
                setUploadButtonRotating={setUploadButtonRotating}
              />
              <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                file={file}
                setFile={setFile}
                filePreview={filePreview}
                setFilePreview={setFilePreview}
                uploadButtonRotating={uploadButtonRotating}
                setUploadButtonRotating={setUploadButtonRotating}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                theme={theme}
                viewport={viewport}
                userName={userName}
              />
            </InputArea>
            <EmojiPickerContainer
              showEmojiPicker={showEmojiPicker}
              handleEmojiClick={emojiData => setInput(input + emojiData.emoji)}
              theme={theme}
            />
          </ChatWindow>
        </div>
      )}
    </ChatbotContainer>
  )
}

export default Chatbot