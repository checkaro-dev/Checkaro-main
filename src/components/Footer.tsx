'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp,
  Users,
  Clock,
  Send,
  Home,
  Settings,
  Building,
  Info,
  Contact,
  Search,
  ExternalLink,
  Award,
  FileText,
  Calendar,
  Loader2
} from 'lucide-react';

const Footer: React.FC = () => {
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

  // Social media links
  const socialMediaLinks = [
    { 
      src: "/icons/facebook.png", 
      alt: "Facebook", 
      href: "https://www.facebook.com/profile.php?id=61576993065560" 
    },
    { 
      src: "/icons/linkdin.png", 
      alt: "LinkedIn", 
      href: "https://www.linkedin.com/in/checkaro-home-inspection-2192b6320" 
    },
    { 
      src: "/icons/instagram_rem_bg.png", 
      alt: "Instagram", 
      href: "https://www.instagram.com/checkaro_homeinspection?igsh=N2MxOTRqNnNoODQ4" 
    },
    { 
      src: "/icons/youtube_2.png", 
      alt: "YouTube", 
      href: "#" 
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission - integrated with backend
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
        }, 2000);
      } else {
        setSubmitMessage(data.message || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-fade submit message after 5 seconds
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const sectionTitleAnimation = {
    initial: { opacity: 0},
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.64, ease: "easeOut" }
  };

  // Quick Links Data
  const quickLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Settings },
    { name: 'Portfolio', href: '/portfolio', icon: Building },
    { name: 'About Us', href: '/aboutus', icon: Info },
  ];

  const serviceLinks = [
    { name: 'New Home Inspection', href: '/services#services' },
    { name: 'Post-Renovation', href: '/services#services' },
    { name: 'Rental Move In/Out', href: '/services#services' },
  ];

  const companyLinks = [
    { name: 'Our core commitments', href: '/aboutus#ourcorecommitments' },
    { name: 'Our Team', href: '/aboutus#ourteam' },
    { name: 'Our Process', href: '/#processsteps' },
    { name: 'Packages', href: '/#packages' },
  ];

  return (
    <div className="bg-gray-900 text-white">
      {/* Contact Section */}
      <section id="contact" className="py-16 border-b border-gray-800 overflow-hidden">
        <div className="container mx-auto px-3">
          <motion.div {...sectionTitleAnimation} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <div className="h-1 w-24 mt-3 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            <p className="text-white mt-4 max-w-xl mx-auto text-lg">
              Have questions or ready to book an inspection? Contact us today and let's secure your tomorrow!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.56, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="ml-8">
                <h3 className="text-lg font-bold mb-6 flex items-center">
                  <Users className="w-5 h-5 text-orange-400 mr-2" />
                  Contact Information
                </h3>
                
                <div className="space-y-5">
                  <motion.div 
                    className="flex items-center space-x-3 group"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.16 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow duration-240">
                      <Phone className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-s text-white">Call Us</p>
                      <a href="tel:+917396360908" className="text-white hover:text-orange-400 transition-colors duration-240 text-base font-medium">
                        +91 7396360908
                      </a>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center space-x-3 group"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.16 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow duration-240">
                      <Mail className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-s text-white">Email Us</p>
                      <a href="mailto:info@checkaro.in" className="text-white hover:text-orange-400 transition-colors duration-240 text-base font-medium">
                        info@checkaro.in
                      </a>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-3 group"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.16 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-shadow duration-240">
                      <MapPin className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-s text-white">Visit Us</p>
                      <p className="text-white text-base leading-relaxed">
                        6-3-354/14, Hindi Nagar Colony,<br />
                        Banjara Hills, Hyderabad
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center space-x-3 group"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.16 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow duration-240">
                      <Clock className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-s text-white">Working Hours</p>
                      <p className="text-white text-base font-medium">Mon - Sun: 9 AM - 6 PM</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center space-x-3 ml-8">
                <span className="text-white text-s mr-1.5">Follow Us:</span>
                {socialMediaLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center transition-all duration-240 hover:scale-110"
                    whileHover={{ y: -1.5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.alt}
                  >
                    <img src={social.src} alt={social.alt} className="w-12 h-12 object-contain" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-xl"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.56, ease: "easeOut" }}
            >
              <h3 className="text-lg font-bold mb-6 flex items-center">
                <Send className="w-5 h-5 text-orange-400 mr-2" />
                Book Your Home Inspection
              </h3>
              <p className="text-white mb-5 text-m">
                Fill out the form below and we'll get back to you within 24 hours to confirm your booking.
              </p>
              
              {/* Submit Message with Fade Effect */}
              <div
                className={`
                  transition-all duration-500 ease-in-out overflow-hidden text-center text-m
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
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-3">
                  <motion.input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-240 placeholder-white text-m"
                    required
                    disabled={isSubmitting}
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-240 placeholder-white text-m"
                    required
                    disabled={isSubmitting}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Email Address (Optional)"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-240 placeholder-white text-m"
                  disabled={isSubmitting}
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.textarea
                  name="address"
                  placeholder="Property Address (Optional)"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-240 placeholder-white resize-none text-m"
                  disabled={isSubmitting}
                  whileFocus={{ scale: 1.02 }}
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <motion.select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-240 placeholder-white text-m"
                    disabled={isSubmitting}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="" className="text-white">Select Property Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </motion.select>
                  <motion.input
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-240 placeholder-white text-m"
                    required
                    disabled={isSubmitting}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-240 font-semibold text-base shadow-md disabled:opacity-50 flex items-center justify-center"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, y: -1.5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Book Inspection'
                  )}
                </motion.button>
                
                <div className="text-center pt-3 border-t border-gray-600">
                  <p className="text-s text-white mb-2">Or call us directly:</p>
                  <a
                    href="tel:7396360908"
                    className="inline-flex items-center space-x-1.5 text-orange-400 font-medium hover:text-orange-300 transition-colors duration-240"
                  >
                    <Phone className="w-3 h-3" />
                    <span className="text-m">7396360908</span>
                  </a>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Footer Section with Quick Links */}
      <footer className="py-12 bg-gray-800 overflow-hidden">
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-5">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Home className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ChecKaro</h3>
                  <p className="text-s text-orange-400">Inspect Today | Secure Tomorrow</p>
                </div>
              </div>
              <p className="text-white text-s leading-relaxed max-w-xs">
                Professional home inspection services to help you make informed decisions about your property investment.
              </p>
              <div className="flex items-center space-x-1.5 text-s text-white">
                <Award className="w-3 h-3 text-orange-400" />
                <span>ISO Certified | 1000+ Inspections</span>
              </div>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="lg:pl-20"
            >
              <h4 className="text-base font-semibold text-white mb-4 flex items-center">
                <ExternalLink className="w-4 h-4 text-orange-400 mr-1.5" />
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={index}>
                      <Link 
                        href={link.href}
                        className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-240 group"
                      >
                        <IconComponent className="w-3 h-3 text-orange-400 group-hover:scale-110 transition-transform duration-240" />
                        <span className="group-hover:translate-x-1 transition-transform duration-240 text-m">{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <a 
                    href="#contact"
                    className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-240 group"
                  >
                    <Contact className="w-3 h-3 text-orange-400 group-hover:scale-110 transition-transform duration-240" />
                    <span className="group-hover:translate-x-1 transition-transform duration-240 text-m">Contact Us</span>
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Column 3: Services */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.16 }}
            >
              <h4 className="text-base font-semibold text-white mb-4 flex items-center">
                <Settings className="w-4 h-4 text-orange-400 mr-1.5" />
                Our Services 
              </h4>
              <ul className="space-y-2">
                {serviceLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-white hover:text-orange-400 transition-colors duration-240 text-m hover:translate-x-1 inline-block transform transition-transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 4: Company & Resources */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.24 }}
            >
              <h4 className="text-base font-semibold text-white mb-4 flex items-center">
                <FileText className="w-4 h-4 text-orange-400 mr-1.5" />
                Company
              </h4>
              <ul className="space-y-2">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-white hover:text-orange-400 transition-colors duration-240 text-m hover:translate-x-1 inline-block transform transition-transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-5 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-md border border-orange-500/20">
                <h5 className="text-orange-400 font-semibold mb-1.5 text-s flex items-center">
                  <Calendar className="w-3 h-3 mr-1.5" />
                  Need Urgent Inspection?
                </h5>
                <p className="text-white text-s mb-1.5">Call us for same-day service</p>
                <a 
                  href="tel:+917396360908"
                  className="text-white font-semibold hover:text-orange-300 transition-colors text-s"
                >
                  +91 7396360908
                </a>
              </div>
            </motion.div>
          </div>

          {/* Copyright & Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.32 }}
            className="mt-10 pt-6 border-t border-gray-700"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="flex items-center space-x-3">
                <span className="text-white text-s mr-1.5">Follow Us:</span>
                {socialMediaLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center transition-all duration-240 hover:scale-110"
                    whileHover={{ y: -1.5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.alt}
                  >
                    <img src={social.src} alt={social.alt} className="w-8 h-8 object-contain" />
                  </motion.a>
                ))}
              </div>

              <div className="text-center md:text-right">
                <p className="text-white text-s">
                  © {new Date().getFullYear()} ChecKaro Home Inspection. All rights reserved.
                </p>
                <p className="text-white text-s mt-0.5">
                  Built with care for your peace of mind
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-240 flex items-center justify-center z-50"
            whileHover={{ scale: 1.1, y: -1.5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

export default Footer;