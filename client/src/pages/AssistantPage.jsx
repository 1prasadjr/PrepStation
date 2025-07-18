import React, { useState } from 'react';
import { Send, Upload, Bot, User, Image as ImageIcon } from 'lucide-react';

const AssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI study assistant. I can help you with questions about your subjects, explain concepts, and analyze any study materials you upload. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      image: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('prompt', inputText);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/gemini/assist`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        let errorMessage = 'Failed to get response';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
        content: error.message || 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="text-center mb-8 mt-8">
        <h1 className="text-4xl font-bold text-white mb-4">PrepAgent</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Your AI-powered university study assistant. Ask questions, get explanations, and upload images for analysis. PrepAgent is here to help you succeed!
          </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl flex ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-purple-600 ml-3' 
                      : 'bg-gray-700 mr-3'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User size={20} className="text-white" />
                  ) : (
                    <Bot size={20} className="text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-white border border-gray-700'
                  }`}
                >
                  {message.image && (
                    <div className="mb-3">
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-3xl flex">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 px-4 py-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div className="flex-1">
              {selectedImage && (
                <div className="mb-3 p-2 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ImageIcon className="text-purple-400 mr-2" size={16} />
                      <span className="text-white text-sm">{selectedImage.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything about your studies..."
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={3}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <label className="absolute bottom-3 right-3 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Upload className="text-gray-400 hover:text-purple-400 transition-colors" size={20} />
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={!inputText.trim() && !selectedImage || loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg hover:from-purple-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;