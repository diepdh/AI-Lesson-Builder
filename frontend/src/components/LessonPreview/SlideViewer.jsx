import React, { useState, useEffect } from 'react';
import './SlideViewer.css';

const SlideViewer = ({ slide }) => {
  const [imageError, setImageError] = useState(false);

  // Reset image error state when slide changes
  useEffect(() => {
    setImageError(false);
  }, [slide?.id, slide?.image]);

  if (!slide) return <div className="slide-viewer empty">No slide data</div>;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="slide-viewer">
      {slide.video ? (
        <video 
          src={slide.video} 
          controls 
          autoPlay 
          className="slide-media"
          key={slide.video}
        />
      ) : (
        (!slide.image || imageError) ? (
          <div className="image-placeholder">
            <div className="placeholder-text">🖼️ [Ảnh bài học: {slide.title}]</div>
            <div className="placeholder-subtext">(Hình ảnh hiện chưa khả dụng)</div>
          </div>
        ) : (
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="slide-media"
            key={slide.image}
            onError={handleImageError}
          />
        )
      )}
      <div className="slide-script-box">
        <p className="slide-script">{slide.script}</p>
      </div>
    </div>
  );
};

export default SlideViewer;
