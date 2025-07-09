import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const VirtualTourViewer = ({ tourData, className }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  if (!tourData || !tourData.scenes || tourData.scenes.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <ApperIcon name="Camera" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Virtual tour not available for this property</p>
      </div>
    );
  }

  const currentSceneData = tourData.scenes[currentScene];

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    toast.error("Failed to load virtual tour image");
  };

  const navigateToScene = (sceneIndex) => {
    if (sceneIndex >= 0 && sceneIndex < tourData.scenes.length) {
      setIsLoading(true);
      setCurrentScene(sceneIndex);
      setRotation({ x: 0, y: 0 });
      toast.success(`Navigated to ${tourData.scenes[sceneIndex].title}`);
    }
  };

  const handleHotspotClick = (hotspot) => {
    if (hotspot.type === "scene") {
      navigateToScene(hotspot.targetScene);
    } else if (hotspot.type === "info") {
      toast.info(hotspot.description);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setTouchStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !touchStart) return;
    
    const deltaX = e.clientX - touchStart.x;
    const deltaY = e.clientY - touchStart.y;
    
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
      y: (prev.y + deltaX * 0.5) % 360
    }));
    
    setTouchStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTouchStart(null);
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const touch = e.targetTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.3)),
      y: (prev.y + deltaX * 0.3) % 360
    }));
    
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "aspect-[16/9]",
        className
      )}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="spinner h-8 w-8 mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading virtual tour...</p>
          </div>
        </div>
      )}

      {/* 360° Panoramic Image */}
      <div
        className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imageRef}
          src={currentSceneData.panoramicImage}
          alt={currentSceneData.title}
          className="w-full h-full object-cover select-none"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.3s ease-out"
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
        />

        {/* Hotspots */}
        {!isLoading && currentSceneData.hotspots?.map((hotspot, index) => (
          <button
            key={index}
            className="absolute hotspot-button"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            onClick={() => handleHotspotClick(hotspot)}
            title={hotspot.title}
          >
            <div className="hotspot-pulse">
              <ApperIcon
                name={hotspot.type === "scene" ? "ArrowRight" : "Info"}
                className="h-6 w-6 text-white"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <div className="bg-black bg-opacity-50 rounded-lg px-3 py-2">
          <h3 className="text-white font-medium text-sm">{currentSceneData.title}</h3>
          <p className="text-gray-300 text-xs">{currentScene + 1} of {tourData.scenes.length}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="small"
            onClick={toggleFullscreen}
            className="bg-black bg-opacity-50 border-gray-600 text-white hover:bg-opacity-70"
          >
            <ApperIcon name={isFullscreen ? "Minimize2" : "Maximize2"} className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scene Navigation */}
      {tourData.scenes.length > 1 && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {tourData.scenes.map((scene, index) => (
              <button
                key={index}
                onClick={() => navigateToScene(index)}
                className={cn(
                  "flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  index === currentScene
                    ? "bg-accent text-white"
                    : "bg-black bg-opacity-50 text-gray-300 hover:bg-opacity-70"
                )}
              >
                {scene.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
        {currentScene > 0 && (
          <Button
            variant="outline"
            size="small"
            onClick={() => navigateToScene(currentScene - 1)}
            className="bg-black bg-opacity-50 border-gray-600 text-white hover:bg-opacity-70 pointer-events-auto"
          >
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
        )}
        
        {currentScene < tourData.scenes.length - 1 && (
          <Button
            variant="outline"
            size="small"
            onClick={() => navigateToScene(currentScene + 1)}
            className="bg-black bg-opacity-50 border-gray-600 text-white hover:bg-opacity-70 pointer-events-auto ml-auto"
          >
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VirtualTourViewer;