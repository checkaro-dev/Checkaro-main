'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, Download, Loader2 } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    phone: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Display modal for 15 seconds before closing automatically
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 15000); // 15 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Message fade away effect
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage('');
      }, 5000); // Message disappears after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    console.log('=== DOWNLOAD FORM SUBMIT ===');
    console.log('Form data being submitted:', formData);
    console.log('Current URL:', window.location.href);
    console.log('API endpoint will be:', '/api/download-sample');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('/api/download-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        
        setSubmitMessage('Download started! Check your downloads folder.');
        console.log('Download request submitted successfully:', data.downloadId);
        
        // Trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = '/sample_report.pdf';
        downloadLink.download = 'sample_report.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => {
          setFormData({
            phone: '',
            email: ''
          });
          onClose();
        }, 2000);
      } else {
        const data = await response.json();
        console.error('API error response:', data);
        setSubmitMessage(data.message || 'Failed to process download. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timeout');
        setSubmitMessage('Request took too long. Please try again.');
      } else {
        console.error('=== FETCH ERROR ===');
        console.error('Error submitting download request:', error);
        setSubmitMessage('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md my-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-orange-500 hover:text-orange-700 transition-colors z-10"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <div className="p-5">
          <h2 className="text-lg font-bold text-center mb-3 text-orange-600">Download Sample Report</h2>
          <p className="text-sm text-black text-center mb-4">
            Enter your contact details below to download our comprehensive home inspection sample report.
          </p>

          {/* Message container with fade effect */}
          <div
            className={`
              transition-all duration-500 ease-in-out overflow-hidden text-center text-sm
              ${submitMessage
                ? 'max-h-40 opacity-100 p-3 mb-4 rounded-lg border'
                : 'max-h-0 opacity-0 p-0 mb-0 border-transparent'
              }
              ${submitMessage.includes('started')
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-red-100 text-red-700 border-red-200'
              }
            `}
          >
            {submitMessage}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-orange-600 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 text-black bg-white"
                  placeholder="Enter your phone number"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-orange-600 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 text-black bg-white"
                  placeholder="Enter your email address"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 text-xs border border-gray-300 text-black rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin mr-1" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download size={12} className="mr-1" />
                    Download Report
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2 border-t border-gray-200">
              <p className="text-xs text-black mb-1">Need help?</p>
              <a
                href="tel:7396360908"
                className="inline-flex items-center space-x-1 text-sm text-orange-600 font-medium hover:text-orange-700"
              >
                <Phone size={14} />
                <span>7396360908</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;