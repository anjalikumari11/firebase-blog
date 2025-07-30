import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto">
      <div className="container">
        <p className="mb-1">&copy; {new Date().getFullYear()} Made with ❤️ by <strong>@anjali</strong></p>
        <p className="mb-0">
          <a href="https://github.com/anjalikumari11" className="text-secondary text-decoration-none" target="_blank" rel="noopener noreferrer">
            GitHub
          </a> | 
          <a href="https://www.linkedin.com/in/anjali-kumari-0571b4260/" className="text-secondary text-decoration-none mx-2" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
