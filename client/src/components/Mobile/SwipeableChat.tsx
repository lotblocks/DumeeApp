import React, { useState, useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';

interface SwipeableChatProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const SwipeableChat: React.FC<SwipeableChatProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}) => {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
      setIsDragging(down);

      if (down) {
        api.start({ x: mx, y: my, immediate: true });
      } else {
        // Determine swipe direction based on velocity and movement
        const swipeVelocityThreshold = 0.5;
        const isSwipe = Math.abs(vx) > swipeVelocityThreshold || Math.abs(vy) > swipeVelocityThreshold;

        if (isSwipe || Math.abs(mx) > threshold || Math.abs(my) > threshold) {
          if (Math.abs(mx) > Math.abs(my)) {
            // Horizontal swipe
            if (mx > threshold && onSwipeRight) {
              onSwipeRight();
              // Animate off screen
              api.start({ x: window.innerWidth, y: 0 });
            } else if (mx < -threshold && onSwipeLeft) {
              onSwipeLeft();
              api.start({ x: -window.innerWidth, y: 0 });
            } else {
              api.start({ x: 0, y: 0 });
            }
          } else {
            // Vertical swipe
            if (my > threshold && onSwipeDown) {
              onSwipeDown();
              api.start({ x: 0, y: window.innerHeight });
            } else if (my < -threshold && onSwipeUp) {
              onSwipeUp();
              api.start({ x: 0, y: -window.innerHeight });
            } else {
              api.start({ x: 0, y: 0 });
            }
          }
        } else {
          // Snap back if not a valid swipe
          api.start({ x: 0, y: 0 });
        }
      }
    },
    onDragEnd: () => {
      setIsDragging(false);
    },
  });

  return (
    <animated.div
      ref={containerRef}
      {...bind()}
      style={{
        x,
        y,
        touchAction: 'none',
        userSelect: isDragging ? 'none' : 'auto',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className={`relative ${isDragging ? 'transition-none' : 'transition-transform'}`}
    >
      {children}
    </animated.div>
  );
};