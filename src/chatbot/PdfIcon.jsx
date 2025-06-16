import React from 'react';
import pdfIconSvg from '../assets/pdf_icon.svg';

const PdfIcon = ({ size = 24, color = '#ffffff' }) => {
  return (
    <img 
      src={pdfIconSvg} 
      alt="PDF" 
      style={{
        width: size,
        height: size,
        display: 'block',
        filter: `drop-shadow(0 0 1px rgba(255, 255, 255, 0.8))`,
        WebkitFilter: `drop-shadow(0 0 1px rgba(255, 255, 255, 0.8))`,
        opacity: 0.9
      }}
    />
  );
};

export default PdfIcon;



