import React, { useRef, useEffect, useState } from 'react';

"use no memo";

const FileUploadButton = ({ onFileSelect, theme = 'light' }) => {
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isRotated, setIsRotated] = useState(false);

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
        aria-label="Attach PDF file"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(90deg, #3a4050 0%, #4a5060 100%)'
            : 'linear-gradient(90deg, #4a90e2 0%, #6aa9f0 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '2.4rem',
          height: '2.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginRight: '0.5rem'
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 24 24"
          fill="none"
          width="20"
          height="20"
          style={{
            transition: 'transform 0.5s ease',
            transform: isRotated ? 'rotate(45deg)' : 'rotate(0deg)',
            stroke: theme === 'dark' ? '#d8e6ff' : '#ffffff',
          }}
        >
          <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </>
  );
};

export default FileUploadButton;
