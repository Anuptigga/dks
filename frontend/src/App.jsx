// src/App.jsx - Main React component (Vite)
import { useState } from 'react';
import axios from 'axios';
import './App.css';
import FileUploader from './components/FileUploader';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import SuccessMessage from './components/SuccessMessage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle file selection
  const handleFileSelect = (selectedFiles) => {
    // Validate file types
    const validFiles = Array.from(selectedFiles).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were rejected. Only JPG, PNG, and WEBP images are allowed.');
      setTimeout(() => setError(null), 5000);
    }

    setFiles(validFiles);
    setError(null);
    setSuccess(null);
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Handle PDF conversion
  const handleConvertToPdf = async () => {
    if (files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create FormData
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      // Send request to backend
      const response = await axios.post(
        `${API_URL}/upload/images-to-pdf`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', // Important for file download
          timeout: 60000, // 60 second timeout
        }
      );

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `converted-images-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      // Show success message
      setSuccess('PDF generated successfully! Download should start automatically.');
      setFiles([]); // Clear files after successful conversion

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);

    } catch (err) {
      console.error('Conversion error:', err);

      let errorMessage = 'Failed to convert images to PDF';

      if (err.response?.data) {
        // Try to parse error from blob
        if (err.response.data instanceof Blob) {
          const text = await err.response.data.text();
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            errorMessage = text || errorMessage;
          }
        } else {
          errorMessage = err.response.data.message || err.response.data.error || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📄 Image to PDF Converter</h1>
          <p>Convert multiple images into a single PDF file</p>
        </header>

        <main className="main-content">
          {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
          {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}

          <FileUploader
            files={files}
            onFileSelect={handleFileSelect}
            onRemoveFile={handleRemoveFile}
            disabled={loading}
          />

          {loading && <LoadingSpinner />}

          {files.length > 0 && !loading && (
            <button
              className="convert-button"
              onClick={handleConvertToPdf}
              disabled={loading}
            >
              🔄 Convert to PDF ({files.length} image{files.length !== 1 ? 's' : ''})
            </button>
          )}
        </main>

        <footer className="footer">
          <p>Supports JPG, PNG, and WEBP formats • Max 10MB per image • Max 20 images</p>
        </footer>
      </div>
    </div>
  );
}

export default App;