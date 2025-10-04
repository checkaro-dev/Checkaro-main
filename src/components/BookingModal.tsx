// components/BookingModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Phone, Mail, User, Home, MapPin, Loader2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    propertyType: '',
    inspectionDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const propertyTypes = [
    'New Home',
    'Post-Renovation',
    'Rental Move In',
    'Rental Move Out'
  ];

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

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('Booking request submitted successfully! We will contact you soon.');
        setTimeout(() => {
          setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            propertyType: '',
            inspectionDate: ''
          });
          onClose();
        }, 2000);
      } else {
        console.error('API error response:', data);
        setSubmitMessage(data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
          <h2 className="text-lg font-bold text-center mb-3 text-orange-600">Book Your Home Inspection</h2>
          <p className="text-sm text-black text-center mb-4">
            Fill out the form below and we'll get back to you within 24 hours to confirm your booking.
          </p>

          <div
            className={`
              transition-all duration-500 ease-in-out overflow-hidden text-center text-sm
              ${submitMessage
                ? 'max-h-40 opacity-100 p-3 mb-4 rounded-lg border'
                : 'max-h-0 opacity-0 p-0 mb-0 border-transparent'
              }
              ${submitMessage.includes('successfully')
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-red-100 text-red-700 border-red-200'
              }
            `}
          >
            {submitMessage}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-orange-600 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 text-black bg-white"
                  placeholder="Enter your full name"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-orange-600 mb-1">
                  Phone *
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
                    placeholder="Your phone"
                    style={{ color: '#000000' }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-orange-600 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 text-black bg-white"
                    placeholder="Your email"
                    style={{ color: '#000000' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-xs font-medium text-orange-600 mb-1">
                Property Address 
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-2 top-2 text-orange-400" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={2}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 resize-none text-black bg-white"
                  placeholder="Enter the property address"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="propertyType" className="block text-xs font-medium text-orange-600 mb-1">
                  Property Type
                </label>
                <div className="relative">
                  <Home size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-400" />
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full pl-7 pr-2 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 appearance-none bg-white text-black disabled:opacity-50"
                    style={{ color: formData.propertyType ? '#000000' : '#9CA3AF' }}
                  >
                    <option value="">Select type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type} style={{ color: '#000000' }}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inspectionDate" className="block text-xs font-medium text-orange-600 mb-1">
                  Inspection Date
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-400 pointer-events-none" />
                  <input
                    type="date"
                    id="inspectionDate"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-7 pr-2 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 disabled:opacity-50 text-black bg-white"
                    style={{ color: '#000000' }}
                  />
                </div>
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
                    Submitting...
                  </>
                ) : (
                  'Book Inspection'
                )}
              </button>
            </div>

            <div className="text-center pt-2 border-t border-gray-200">
              <p className="text-xs text-black mb-1">Or call us:</p>
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

export default BookingModal;