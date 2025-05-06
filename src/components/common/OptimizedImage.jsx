import { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";

/**
 * OptimizedImage component that handles lazy loading, progressive loading,
 * and fallback for images throughout the application.
 */
const OptimizedImage = memo(
  ({
    src,
    alt,
    className,
    width,
    height,
    placeholderSrc,
    fallbackSrc,
    onLoad,
    onError,
    lazy = true,
    ...props
  }) => {
    const [imageSrc, setImageSrc] = useState(
      placeholderSrc ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23cccccc' d='M0 0h24v24H0z'/%3E%3C/svg%3E",
    );
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
      // Reset state when src changes
      if (src) {
        setIsLoaded(false);
        setError(false);

        if (!lazy) {
          setImageSrc(src);
        }
      }
    }, [src, lazy]);

    useEffect(() => {
      if (!src || !lazy) return;

      // Create IntersectionObserver for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: "200px", // Start loading when image is within 200px of viewport
          threshold: 0,
        },
      );

      // Start observing
      const element = document.getElementById(
        `image-${props.id || Math.random().toString(36).substring(2, 9)}`,
      );
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    }, [src, lazy, props.id]);

    const handleImageLoad = (e) => {
      setIsLoaded(true);
      if (onLoad) onLoad(e);
    };

    const handleImageError = (e) => {
      if (!error) {
        setError(true);
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      }
      if (onError) onError(e);
    };

    return (
      <div
        id={`image-${props.id || Math.random().toString(36).substring(2, 9)}`}
        className={`relative overflow-hidden ${className}`}
        style={{ width, height }}
      >
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-60"} `}
          {...props}
        />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    );
  },
);

OptimizedImage.displayName = "OptimizedImage";

OptimizedImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholderSrc: PropTypes.string,
  fallbackSrc: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  lazy: PropTypes.bool,
  id: PropTypes.string,
};

export default OptimizedImage;
