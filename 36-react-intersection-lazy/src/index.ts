import * as React from 'react';

export interface LazyProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function IntersectionLazy({
  children,
  placeholder = null,
  rootMargin = '100px',
  threshold = 0,
  triggerOnce = true
}: LazyProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return <div ref={ref}>{isVisible ? children : placeholder}</div>;
}
