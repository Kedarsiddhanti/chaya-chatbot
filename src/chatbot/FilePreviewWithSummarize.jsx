import React from 'react'
import PdfIcon from './PdfIcon'

const LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Hindi", value: "hindi" },
  { label: "Kannada", value: "kannada" },
  { label: "Malayalam", value: "malayalam" },
  { label: "Tamil", value: "tamil" },
  { label: "Marathi", value: "marathi" },
]

/**
 * FilePreviewWithSummarize displays a preview of the uploaded PDF file,
 * allows language selection, and provides a button to trigger summarization.
 * Also includes a button to remove the file.
 */
function FilePreviewWithSummarize({
  file,
  theme,
  selectedLanguage,
  setSelectedLanguage,
  handleSummarize,
  setFile,
  setFilePreview,
  setUploadButtonRotating,
}) {
  if (!file) return null
  // Responsive: adjust maxWidth and fontSize for mobile
  const isMobile = window.innerWidth <= 480
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      maxWidth: isMobile ? '98%' : '90%',
      width: isMobile ? '98%' : '90%',
      margin: '0 auto 0.5rem',
      background: theme === 'dark' ? '#3a4050' : '#e6f0ff',
      padding: isMobile ? '0.4rem 0.5rem' : '0.5rem 0.75rem',
      borderRadius: '8px'
    }}>
      {/* File icon and file name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '4px' : '8px',
        flex: 1,
        paddingLeft: isMobile ? '2px' : '4px'
      }}>
        <PdfIcon size={isMobile ? 16 : 20} color="#ff5050" />
        <span style={{
          fontSize: isMobile ? '0.85rem' : '0.95rem',
          fontWeight: '400',
          color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          paddingTop: '2px',
          maxWidth: isMobile ? '90px' : '130px'
        }}>
          {file.name}
        </span>
        {/* Language selection and summarize button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '4px' : '6px',
          marginLeft: isMobile ? '4px' : '8px',
          minWidth: isMobile ? '90px' : '120px'
        }}>
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            style={{
              padding: isMobile ? '2px 4px' : '2px 8px',
              borderRadius: '4px',
              border: theme === 'dark' ? '1px solid #3d4352' : '1px solid #b8d4ff',
              background: theme === 'dark' ? '#23272f' : '#fff',
              color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {LANGUAGE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
  onClick={handleSummarize}
  style={{
    background: theme === 'dark' ? '#4fc3f7' : '#42a5f5',
    border: 'none',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: isMobile ? '0.75rem' : '0.8rem',
    padding: isMobile ? '3px 8px' : '4px 10px',
    cursor: 'pointer',
    height: isMobile ? '24px' : '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    transition: 'transform 0.1s ease-in-out, background 0.2s, box-shadow 0.2s'
  }}
  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.background = theme === 'dark' ? '#4fc3f7' : '#42a5f5';
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    e.currentTarget.style.background = theme === 'dark' ? '#81d4fa' : '#64b5f6'; // lighter color
  }}
>
  Summarize
</button>


        </div>
      </div>
      {/* Remove file button */}
      <div style={{ display: 'flex', marginLeft: isMobile ? '4px' : '8px' }}>
        <button
          onClick={() => {
            setFile(null);
            setFilePreview(null);
            setUploadButtonRotating(false);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: theme === 'dark' ? '#f0f4f8' : '#3a4555',
            cursor: 'pointer',
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? '22px' : '28px',
            height: isMobile ? '22px' : '28px',
            lineHeight: 1
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default FilePreviewWithSummarize