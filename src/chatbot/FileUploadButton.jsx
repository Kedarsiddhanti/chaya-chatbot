import React, { useRef, useEffect, useState } from 'react';

"use no memo";

const FileUploadButton = ({ onFileSelect, theme = 'light' }) => {
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isRotated, setIsRotated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Rotate on click
  const handleClick = () => {
    if (fileInputRef.current) {
      setIsRotated(true); // Start rotation
      fileInputRef.current.value = ''; // Reset
      fileInputRef.current.click();    // Open dialog
    }
  };

  // Reset rotation when dialog closes
  useEffect(() => {
    const fileInput = fileInputRef.current;

    const handleBlur = () => {
      setTimeout(() => setIsRotated(false), 200); // Give time for selection
    };

    const handleFileChange = (e) => {
      const fileObj = e.target.files[0];

      if (fileObj && fileObj.type !== 'application/pdf') {
        alert('Only PDF files are allowed.');
        e.target.value = null;
        setIsRotated(false);
        return;
      }

      onFileSelect(fileObj || null);
      setIsRotated(false); // Reset icon even on success
    };

    if (fileInput) {
      fileInput.addEventListener('blur', handleBlur);
      fileInput.addEventListener('change', handleFileChange);
    }

    return () => {
      if (fileInput) {
        fileInput.removeEventListener('blur', handleBlur);
        fileInput.removeEventListener('change', handleFileChange);
      }
    };
  }, [onFileSelect]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
      />
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Attach PDF file"
        style={{
          background: isHovered 
            ? (theme === 'dark' ? '#3a4050' : '#daeaff') // Increased opacity for light theme
            : 'transparent',
          color: theme === 'dark' ? '#f0f4f8' : '#4a90e2',
          border: isHovered ? `1px solid ${theme === 'dark' ? '#4a5060' : '#b8d4ff'}` : 'none', // Added border on hover
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          boxShadow: isHovered 
            ? (theme === 'dark' 
                ? '0 3px 10px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)' 
                : '0 3px 10px rgba(74,144,226,0.4), 0 1px 3px rgba(74,144,226,0.3)') // Enhanced shadow
            : 'none',
          marginRight: '0.3rem',
          transition: 'all 0.2s ease',
          transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)', // Added slight scale effect
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 24 24"
          fill="none"
          width="22" // Slightly smaller to accommodate the border
          height="22" // Slightly smaller to accommodate the border
          style={{
            transition: 'transform 0.5s ease, stroke 0.2s ease',
            transform: isRotated ? 'rotate(45deg)' : 'rotate(0deg)',
            stroke: theme === 'dark' 
              ? (isHovered ? '#ffffff' : '#f0f4f8') // Brighter stroke on hover
              : (isHovered ? '#4a90e2' : '#4a90e2'),
            strokeWidth: isHovered ? 2.5 : 2, // Slightly thicker stroke on hover
            strokeLinecap: 'round'
          }}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </>
  );
};

export default FileUploadButton;










