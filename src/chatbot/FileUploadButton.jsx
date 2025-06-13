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
          background: 'transparent',
          color: theme === 'dark' ? '#f0f4f8' : '#4a90e2',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          boxShadow: 'none',
          marginRight: '0.5rem',
          transition: 'transform 0.2s',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 24 24"
          fill="none"
          width="24"
          height="24"
          style={{
            transition: 'transform 0.5s ease',
            transform: isRotated ? 'rotate(45deg)' : 'rotate(0deg)',
            stroke: theme === 'dark' ? '#f0f4f8' : '#4a90e2',
            strokeWidth: 2,
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






