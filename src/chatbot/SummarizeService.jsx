import axios from 'axios';

/**
 * Service for handling PDF summarization
 */
export const summarizePdf = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  if (file.type !== 'application/pdf') {
    throw new Error("Only PDF files are allowed");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    // For testing, you can add a console.log to verify the function is called
    console.log("Summarizing file:", file.name);
    
    const response = await axios.post("http://localhost:5000/summarize", formData);
    return response.data.summary;
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("Failed to summarize the document");
  }
};

// Export as default and named export
export default {
  summarizePdf
};
