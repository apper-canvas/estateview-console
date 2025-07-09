import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Maximize2, X, Info } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

const VirtualTourViewer = ({ 
  images = [], 
  hotspots = [], 
  initialImageIndex = 0,
  onHotspotClick,
  className = "",
  autoRotate = false,
  showControls = true,
  height = "500px"
}) => {
  // All hooks must be called unconditionally at the top level
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(autoRotate);
  const [showHotspots, setShowHotspots] = useState(true);
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const autoRotateRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastRotationRef = useRef(0);

  // Validate props and set initial state
  const validImages = Array.isArray(images) ? images : [];
  const validHotspots = Array.isArray(hotspots) ? hotspots : [];
  const currentImage = validImages[currentImageIndex];
  const currentHotspots = validHotspots.filter(h => h.imageIndex === currentImageIndex);

  // Auto-rotate functionality
  useEffect(() => {
    if (autoRotateEnabled && !isDragging && !isLoading) {
      autoRotateRef.current = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 100);
    } else if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [autoRotateEnabled, isDragging, isLoading]);

  // Image loading effect
  useEffect(() => {
    if (currentImage) {
      setIsLoading(true);
      setError(null);
      
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
      };
      img.src = currentImage.url || currentImage.src || currentImage;
    } else {
      setIsLoading(false);
      setError('No image provided');
    }
  }, [currentImage]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          }
          break;
        case ' ':
          e.preventDefault();
          setAutoRotateEnabled(prev => !prev);
          break;
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isFullscreen]);

  // Mouse/Touch event handlers
  const handleMouseDown = useCallback((e) => {
    if (isLoading || error) return;
    
    setIsDragging(true);
    setAutoRotateEnabled(false);
    
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    
    setDragStart({ x: clientX, y: clientY });
    dragStartRef.current = { x: clientX, y: clientY };
    lastRotationRef.current = rotation;
  }, [isLoading, error, rotation]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || isLoading || error) return;
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = clientX - dragStartRef.current.x;
    const rotationDelta = deltaX * 0.5;
    
    setRotation(lastRotationRef.current + rotationDelta);
  }, [isDragging, isLoading, error]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Navigation functions
  const handlePrevious = useCallback(() => {
    if (validImages.length > 1) {
      setCurrentImageIndex(prev => (prev - 1 + validImages.length) % validImages.length);
      setRotation(0);
    }
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    if (validImages.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % validImages.length);
      setRotation(0);
    }
  }, [validImages.length]);

  const handleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    
    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, [isFullscreen]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Exit fullscreen error:', err);
    }
  }, []);

  const handleHotspotClick = useCallback((hotspot) => {
    if (onHotspotClick) {
      onHotspotClick(hotspot);
    }
  }, [onHotspotClick]);

  // Early return for error state - no hooks called after this point
  if (error) {
    return (
      <div className={`virtual-tour-viewer ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Early return for no images - no hooks called after this point
  if (validImages.length === 0) {
    return (
      <div className={`virtual-tour-viewer ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-2">🏠</div>
            <p className="text-gray-600">No virtual tour images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`virtual-tour-viewer relative overflow-hidden rounded-lg bg-black ${className} ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
      tabIndex={0}
      role="application"
      aria-label="Virtual Tour Viewer"
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="spinner w-8 h-8"></div>
        </div>
      )}

      {/* Main image */}
      <div className="relative w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src={typeof currentImage === 'string' ? currentImage : currentImage?.url || currentImage?.src}
          alt={currentImage?.alt || `Virtual tour image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-75 select-none"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          draggable={false}
        />

        {/* Hotspots */}
        {showHotspots && currentHotspots.map((hotspot, index) => (
          <button
            key={`hotspot-${index}`}
            className="hotspot-button hotspot-pulse"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
            }}
            onClick={() => handleHotspotClick(hotspot)}
            aria-label={hotspot.label || `Hotspot ${index + 1}`}
            title={hotspot.title || hotspot.label}
          >
            <Info size={16} className="text-white" />
          </button>
        ))}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black bg-opacity-50 rounded-full px-4 py-2">
          {/* Previous button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrevious}
            disabled={validImages.length <= 1}
            className="text-white hover:text-gray-300"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </Button>

          {/* Image counter */}
          <span className="text-white text-sm px-2">
            {currentImageIndex + 1} / {validImages.length}
          </span>

          {/* Next button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNext}
            disabled={validImages.length <= 1}
            className="text-white hover:text-gray-300"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </Button>

          {/* Auto-rotate toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAutoRotateEnabled(prev => !prev)}
            className={`text-white hover:text-gray-300 ${autoRotateEnabled ? 'bg-blue-600' : ''}`}
            aria-label={autoRotateEnabled ? 'Stop auto-rotation' : 'Start auto-rotation'}
          >
            <RotateCw size={16} />
          </Button>

          {/* Hotspot toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowHotspots(prev => !prev)}
            className={`text-white hover:text-gray-300 ${showHotspots ? 'bg-blue-600' : ''}`}
            aria-label={showHotspots ? 'Hide hotspots' : 'Show hotspots'}
          >
            <Info size={16} />
          </Button>

          {/* Fullscreen toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleFullscreen}
            className="text-white hover:text-gray-300"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <X size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      )}

      {/* Fullscreen mode indicator */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={exitFullscreen}
            className="text-white hover:text-gray-300"
            aria-label="Exit fullscreen"
          >
            <X size={20} />
          </Button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-3 text-white text-sm max-w-xs">
        <p className="mb-1">
          <strong>Controls:</strong>
        </p>
        <ul className="text-xs space-y-1">
          <li>• Drag to rotate view</li>
          <li>• Arrow keys to navigate</li>
          <li>• Spacebar to toggle auto-rotate</li>
          <li>• Click hotspots for information</li>
        </ul>
      </div>
    </div>
  );
};

export default VirtualTourViewer;