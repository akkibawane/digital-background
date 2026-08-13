import React from 'react';
import { Heart, Eye, ExternalLink } from 'lucide-react';

const WallpaperCard = ({ wallpaper, isFavorite, onFavoriteToggle, onSelect }) => {
  const { photographer, photographer_url, width, height, src, alt } = wallpaper;
  
  const isLandscape = width > height;

  // Format dimensions (e.g. 4K, HD, or actual size)
  const getResolutionLabel = () => {
    if (width >= 3840 && height >= 2160) return '4K UHD';
    if (width >= 2560 && height >= 1440) return '2K QHD';
    if (width >= 1920 && height >= 1080) return 'Full HD';
    return `${width}x${height}`;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle(wallpaper);
  };

  return (
    <div className="card-wrapper" onClick={() => onSelect(wallpaper)}>
      <div className={`card-image-box ${isLandscape ? 'landscape' : 'portrait'}`}>
        {/* We use medium/large for thumbnails depending on aspect ratio to save bandwidth but retain crispness */}
        <img 
          src={isLandscape ? src.medium : src.portrait || src.medium} 
          alt={alt || 'Pexels Wallpaper'} 
          className="card-image"
          loading="lazy"
        />
        
        {/* Hover overlay with details and actions */}
        <div className="card-overlay">
          <div className="card-title">{alt || 'Minimal Abstract'}</div>
          <div className="card-author">by {photographer}</div>
          
          <div className="card-footer-actions">
            <div className="res-tag">{getResolutionLabel()}</div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`card-action-btn ${isFavorite ? 'hearted' : ''}`}
                onClick={handleFavoriteClick}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              
              <button 
                className="card-action-btn"
                onClick={() => onSelect(wallpaper)}
                title="Preview Wallpaper"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Static details visible below card (helps with mobile and basic view grids) */}
      <div className="card-details-static">
        <span className="card-photographer-name">{photographer}</span>
        <span className="res-tag" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
          {getResolutionLabel()}
        </span>
      </div>
    </div>
  );
};

export default WallpaperCard;
