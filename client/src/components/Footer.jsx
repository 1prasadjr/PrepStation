import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaDiscord, FaXTwitter, FaGithub } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2025 PrepStation. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-gray-500 text-xs">Dev:</span>
              <a href="https://www.instagram.com/prasadk.jr/?__pwa=1#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors"><FaInstagram size={18} /></a>
              <a href="https://www.linkedin.com/in/prasadkanchar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors"><FaLinkedin size={18} /></a>
              <a href="http://discordapp.com/users/769446157503299634" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors"><FaDiscord size={18} /></a>
              <a href="https://x.com/f4prrasad?s=21" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors"><FaXTwitter size={18} /></a>
              <a href="https://github.com/1prasadjr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><FaGithub size={18} /></a>
            </div>
          </div>
          
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:shadow-lg hover:shadow-purple-500/50 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="text-gray-400 hover:text-red-400 transition-colors duration-300 hover:shadow-lg hover:shadow-red-500/50 text-sm"
            >
              Contact Us
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:shadow-lg hover:shadow-purple-500/50 text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;