import React from 'react';

const ChatHeader = ({ theme, handleClose, toggleTheme, viewport }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: viewport.isMobile ? '0.8rem 1rem' : '1rem 1.2rem',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 100%)' 
        : 'linear-gradient(135deg, #4a90e2 0%, #6aa9f0 100%)',
      color: '#fff',
      borderTopLeftRadius: viewport.width <= 768 ? 0 : '18px',
      borderTopRightRadius: viewport.width <= 768 ? 0 : '18px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>🤖</span>
        <h3 style={{ margin: 0, fontWeight: 500 }}>Chaya Assistant</h3>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
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
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;