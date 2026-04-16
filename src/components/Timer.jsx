import { useState, useEffect, useRef } from 'react';

const Timer = ({ minutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const hasTriggered = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0 && !hasTriggered.current) {
      hasTriggered.current = true;
      onTimeUpRef.current();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasTriggered.current) {
            hasTriggered.current = true;
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (minutes <= 0) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isWarning = timeLeft <= 180;
  const isCritical = timeLeft <= 60;

  const getColor = () => {
    if (isCritical) return 'text-red-400';
    if (isWarning) return 'text-yellow-400';
    return 'text-white';
  };

  const getBgColor = () => {
    if (isCritical) return 'bg-red-500/20 border-red-500/50';
    if (isWarning) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-white/10 border-white/20';
  };

  const getEmoji = () => {
    if (isCritical) return '🔴';
    if (isWarning) return '🟡';
    return '⏱️';
  };

  return (
    <div className={`px-4 py-2 rounded-xl border ${getBgColor()} ${getColor()} font-mono font-bold text-lg flex items-center gap-2 ${isCritical ? 'animate-pulse' : ''}`}>
      <span>{getEmoji()}</span>
      <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
    </div>
  );
};

export default Timer;
