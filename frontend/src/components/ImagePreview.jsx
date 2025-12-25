import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({ photos, onRemovePhoto, onReorder }) => {
  const movePhotoUp = (index) => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const movePhotoDown = (index) => {
    if (index < photos.length - 1) {
      onReorder(index, index + 1);
    }
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="image-preview-container">
      <h3>Selected Photos ({photos.length})</h3>
      <div className="preview-grid">
        {photos && photos.length > 0 ? (
          photos.map((photo, index) => (
            <div key={photo.id} className="photo-card">
              <div className="photo-wrapper">
                <img
                  src={photo.preview}
                  alt={`Preview ${index + 1}`}
                  className="photo-thumbnail"
                  onError={(e) => {
                    console.error('Image failed to load:', photo.name);
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3Ctext x="50" y="50" dominant-baseline="middle" text-anchor="middle" font-family="Arial" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="photo-order">{index + 1}</div>
                <button
                  className="delete-btn"
                  onClick={() => onRemovePhoto(photo.id)}
                  title="Remove photo"
                  type="button"
                >
                  ✕
                </button>
              </div>
              <div className="photo-info">
                <p className="photo-name" title={photo.name}>
                  {photo.name}
                </p>
                <p className="photo-size">{photo.size}</p>
              </div>
              <div className="photo-controls">
                <button
                  className="control-btn up-btn"
                  onClick={() => movePhotoUp(index)}
                  disabled={index === 0}
                  title="Move up"
                  type="button"
                >
                  ↑
                </button>
                <button
                  className="control-btn down-btn"
                  onClick={() => movePhotoDown(index)}
                  disabled={index === photos.length - 1}
                  title="Move down"
                  type="button"
                >
                  ↓
                </button>
              </div>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
};

export default ImagePreview;
