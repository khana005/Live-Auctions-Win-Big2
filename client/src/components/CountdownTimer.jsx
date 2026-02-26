import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endTime) - new Date();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.expired) {
    return (
      <div className="flex justify-center">
        <span className="px-4 py-2 bg-red-500/20 text-red-400 text-sm font-semibold rounded-lg border border-red-500/30">
          Auction Ended
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TimeUnit value={timeLeft.hours} label="H" />
      <span className="text-white text-lg font-bold">:</span>
      <TimeUnit value={timeLeft.minutes} label="M" />
      <span className="text-white text-lg font-bold">:</span>
      <TimeUnit value={timeLeft.seconds} label="S" />
    </div>
  );
};

const TimeUnit = ({ value, label }) => {
  const formattedValue = value.toString().padStart(2, '0');

  return (
    <motion.div
      key={value}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      className="flex flex-col items-center"
    >
      <div className="bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700">
        <span className="text-xl font-bold text-white font-mono">
          {formattedValue}
        </span>
      </div>
      <span className="text-xs text-slate-400 mt-1">{label}</span>
    </motion.div>
  );
};

export default CountdownTimer;
