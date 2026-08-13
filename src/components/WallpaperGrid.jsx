import React from 'react';
import WallpaperCard from './WallpaperCard';
import { ImageOff } from 'lucide-react';

const WallpaperGrid = ({ 
  wallpapers, 
  favorites, 
  onFavoriteToggle, 
  onSelect, 
  loading, 
  gridOrientation 
}) => {
  
  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!wallpapers || wallpapers.length === 0) {
    return (
      <div className="empty-state">
        <ImageOff size={48} className="text-muted" style={{ opacity: 0.6 }} />
        <h3 className="empty-title">No Wallpapers Found</h3>
        <p className="empty-text">
          We couldn't find any wallpapers matching your search parameters. Try adjusting your query or category filter!
        </p>
      </div>
    );
  }

  // Helper to check if a wallpaper is in favorites
  const isFavorite = (item) => {
    return favorites.some(fav => fav.id === item.id);
  };

  return (
    <div className={`wallpaper-grid ${gridOrientation}`}>
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
          isFavorite={isFavorite(wallpaper)}
          onFavoriteToggle={onFavoriteToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default WallpaperGrid;
