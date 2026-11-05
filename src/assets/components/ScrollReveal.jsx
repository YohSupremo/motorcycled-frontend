import { useEffect, useRef, useState } from "react";


export function ScrollReveal({
  children,
  className = "",
  threshold = 0.1,
  delay = 0,
  duration = 400,
  direction = "up", 
  distance = 16, 
  revealOnExit = false, 
  exitDuration = 600, 
  exitDistance = 40,
  style = {},
}) {
  const elementRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isVisible, setIsVisible] = useState(
    () => typeof window === "undefined" || !("IntersectionObserver" in window)
  );

  useEffect(() => {
    const node = elementRef.current;
    if (!node || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (revealOnExit) {
          if (entry.isIntersecting) {
            setHasEntered(true);
          }
          setIsVisible(entry.isIntersecting);
          return;
        }
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        
        
        threshold: revealOnExit ? 0 : threshold,
        rootMargin: revealOnExit ? "-20% 0px -20% 0px" : "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [threshold, revealOnExit]);

  
  
  
  const isExiting = revealOnExit && !isVisible;
  const currentDistance = isExiting || hasEntered ? exitDistance : distance;
  const currentDuration = isExiting ? exitDuration : duration;
  const currentDelay = isExiting ? 0 : delay;

  const transformStyle = isVisible
    ? "none"
    : direction === "up"
    ? `translateY(${currentDistance}px)`
    : "none";

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: transformStyle,
        transition: `opacity ${currentDuration}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${currentDelay}ms, transform ${currentDuration}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${currentDelay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
