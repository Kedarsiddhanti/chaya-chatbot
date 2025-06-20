import axios from 'axios'

/**
 * Service for handling PDF summarization.
 * Accepts a PDF file, sends it to the backend, and returns the summary.
 */
export const summarizePdf = async (file) => {
  if (!file) {
    throw new Error("No file provided")
  }
  if (file.type !== 'application/pdf') {
    throw new Error("Only PDF files are allowed")
  }

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post("http://localhost:5000/summarize", formData)
    return response.data.summary
  } catch (error) {
    throw new Error("Failed to summarize the document")
  }
}

export default {
  summarizePdf
}