import { useState, useEffect, useRef } from 'react';

/**
 * Timer Component
 * Countdown timer with visual warnings at 3min and 1min
 */
const Timer = ({ minutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  
  // Keep callback reference stable
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Countdown interval
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUpRef.current();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format seconds as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer class based on time remaining
  const getTimerClass = () => {
    if (timeLeft <= 60) return 'danger';   // Red: < 1 min
    if (timeLeft <= 180) return 'warning'; // Yellow: < 3 min
    return '';
  };

  // Get emoji indicator
  const getTimerEmoji = () => {
    if (timeLeft <= 60) return '🔴';
    if (timeLeft <= 180) return '🟡';
    return '⏱️';
  };

  return (
    <div className={`timer ${getTimerClass()}`}>
      <span style={{ fontSize: '1rem' }}>{getTimerEmoji()}</span>
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
