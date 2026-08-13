import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, Phone, Heart, Settings, Search, Sparkles, 
  ChevronLeft, ChevronRight, SlidersHorizontal, Image
} from 'lucide-react';
import { getWallpapers, hasApiKey } from './services/pexelsService';
import WallpaperGrid from './components/WallpaperGrid';
import PreviewModal from './components/PreviewModal';
import SettingsPanel from './components/SettingsPanel';

const CATEGORIES = [
  { id: 'all', label: 'All Curated' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'space', label: 'Space & Cosmic' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'nature', label: 'Nature Scenic' },
  { id: 'abstract', label: 'Abstract Art' },
  { id: 'architecture', label: 'Architecture' }
];

function App() {
  // Navigation Tabs: 'desktop' (landscape), 'mobile' (portrait), 'favorites'
  const [currentTab, setCurrentTab] = useState('desktop');
  
  // Search & Filtering
  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favOrientationFilter, setFavOrientationFilter] = useState('all');
  
  // Pagination & Loading States
  const [wallpapers, setWallpapers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API Key & Modals State
  const [apiKeyActive, setApiKeyActive] = useState(hasApiKey());
  const [isMockMode, setIsMockMode] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  
  // Local Favorites State
  const [favorites, setFavorites] = useState([]);
  
  // Theme Selection State (default to cosmic)
  const [theme, setTheme] = useState(localStorage.getItem('aether_theme_v1') || 'cosmic');

  // Fetch Favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aether_favorites_v1');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed parsing favorites from storage:', e);
      }
    }
  }, []);

  // Synchronize visual theme class on document.body
  useEffect(() => {
    document.body.classList.remove('theme-cosmic', 'theme-amoled', 'theme-cyberpunk', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('aether_theme_v1', newTheme);
  };

  // Sync Favorites with localStorage
  const handleFavoriteToggle = (wallpaper) => {
    let updated;
    const isAlreadyFav = favorites.some(item => item.id === wallpaper.id);
    
    if (isAlreadyFav) {
      updated = favorites.filter(item => item.id !== wallpaper.id);
    } else {
      updated = [...favorites, wallpaper];
    }
    
    setFavorites(updated);
    localStorage.setItem('aether_favorites_v1', JSON.stringify(updated));
  };

  // Main Wallpaper Loading Logic
  const fetchWallpapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const orientation = currentTab === 'desktop' ? 'landscape' : 'portrait';
      const data = await getWallpapers({
        category: activeCategory !== 'all' ? activeCategory : '',
        query: searchQuery,
        orientation: orientation,
        page: page,
        perPage: 16
      });
      
      setWallpapers(data.photos || []);
      setIsMockMode(!!data.isMock);
      
      // Calculate total pages (Pexels doesn't explicitly return total_pages, so we compute it)
      const perPage = data.per_page || 16;
      const total = data.total_results || 0;
      setTotalPages(Math.max(1, Math.ceil(total / perPage)));
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while fetching wallpapers.');
      setWallpapers([]);
    } finally {
      setLoading(false);
    }
  };

  // Run Fetch when main dependencies change
  useEffect(() => {
    if (currentTab !== 'favorites') {
      fetchWallpapers();
    }
  }, [currentTab, activeCategory, searchQuery, page, apiKeyActive]);

  // Handle Tab Switch Actions
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setPage(1);
    setSearchVal('');
    setSearchQuery('');
    setActiveCategory('all');
    setError(null);
  };

  // Handle Custom Search Form Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveCategory('all'); // Clear category pill highlight on custom search
    setSearchQuery(searchVal);
  };

  // Handle Category Pill Selection
  const handleCategorySelect = (categoryId) => {
    setPage(1);
    setSearchVal('');
    setSearchQuery('');
    setActiveCategory(categoryId);
  };

  // Local filtering for favorites
  const getFilteredFavorites = () => {
    return favorites.filter(item => {
      // 1. Orientation Filter
      const itemOrientation = item.width > item.height ? 'landscape' : 'portrait';
      const matchesOrientation = favOrientationFilter === 'all' || itemOrientation === favOrientationFilter;
      
      // 2. Category Filter
      const matchesCategory = activeCategory === 'all' || 
                              (item.category && item.category === activeCategory) ||
                              (item.alt && item.alt.toLowerCase().includes(activeCategory));
      
      // 3. Search text match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
                            item.alt.toLowerCase().includes(query) || 
                            item.photographer.toLowerCase().includes(query);
                            
      return matchesOrientation && matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="app-container">
      {/* --- HEADER LAYER --- */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={22} fill="currentColor" />
          </div>
          <h1 className="brand-title">AetherWalls</h1>
        </div>

        {/* Tab Selection Navigation */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${currentTab === 'desktop' ? 'active' : ''}`}
            onClick={() => handleTabChange('desktop')}
          >
            <Monitor size={16} /> Desktop (Windows)
          </button>
          <button 
            className={`nav-tab ${currentTab === 'mobile' ? 'active' : ''}`}
            onClick={() => handleTabChange('mobile')}
          >
            <Phone size={16} /> Mobile (Portrait)
          </button>
          <button 
            className={`nav-tab ${currentTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favorites')}
          >
            <Heart size={16} fill={currentTab === 'favorites' ? 'currentColor' : 'none'} /> Favorites ({favorites.length})
          </button>
        </nav>

        {/* Settings Toggle Buttons */}
        <div className="nav-actions">
          <button 
            className="settings-btn"
            onClick={() => setSettingsOpen(true)}
            title="Configure Pexels API Key"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* --- DISCOVER SEARCH & CONTROLS --- */}
      <section className="discover-section">
        
        {/* Mock/Demo Mode Banner */}
        {currentTab !== 'favorites' && isMockMode && (
          <div className="mock-mode-indicator">
            <span>Running in Curator fallback mode.</span>
            <button onClick={() => setSettingsOpen(true)}>Configure Pexels API Key</button>
            <span>to search the entire web live.</span>
          </div>
        )}

        <div className="search-filter-row">
          {/* Custom query search input */}
          <form onSubmit={handleSearchSubmit} className="search-wrapper">
            <input 
              type="text" 
              placeholder={`Search ${currentTab === 'desktop' ? 'Desktop Landscape' : currentTab === 'mobile' ? 'Mobile Portrait' : 'Favorites'} wallpapers...`} 
              className="search-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <Search size={18} className="search-icon" />
          </form>

          {/* Sub-filters specific to Favorites Tab */}
          {currentTab === 'favorites' && (
            <div className="nav-tabs" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-glass)' }}>
              <button 
                className={`nav-tab ${favOrientationFilter === 'all' ? 'active' : ''}`}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                onClick={() => setFavOrientationFilter('all')}
              >
                All orientations
              </button>
              <button 
                className={`nav-tab ${favOrientationFilter === 'landscape' ? 'active' : ''}`}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                onClick={() => setFavOrientationFilter('landscape')}
              >
                Landscape
              </button>
              <button 
                className={`nav-tab ${favOrientationFilter === 'portrait' ? 'active' : ''}`}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                onClick={() => setFavOrientationFilter('portrait')}
              >
                Portrait
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Category Pill selections */}
        <div className="categories-container">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* --- GRID DISPLAY --- */}
      {error && (
        <div className="empty-state" style={{ borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)' }}>
          <h3 className="empty-title" style={{ color: '#fda4af' }}>Search Connection Failed</h3>
          <p className="empty-text">{error}</p>
          <button 
            className="page-btn" 
            style={{ marginTop: '0.5rem' }} 
            onClick={() => fetchWallpapers()}
          >
            Retry Connection
          </button>
        </div>
      )}

      {!error && (
        <WallpaperGrid
          wallpapers={currentTab === 'favorites' ? getFilteredFavorites() : wallpapers}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onSelect={setSelectedWallpaper}
          loading={loading}
          gridOrientation={currentTab === 'desktop' ? 'landscape' : currentTab === 'mobile' ? 'portrait' : favOrientationFilter}
        />
      )}

      {/* --- PAGINATION CONTROL BAR --- */}
      {currentTab !== 'favorites' && !loading && !error && wallpapers.length > 0 && (
        <div className="pagination-controls">
          <button 
            className="page-btn"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          
          <span className="page-number">
            Page {page} of {totalPages}
          </span>
          
          <button 
            className="page-btn"
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* --- DETAILED WALLPAPER PREVIEW MODAL --- */}
      {selectedWallpaper && (
        <PreviewModal
          wallpaper={selectedWallpaper}
          isFavorite={favorites.some(fav => fav.id === selectedWallpaper.id)}
          onFavoriteToggle={handleFavoriteToggle}
          onClose={() => setSelectedWallpaper(null)}
        />
      )}

      {/* --- SETTINGS MANAGER PANEL --- */}
      {settingsOpen && (
        <SettingsPanel
          onClose={() => setSettingsOpen(false)}
          onKeySaved={(hasKey) => {
            setApiKeyActive(hasKey);
            setPage(1);
          }}
          activeTheme={theme}
          onThemeChange={handleThemeChange}
        />
      )}
    </div>
  );
}

export default App;
