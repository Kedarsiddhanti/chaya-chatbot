import React from 'react'
import { MessageBubble } from './Chatbot.styles'

/**
 * TypingIndicator shows animated typing dots for user and bot.
 */
const TypingIndicator = ({ userTyping, botTyping, theme, viewport }) => (
  <>
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
  </>
)

export default TypingIndicator