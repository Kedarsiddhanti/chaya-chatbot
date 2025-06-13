import React from 'react';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MessageList = ({ messages, theme, viewport, botTyping }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '1rem',
      overflowY: 'auto',
      flex: 1,
      background: theme === 'dark' ? '#23272f' : '#ffffff'
    }}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: '8px',
            maxWidth: '100%'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: msg.sender === 'user' 
                ? (theme === 'dark' ? '#4a90e2' : '#6aa9f0') 
                : (theme === 'dark' ? '#3a4050' : '#f0f7ff'),
              fontSize: '1.2rem'
            }}
          >
            {msg.sender === 'user' ? (msg.avatar || '🧑') : '🤖'}
          </div>
          <div
            style={{
              background: msg.sender === 'user'
                ? (theme === 'dark' ? '#4a90e2' : '#6aa9f0')
                : (theme === 'dark' ? '#3a4050' : '#f0f7ff'),
              color: msg.sender === 'user' ? '#fff' : (theme === 'dark' ? '#f0f4f8' : '#3a4555'),
              padding: '0.8rem 1rem',
              borderRadius: '18px',
              borderBottomLeftRadius: msg.sender === 'user' ? '18px' : '4px',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
              maxWidth: '70%',
              wordBreak: 'break-word',
              boxShadow: theme === 'dark' 
                ? '0 1px 3px rgba(0,0,0,0.2)' 
                : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {msg.isPdf ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>📄</span>
                <span>{msg.text}</span>
              </div>
            ) : (
              <div>{msg.text}</div>
            )}
            <div style={{
              fontSize: '0.7rem',
              opacity: 0.7,
              marginTop: '4px',
              textAlign: msg.sender === 'user' ? 'right' : 'left'
            }}>
              {formatTime(msg.time)}
            </div>
          </div>
        </div>
      ))}
      {botTyping && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          maxWidth: '100%'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme === 'dark' ? '#3a4050' : '#f0f7ff',
            fontSize: '1.2rem'
          }}>
            🤖
          </div>
          <div style={{
            background: theme === 'dark' ? '#3a4050' : '#f0f7ff',
            color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
            padding: '0.8rem 1rem',
            borderRadius: '18px',
            borderBottomLeftRadius: '4px',
            maxWidth: '70%',
            boxShadow: theme === 'dark' 
              ? '0 1px 3px rgba(0,0,0,0.2)' 
              : '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: theme === 'dark' ? '#f0f4f8' : '#3a4555',
                animation: 'pulse 1s infinite'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: theme === 'dark' ? '#f0f4f8' : '#3a4555',
                animation: 'pulse 1s infinite 0.2s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: theme === 'dark' ? '#f0f4f8' : '#3a4555',
                animation: 'pulse 1s infinite 0.4s'
              }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;