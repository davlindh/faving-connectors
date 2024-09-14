import React from 'react';
import { useInView } from 'react-intersection-observer';

const OptimizedImage = ({ src, alt, width, height, className }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');

  return (
    <div ref={ref} className={`relative ${className}`} style={{ width, height }}>
      {inView && (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;