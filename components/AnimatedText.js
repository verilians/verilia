"use client";

import { useState, useEffect } from 'react';

const AnimatedText = ({ 
  text, 
  speed = 30, 
  onComplete, 
  className = "",
  shouldAnimate = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    if (!shouldAnimate) {
      // Show full text immediately if we shouldn't animate
      setDisplayedText(text);
      setCurrentIndex(text.length);
      return;
    }

    // Start animation
    setDisplayedText('');
    setCurrentIndex(0);

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (prevIndex >= text.length) {
          clearInterval(interval);
          onComplete?.();
          return prevIndex;
        }
        
        setDisplayedText(text.slice(0, prevIndex + 1));
        return prevIndex + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete, shouldAnimate]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && shouldAnimate && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default AnimatedText; 