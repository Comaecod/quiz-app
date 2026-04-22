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
    <footer className="fixed bottom-0 left-0 right-0 py-2 sm:py-3 text-center text-gray-500 text-xs sm:text-sm z-20" role="contentinfo">
      <p className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <span>Built with <span aria-hidden="true">love</span> by <a href="https://comaecod.github.io/portfolio" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Vishnu</a></span>
        {formattedCount !== null && (
          <span className="text-primary/70">
            👁 {formattedCount} views
          </span>
        )}
      </p>
    </footer>
  );
};

export default Footer;