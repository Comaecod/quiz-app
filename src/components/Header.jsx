import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white p-0.5 flex items-center justify-center">
            <img 
              src={logoImg}
              alt="SKKSV Logo" 
              className="w-full h-full rounded-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-2xl">🎓</span>';
              }}
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
              SKKSV Scholar
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Link 
              to="/people" 
              className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <span>👥</span>
              <span>People</span>
            </Link>
          </div>

          <button 
            className="sm:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <motion.div 
        className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-4 py-3 border-t border-white/10 bg-slate-900/95">
          <Link 
            to="/people" 
            className="block px-3 py-2 rounded-lg text-white hover:bg-white/10 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>👥</span>
            <span>People</span>
          </Link>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;