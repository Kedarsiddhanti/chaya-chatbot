import React from 'react';
import Lottie from 'lottie-react';
import botAnimation from '../assets/bot_Animation_3.json'; // Make sure this path is correct

// Inject keyframe animations once
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
`;
if (typeof document !== 'undefined' && !document.getElementById('bot-animation-style')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'bot-animation-style';
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
}

const ChatHeader = ({ theme, handleClose, toggleTheme, viewport, isResponding }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: viewport.isMobile ? '0.5rem 1rem' : '0.6rem 1.2rem', // Reduced padding
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 100%)' 
        : 'linear-gradient(135deg, rgb(142, 185, 234) 0%, rgb(133, 184, 242) 100%)',
      color: '#fff',
      borderTopLeftRadius: viewport.width <= 768 ? 0 : '18px',
      borderTopRightRadius: viewport.width <= 768 ? 0 : '18px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        <h3 style={{
          margin: 0,
          fontWeight: 500,
          fontSize: viewport.isMobile ? '1rem' : '1.1rem', // Reduced font size
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>Chaya Assistant</h3>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: viewport.isMobile ? '1rem' : '1.1rem', // Reduced font size
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          onClick={handleClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: viewport.isMobile ? '1.2rem' : '1.3rem', // Reduced font size
            cursor: 'pointer',
            padding: '0',
            width: viewport.isMobile ? '22px' : '24px', // Reduced size
            height: viewport.isMobile ? '22px' : '24px', // Reduced size
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
  );
};

export default ChatHeader;
