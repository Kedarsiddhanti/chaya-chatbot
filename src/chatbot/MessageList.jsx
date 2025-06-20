import React from 'react'
import { MessageBubble } from './Chatbot.styles'
import PdfIcon from './PdfIcon'

/**
 * MessageList renders all chat messages, including support for
 * PDF previews, summaries with copy, and timestamps.
 */
const MessageList = ({
  messages,
  theme,
  viewport,
  hoveredSummaryIdx,
  setHoveredSummaryIdx,
  copiedSummaryIdx,
  handleCopySummary,
  formatTime
}) => (
  <>
    {messages.map((msg, i) => (
      <div key={i} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: 8,
      }}>
        {/* Sender label */}
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          marginLeft: msg.sender === 'bot' ? '12px' : undefined,
          marginRight: msg.sender === 'user' ? '12px' : undefined,
          marginBottom: '2px',
          color: theme === 'dark' ? '#a0a8b8' : '#6a7383',
        }}>
          {msg.sender === 'bot' ? 'Chaya' : 'You'}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
        }}>
          <MessageBubble
            $sender={msg.sender}
            $theme={theme}
            $viewport={viewport}
            style={{
              position: 'relative',
              paddingRight: msg.isSummary ? 38 : undefined,
              maxWidth: '80%',
              wordBreak: 'break-word',
              whiteSpace: msg.isSummary ? 'pre-wrap' : undefined
            }}
            onMouseEnter={() => msg.isSummary ? setHoveredSummaryIdx(i) : null}
            onMouseLeave={() => msg.isSummary ? setHoveredSummaryIdx(null) : null}
          >
            {/* PDF message */}
            {msg.isPdf ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: msg.sender === 'user' ? '#ffffff' : (theme === 'dark' ? '#f0f4f8' : '#3a4555')
              }}>
                <PdfIcon size={20} color="#ff5050" />
                <span style={{
                  fontStyle: 'italic',
                  color: msg.sender === 'user' ? '#ffffff' : 'inherit'
                }}>
                  {msg.text}
                </span>
              </div>
            ) : (
              msg.isSummary ? (
                <span style={{ whiteSpace: 'pre-wrap', display: 'block' }}>{msg.text}</span>
              ) : (
                msg.text
              )
            )}
            {/* File attachment (non-PDF) */}
            {msg.file && !msg.isPdf && (
              <span style={{ display: 'block', fontSize: '0.9em', marginTop: 4 }}>
                <span>📎 {msg.file.name}</span>
              </span>
            )}
            {/* Timestamp */}
            <span style={{
              fontSize: '0.7em',
              opacity: 0.9,
              marginLeft: '8px',
              float: 'right',
              marginTop: '6px',
              position: 'relative',
              bottom: '-2px',
              verticalAlign: 'sub',
              color: msg.sender === 'user' ? '#ffffff' : 'inherit',
              fontWeight: msg.sender === 'user' ? '500' : 'inherit'
            }}>
              {formatTime(msg.time)}
            </span>
            {/* Copy summary button */}
            {msg.isSummary && hoveredSummaryIdx === i && (
              <button
                onClick={() => handleCopySummary(msg.text, i)}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 8,
                  background: copiedSummaryIdx === i ? '#4caf50' : (theme === 'dark' ? '#23272f' : '#e8f4ff'),
                  color: copiedSummaryIdx === i ? '#fff' : (theme === 'dark' ? '#f0f4f8' : '#4a90e2'),
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  padding: '2px 10px',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                {copiedSummaryIdx === i ? 'Copied!' : 'Copy'}
              </button>
            )}
          </MessageBubble>
        </div>
      </div>
    ))}
  </>
)

export default MessageList