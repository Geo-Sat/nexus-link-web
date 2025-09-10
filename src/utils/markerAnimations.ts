import { useRef } from 'react';

interface RotationAnimation {
  start: number;
  end: number;
  startTime: number;
  duration: number;
  marker: google.maps.Marker;
  animationFrame: number;
}

const rotationAnimations = new Map<string, RotationAnimation>();

export const animateMarkerRotation = (
  markerId: string,
  marker: google.maps.Marker,
  startAngle: number,
  endAngle: number,
  duration = 300
) => {
  // Cancel any existing animation
  if (rotationAnimations.has(markerId)) {
    cancelAnimationFrame(rotationAnimations.get(markerId)!.animationFrame);
    rotationAnimations.delete(markerId);
  }

  // Normalize angles
  while (startAngle < 0) startAngle += 360;
  while (endAngle < 0) endAngle += 360;
  startAngle = startAngle % 360;
  endAngle = endAngle % 360;

  // Choose shortest rotation direction
  if (Math.abs(endAngle - startAngle) > 180) {
    if (endAngle > startAngle) {
      startAngle += 360;
    } else {
      endAngle += 360;
    }
  }

  const startTime = performance.now();
  const animation: RotationAnimation = {
    start: startAngle,
    end: endAngle,
    startTime,
    duration,
    marker,
    animationFrame: 0
  };

  const animate = (currentTime: number) => {
    const elapsed = currentTime - animation.startTime;
    if (elapsed >= animation.duration) {
      // Animation complete
      const icon = marker.getIcon() as google.maps.Symbol;
      marker.setIcon({
        ...icon,
        rotation: animation.end % 360
      });
      rotationAnimations.delete(markerId);
      return;
    }

    // Calculate current rotation
    const progress = elapsed / animation.duration;
    const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
    const currentRotation = 
      animation.start + (animation.end - animation.start) * eased;

    // Update marker rotation
    const icon = marker.getIcon() as google.maps.Symbol;
    marker.setIcon({
      ...icon,
      rotation: currentRotation
    });

    // Continue animation
    animation.animationFrame = requestAnimationFrame(animate);
  };

  animation.animationFrame = requestAnimationFrame(animate);
  rotationAnimations.set(markerId, animation);
};
