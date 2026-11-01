'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop pointers
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, [data-cursor]');
      if (interactive) {
        setIsHovered(true);
        const customText = interactive.getAttribute('data-cursor');
        if (customText) {
          setCursorText(customText);
        } else {
          setCursorText('');
        }
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer follow circle */}
      <motion.div
        className="absolute top-0 left-0 rounded-full flex items-center justify-center border border-[#1A1816]/30 backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - (isHovered ? 36 : 18),
          y: mousePosition.y - (isHovered ? 36 : 18),
          width: isHovered ? (cursorText ? 76 : 64) : 36,
          height: isHovered ? (cursorText ? 76 : 64) : 36,
          backgroundColor: isHovered ? 'rgba(255, 213, 74, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          borderColor: isHovered ? 'rgba(255, 213, 74, 0.8)' : 'rgba(26, 24, 22, 0.25)',
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 280,
          mass: 0.5,
        }}
      >
        {cursorText && (
          <span className="text-[9px] uppercase tracking-widest font-medium text-[#1A1816] px-1 text-center font-display">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Tiny pinpoint center dot */}
      <motion.div
        className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#1A1816]"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isHovered ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 450,
          mass: 0.1,
        }}
      />
    </div>
  );
}
