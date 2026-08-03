import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that detects when an element enters the viewport
 * using the Intersection Observer API.
 *
 * @param {Object} options
 * @param {string} options.threshold - Visibility ratio to trigger (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {boolean} options.triggerOnce - If true, stops observing after first intersection
 * @returns {[React.RefObject, boolean]} ref to attach to element, and isInView state
 */
export function useInView({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}
