const formatViewCount = (count) => {
  if (count === null || count === undefined) return null;
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'm';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

const Footer = ({ pageViewCount }) => {
  const formattedCount = formatViewCount(pageViewCount);
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 sm:py-4 text-center z-20 backdrop-blur-md bg-slate-900/80 border-t border-white/10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4">
        <p className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-gray-400 text-xs sm:text-sm">
          <span>
            Built with <span className="text-red-400">❤</span> by <a href="https://comaecod.github.io/portfolio" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Vishnu</a>
          </span>
          {formattedCount !== null && (
            <span className="text-primary/70">
              👁 {formattedCount} views
            </span>
          )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;