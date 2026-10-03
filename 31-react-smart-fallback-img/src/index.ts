import * as React from 'react';

export interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  skeletonClassName?: string;
}

export function SmartImage({
  src,
  fallbackSrc = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23eee" width="100" height="100"/><text fill="%23aaa" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">No Image</text></svg>',
  alt = '',
  className = '',
  onError,
  ...props
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
    onError?.(e);
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
