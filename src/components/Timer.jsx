import { useState, useEffect, useRef } from 'react';

/**
 * Timer Component
 * Countdown timer with visual warnings
 */
const Timer = ({ minutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const onTimeUpRef = useRef(onTimeUp);
  
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUpRef.current();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 60) return 'danger';
    if (timeLeft <= 180) return 'warning';
    return '';
  };

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
