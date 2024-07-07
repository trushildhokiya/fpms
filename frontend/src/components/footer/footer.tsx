import React from 'react';

type Props = {};

const Footer: React.FC<Props> = (props: Props) => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <img src="/path-to-logo.png" alt="Company Logo" className="h-12" />
        </div>
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p>© {new Date().getFullYear()} FPMS. All rights reserved.</p>
          <p>Designed and Developed by FPMS </p>
        </div>
        <div className="flex space-x-4">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/path-to-facebook-icon.png" alt="Facebook" className="h-6" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/path-to-twitter-icon.png" alt="Twitter" className="h-6" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <img src="/path-to-linkedin-icon.png" alt="LinkedIn" className="h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
