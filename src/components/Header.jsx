import logoImg from '../assets/logo.png';

const Header = () => {
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
                e.target.parentElement.innerHTML = '🎓';
              }}
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
              Comaecod SKKSV Scholar
            </h1>
          </div>
        </div>
        
        <div className="text-right">
          <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Comaecod SKKSV Scholar
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-400 hidden xs:block">Sri Kanchi Kamakoti Sankara Vidyalaya</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
