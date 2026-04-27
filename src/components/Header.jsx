import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';
import { SCHOOL_CONFIG } from '../config/schoolConfig';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/assessments', icon: '📝', label: 'Assessments' },
    { to: '/holiday-homework', icon: '🏖️', label: 'Holiday Homework' },
    { to: '/people', icon: '👥', label: 'People' },
    { to: '/contact', icon: '📞', label: 'Contact' },
    { to: '/feedback', icon: '💬', label: 'Feedback' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
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
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                  {SCHOOL_CONFIG.shortName}
                </h1>
                {SCHOOL_CONFIG.beta && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full">
                    BETA
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-1.5 rounded-lg text-gray-300 text-sm hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
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
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </header>
  );
};

export default Header;