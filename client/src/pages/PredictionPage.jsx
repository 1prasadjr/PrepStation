import React, { useState } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import Loader from '../components/Loader';

const PredictionPage = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type === 'application/pdf' || file.type.startsWith('image/')
    );
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => 
        file.type === 'application/pdf' || file.type.startsWith('image/')
      );
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePredict = async () => {
    if (files.length === 0) {
      setError('Please upload at least 1 file');
      return;
    }

    setLoading(true);
    setError(null);
    setPdfUrl(null);
    
    try {
      // Convert files to base64
      const filePromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve({
              name: file.name,
              type: file.type,
              data: base64
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const fileData = await Promise.all(filePromises);
      
      // Determine endpoint based on file types
      let endpoint;
      const hasImages = files.some(file => file.type.startsWith('image/'));
      const hasPDFs = files.some(file => file.type === 'application/pdf');
      
      const API_URL = import.meta.env.VITE_API_URL;

      if (hasImages && hasPDFs) {
        // Mixed files - use PDF endpoint for now
        endpoint = `${API_URL}/api/gemini/predict-base64`;
      } else if (hasImages) {
        // Only images - use image endpoint
        endpoint = `${API_URL}/api/images/predict-questions-base64`;
      } else {
        // Only PDFs - use PDF endpoint
        endpoint = `${API_URL}/api/gemini/predict-base64`;
      }

      const requestBody = hasImages && !hasPDFs 
        ? { images: fileData }
        : { files: fileData };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        // Get the PDF blob
        const pdfBlob = await response.blob();
        const url = window.URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setPrediction('predicted-questions.pdf');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setError(error.message || 'Failed to generate predictions');
    }
    
    setLoading(false);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'predicted-questions.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Optionally, revoke the object URL after download
      // window.URL.revokeObjectURL(pdfUrl);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Question Predictor
          </h1>
          <p className="text-gray-400">
            Upload your previous question papers and let our AI predict likely exam questions
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-600 hover:border-purple-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">
              Drop your files here or click to browse
            </h3>
            <p className="text-gray-400 mb-4">
              Supports PDF and image files (JPG, PNG, etc.)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer inline-block"
            >
              Select Files
            </label>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center">
              <AlertCircle className="text-red-400 mr-2" size={20} />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Uploaded Files ({files.length})
              </h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center">
                      <FileText className="text-purple-400 mr-3" size={20} />
                      <span className="text-white">{file.name}</span>
                      <span className="text-gray-400 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-3">Requirements:</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle 
                  className={`mr-2 ${files.length >= 1 ? 'text-green-400' : 'text-gray-400'}`} 
                  size={16} 
                />
                <span className={files.length >= 1 ? 'text-green-400' : 'text-gray-400'}>
                  Upload at least 1 file
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" size={16} />
                <span className="text-green-400">
                  Supported formats: PDF, JPG, PNG, GIF, BMP
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" size={16} />
                <span className="text-green-400">
                  Maximum file size: 10MB per file
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" size={16} />
                <span className="text-green-400">
                  Images will be processed with OCR for text extraction
                </span>
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handlePredict}
              disabled={files.length < 3 || loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Predictions
            </button>
          </div>
        </div>

        {/* Results Section */}
        {prediction && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-white mb-4">
              Prediction Complete!
            </h3>
            <p className="text-gray-400 mb-6">
              Your predicted question set has been generated successfully.
            </p>
            <button
              onClick={handleDownload}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center mx-auto"
            >
              <Download className="mr-2" size={20} />
              Download Predicted Question Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;