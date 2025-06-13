import React, { useState } from 'react';

const QuickReplies = ({ userName, theme, viewport, handleSend, quickReplies }) => {
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  
  if (!userName) return null;
  
  // Match header gradient colors
  const headerGradient = theme === 'dark'
    ? 'linear-gradient(135deg, #3a4050 0%, #4a5060 50%, #5a6070 100%)'
    : 'linear-gradient(135deg, rgb(142, 185, 234) 0%, rgb(133, 184, 242) 100%)';
  
  return (
    <div style={{
      position: 'absolute',
      bottom: viewport.isMobile ? '70px' : '80px',
      right: viewport.isMobile ? '16px' : '24px',
      zIndex: 5
    }}>
      {/* Floating button to show/hide quick replies */}
      <button
        onClick={() => setShowQuickReplies(!showQuickReplies)}
        style={{
          background: headerGradient,
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: viewport.isMobile ? '40px' : '48px',
          height: viewport.isMobile ? '40px' : '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          fontSize: viewport.isMobile ? '1.2rem' : '1.4rem',
          transition: 'transform 0.2s, box-shadow 0.2s',
          transform: showQuickReplies ? 'rotate(45deg)' : 'rotate(0deg)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
          e.currentTarget.style.transform = showQuickReplies 
            ? 'rotate(45deg) scale(1.05)' 
            : 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
          e.currentTarget.style.transform = showQuickReplies 
            ? 'rotate(45deg)' 
            : 'rotate(0deg)';
        }}
      >
        {showQuickReplies ? '✕' : (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        )}
      </button>
      
      {/* Quick replies popup */}
      {showQuickReplies && (
        <div style={{
          position: 'absolute',
          bottom: viewport.isMobile ? '50px' : '60px',
          right: 0,
          background: theme === 'dark' ? '#2a2e38' : '#f0f7ff',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: theme === 'dark' 
            ? '0 4px 16px rgba(0,0,0,0.3)' 
            : '0 4px 16px rgba(0,0,0,0.15)',
          border: theme === 'dark' ? '1px solid #3d4352' : '1px solid #d8e6ff',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '180px',
          maxWidth: viewport.isMobile ? '220px' : '280px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: theme === 'dark' ? '#a0a8b8' : '#6a7383',
            marginBottom: '4px',
            paddingLeft: '4px'
          }}>
            Quick Replies
          </div>
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleSend(reply);
                setShowQuickReplies(false);
              }}
              style={{
                background: headerGradient,
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
                  : '0 2px 6px rgba(74,144,226,0.2)',
                textAlign: 'left',
                width: '100%'
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
              {reply}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickReplies;





