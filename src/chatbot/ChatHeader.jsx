import React from 'react'
import Lottie from 'lottie-react'
import botAnimation from '../assets/bot_Animation_3.json'

// Inject keyframe animations for bot avatar effects
const styles = `
@keyframes botGlow {
  0% { box-shadow: 0 0 0px rgba(142, 185, 234, 0.0); }
  50% { box-shadow: 0 0 10px rgba(142, 185, 234, 0.8); }
  100% { box-shadow: 0 0 0px rgba(142, 185, 234, 0.0); }
}
@keyframes botPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
`
if (typeof document !== 'undefined' && !document.getElementById('bot-animation-style')) {
  const styleTag = document.createElement('style')
  styleTag.id = 'bot-animation-style'
  styleTag.innerHTML = styles
  document.head.appendChild(styleTag)
}

/**
 * ChatHeader component renders the top bar of the chatbot window,
 * including the animated bot avatar, bot name, online status,
 * theme toggle, and close button.
 */
const ChatHeader = ({ theme, handleClose, toggleTheme, viewport, isResponding }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: viewport.isMobile ? '0.5rem 1rem' : '0.6rem 1.2rem',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 100%)'
        : 'linear-gradient(135deg, rgb(142, 185, 234) 0%, rgb(133, 184, 242) 100%)',
      color: '#fff',
      borderTopLeftRadius: viewport.width <= 768 ? 0 : '18px',
      borderTopRightRadius: viewport.width <= 768 ? 0 : '18px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Bot avatar and name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: viewport.isMobile ? '36px' : '42px',
            height: viewport.isMobile ? '36px' : '42px',
            borderRadius: '50%',
            backgroundColor: isResponding ? (theme === 'dark' ? '#4a5060' : 'rgba(142, 185, 234, 0.3)') : 'transparent',
            animation: isResponding ? 'botGlow 1.5s ease-in-out infinite' : 'none',
            padding: 0,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0
          }}
        >
          <Lottie
            animationData={botAnimation}
            loop={true}
            autoplay={true}
            style={{
              width: '130%',
              height: '130%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: isResponding ? 'botPulse 2s ease-in-out infinite' : 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            margin: 0,
            fontWeight: 500,
            fontSize: viewport.isMobile ? '1rem' : '1.1rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>Chaya Bot</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'limegreen',
            }} />
            <span style={{
              fontSize: '0.75rem',
              color: theme === 'dark' ? '#d0f0c0' : '#ffffff',
              opacity: 0.8
            }}>Online</span>
          </div>
        </div>
      </div>
      {/* Theme toggle and close button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: 0,
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '2px'
          }}
        >
          {theme === 'dark' ? (
            // Sun icon for light mode
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
        <button
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: viewport.isMobile ? '1.2rem' : '1.3rem',
            cursor: 'pointer',
            padding: '0',
            width: viewport.isMobile ? '22px' : '24px',
            height: viewport.isMobile ? '22px' : '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default ChatHeader