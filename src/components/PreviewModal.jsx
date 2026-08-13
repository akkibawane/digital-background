import React, { useState, useEffect } from 'react';
import { 
  X, Download, Heart, Monitor, Phone, Copy, Check, ExternalLink, 
  Trash2, Folder, Terminal, Settings, Globe, Shield, Wifi, Battery, Moon, Sun, Lock
} from 'lucide-react';

const PreviewModal = ({ wallpaper, isFavorite, onFavoriteToggle, onClose }) => {
  const { photographer, photographer_url, width, height, src, alt, avg_color, url } = wallpaper;
  
  const isLandscape = width > height;
  const [activeSimulator, setActiveSimulator] = useState(isLandscape ? 'desktop' : 'mobile');
  const [downloadSize, setDownloadSize] = useState('original');
  const [downloading, setDownloading] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);
  
  // Simulated clock/calendar state for mockups
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Dynamic Color Palette Generation ---
  // Converts Hex string (e.g. #376c8c) to HSL, generates 5 harmonious colors
  const generatePalette = (hex) => {
    if (!hex || !hex.startsWith('#')) return ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'];
    
    // Parse hex
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Convert to HSL
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    // Helpers to format back to Hex
    const hslToHex = (h, s, l) => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    return [
      hex,                                     // Dominant avg color
      hslToHex((h + 180) % 360, s, l),         // Complementary accent
      hslToHex((h + 30) % 360, Math.min(s + 10, 100), Math.max(l - 10, 20)), // Rich analogous
      hslToHex(h, s, Math.min(l + 25, 85)),    // Soft tint
      hslToHex(h, Math.max(s - 15, 10), Math.max(l - 25, 12)) // Deep shade
    ];
  };

  const palette = generatePalette(avg_color);

  // Copy Color Hex code to clipboard
  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // --- Image Downloader Trigger ---
  const handleDownload = async () => {
    setDownloading(true);
    const downloadUrl = src[downloadSize] || src.original;
    const fileName = `${alt?.replace(/[^a-zA-Z0-9]/g, '_') || 'wallpaper'}_${downloadSize}.jpg`;

    try {
      // Fetch the image as a blob
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download request failed');
      const blob = await response.blob();
      
      // Create local URL and trigger download
      const localUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = localUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(localUrl);
    } catch (error) {
      console.error('CORS blocked direct fetch download, falling back to open in new tab:', error);
      // Fallback
      window.open(downloadUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  // Clock Formatting Helpers
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDateWindows = (date) => {
    return date.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const formatDatePhone = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} title="Close Preview">
          <X size={20} />
        </button>

        {/* --- LEFT SIDE: LIVE SIMULATOR WORKSPACE --- */}
        <div className="modal-preview-area">
          
          {/* 1. WINDOWS 11 SIMULATOR */}
          {activeSimulator === 'desktop' && (
            <div 
              className="win-desktop-mockup"
              style={{ backgroundImage: `url(${src.large2x || src.large})` }}
            >
              {/* Desktop Icons */}
              <div className="win-desktop-icons">
                <div className="win-icon">
                  <Monitor size={22} color="#93c5fd" />
                  <span className="win-icon-text">This PC</span>
                </div>
                <div className="win-icon">
                  <Folder size={22} color="#fbbf24" />
                  <span className="win-icon-text">Wallpapers</span>
                </div>
                <div className="win-icon">
                  <Trash2 size={22} color="#d1d5db" />
                  <span className="win-icon-text">Recycle Bin</span>
                </div>
              </div>

              {/* Simulated App Window overlay */}
              <div className="win-app-window">
                <div className="win-window-header">
                  <div className="win-window-title">
                    <Globe size={11} /> 
                    <span>Live Themes Setup</span>
                  </div>
                  <div className="win-window-controls">
                    <span className="win-dot red"></span>
                    <span className="win-dot yellow"></span>
                    <span className="win-dot green"></span>
                  </div>
                </div>
                <div className="win-window-body">
                  <div className="win-dummy-text short" style={{ background: avg_color }}></div>
                  <div className="win-dummy-text medium"></div>
                  <div className="win-dummy-text"></div>
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: 'auto' }}>
                    <div style={{ width: '40px', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ width: '60px', height: '14px', borderRadius: '4px', background: avg_color }}></div>
                  </div>
                </div>
              </div>

              {/* Taskbar */}
              <div className="win-taskbar">
                <div className="win-system-tray" style={{ opacity: 0 }}>
                  {/* Invisible left spacer for centering */}
                  <Wifi size={14} />
                </div>
                
                {/* Centered Start Buttons */}
                <div className="win-start-menu">
                  <div className="win-taskbar-icon logo" title="Start">
                    <Monitor size={15} color="#8b5cf6" />
                  </div>
                  <div className="win-taskbar-icon" title="Browser">
                    <Globe size={14} color="#60a5fa" />
                  </div>
                  <div className="win-taskbar-icon" title="Files">
                    <Folder size={14} color="#fbbf24" />
                  </div>
                  <div className="win-taskbar-icon" title="Terminal">
                    <Terminal size={14} color="#10b981" />
                  </div>
                  <div className="win-taskbar-icon" title="Settings">
                    <Settings size={14} color="#a78bfa" />
                  </div>
                </div>

                {/* Right System Tray */}
                <div className="win-system-tray">
                  <Wifi size={13} />
                  <Battery size={13} />
                  <div className="win-time-date">
                    <span>{formatTime(currentTime)}</span>
                    <span style={{ fontSize: '0.55rem', opacity: 0.8 }}>{formatDateWindows(currentTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PHONE LOCK SCREEN SIMULATOR */}
          {activeSimulator === 'mobile' && (
            <div 
              className="phone-mockup"
              style={{ backgroundImage: `url(${src.portrait || src.large})` }}
            >
              {/* Island Notch */}
              <div className="phone-notch">
                <div className="phone-lens"></div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#111827' }}></div>
              </div>

              {/* Status Bar */}
              <div className="phone-status-bar">
                <span>{formatTime(currentTime).split(' ')[0]}</span>
                <div className="phone-status-icons">
                  <Wifi size={10} />
                  <span>5G</span>
                  <Battery size={11} />
                </div>
              </div>

              {/* Lockscreen details */}
              <div className="phone-lockscreen-content">
                <Lock size={12} className="phone-lock-icon" />
                <span className="phone-time">{formatTime(currentTime).split(' ')[0]}</span>
                <span className="phone-date">{formatDatePhone(currentTime)}</span>

                {/* Simulated Glassmorphic Weather Widget */}
                <div className="phone-widget-box">
                  <div className="phone-widget-icon" style={{ background: avg_color }}>
                    <Sun size={12} color="#fff" />
                  </div>
                  <div className="phone-widget-details">
                    <span className="phone-widget-title">WEATHER</span>
                    <span className="phone-widget-value">72° and Sunny</span>
                  </div>
                </div>

                {/* Glassmorphic Lockscreen Notification */}
                <div className="phone-notification">
                  <div className="phone-notif-header">
                    <div className="phone-notif-app">
                      <div className="phone-notif-icon" style={{ background: avg_color }}></div>
                      <span>ANTIGRAVITY</span>
                    </div>
                    <span>now</span>
                  </div>
                  <div className="phone-notif-body">Mobile Viewport Active</div>
                  <div className="phone-notif-msg">Swipe up to preview desktop apps...</div>
                </div>

                {/* Bottom line */}
                <div className="phone-home-indicator"></div>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: DETAILED METADATA & ACTIONS --- */}
        <div className="modal-details-area">
          <h2 className="modal-title">{alt || 'Cosmic Abstract Design'}</h2>
          
          <div className="modal-author">
            <span>By <strong>{photographer}</strong></span>
            <span>•</span>
            <a href={photographer_url} target="_blank" rel="noopener noreferrer" className="brand">
              Profile <ExternalLink size={12} style={{ display: 'inline', marginLeft: '2px' }} />
            </a>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)', marginBottom: '1.5rem' }} />

          {/* Color Palette section */}
          <div className="section-title">Color Palette (Click to Copy)</div>
          <div className="palette-container">
            {palette.map((color, idx) => (
              <div 
                key={color + idx} 
                className="palette-color"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
                title={`Copy hex: ${color}`}
              >
                <div className="color-hex">
                  {copiedColor === color ? <Check size={10} color="#10b981" /> : color}
                </div>
              </div>
            ))}
          </div>

          {/* Simulator Toggle Section */}
          <div className="section-title">Mockup Simulator</div>
          <div className="simulator-toggles">
            <button 
              className={`sim-btn ${activeSimulator === 'desktop' ? 'active' : ''}`}
              onClick={() => setActiveSimulator('desktop')}
            >
              <Monitor size={15} /> Windows 11
            </button>
            <button 
              className={`sim-btn ${activeSimulator === 'mobile' ? 'active' : ''}`}
              onClick={() => setActiveSimulator('mobile')}
            >
              <Phone size={15} /> Lock Screen
            </button>
          </div>

          {/* Action Download Layout */}
          <div className="download-group">
            <div className="section-title">Select Download Resolution</div>
            <select 
              value={downloadSize} 
              onChange={(e) => setDownloadSize(e.target.value)}
              className="size-select"
            >
              <option value="original">Original Ultra-Res ({width} x {height})</option>
              <option value="large2x">Ultra HD Large (Landscape/Portrait)</option>
              <option value="large">Standard Compressed (HD)</option>
              <option value="medium">Medium Size (For smaller screens)</option>
              <option value="small">Small Thumbnail</option>
            </select>

            <button 
              className="download-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px', borderLeftColor: '#fff', marginRight: '6px' }}></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={18} /> Apply & Download Wallpaper
                </>
              )}
            </button>
            
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="sim-btn"
              style={{ marginTop: '0.25rem', border: '1px solid var(--border-glass)' }}
            >
              View on Pexels <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
