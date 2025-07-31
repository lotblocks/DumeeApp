import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useGesture } from '@use-gesture/react';
import { Button } from '../ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, children }) => {
  const [{ x }, api] = useSpring(() => ({
    x: -100,
    config: { tension: 300, friction: 30 },
  }));

  useEffect(() => {
    api.start({ x: isOpen ? 0 : -100 });
  }, [isOpen, api]);

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], velocity: [vx], direction: [dx] }) => {
      if (!down) {
        // Close menu if swiped left with enough velocity
        if (dx < 0 && (vx > 0.5 || mx < -50)) {
          onClose();
        } else {
          api.start({ x: 0 });
        }
      } else {
        // Follow finger while dragging
        const newX = Math.min(0, mx);
        api.start({ x: newX / 100, immediate: true });
      }
    },
  });

  return (
    <>
      {/* Backdrop */}
      <animated.div
        className={`fixed inset-0 bg-black/50 z-40 ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
        style={{
          opacity: x.to([0, -100], [1, 0]),
        }}
      />

      {/* Menu */}
      <animated.div
        {...bind()}
        className="fixed left-0 top-0 bottom-0 w-80 bg-gray-900 z-50 shadow-2xl"
        style={{
          x: x.to((val) => `${val}%`),
          touchAction: 'pan-y',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Dumee Menu</h2>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>Swipe left to close</p>
          </div>
        </div>
      </animated.div>
    </>
  );
};