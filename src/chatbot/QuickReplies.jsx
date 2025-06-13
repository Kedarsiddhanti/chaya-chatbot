import React from 'react';

const QuickReplies = ({ userName, theme, viewport, handleSend, quickReplies }) => {
  if (!userName) return null;
  
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: viewport.isMobile ? '0.5rem' : '0.6rem',
      padding: viewport.isMobile ? '0.6rem 0.8rem' : '0.7rem 1rem',
      background: theme === 'dark' ? '#2a2e38' : '#f0f7ff',
      borderTop: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff',
      position: 'relative',
      zIndex: 2,
      boxShadow: theme === 'dark' 
        ? 'inset 0 1px 3px rgba(0,0,0,0.1)' 
        : 'inset 0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {quickReplies.map((reply, idx) => (
        <button
          key={idx}
          onClick={() => handleSend(reply)}
          style={{
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 100%)' 
              : 'linear-gradient(135deg, #4a90e2 0%, #6aa9f0 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '18px',
            padding: '0.5rem 1rem',
            fontSize: viewport.isMobile ? '0.8rem' : '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: theme === 'dark' 
              ? '0 2px 4px rgba(0,0,0,0.2)' 
              : '0 2px 6px rgba(74,144,226,0.2)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = theme === 'dark' 
              ? '0 4px 8px rgba(0,0,0,0.3)' 
              : '0 4px 12px rgba(74,144,226,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = theme === 'dark' 
              ? '0 2px 4px rgba(0,0,0,0.2)' 
              : '0 2px 6px rgba(74,144,226,0.2)';
          }}
        >
          <span style={{
            position: 'relative',
            zIndex: 2
          }}>
            {reply}
          </span>
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
            opacity: theme === 'dark' ? 0.05 : 0.2,
            borderRadius: '18px'
          }}></span>
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;