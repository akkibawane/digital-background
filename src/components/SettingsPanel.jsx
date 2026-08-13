import React, { useState } from 'react';
import { X, Key, ShieldCheck, ShieldAlert, ExternalLink, HelpCircle, Palette } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/pexelsService';

const THEMES = [
  { id: 'cosmic', label: 'Cosmic Dark', colors: ['#8b5cf6', '#00f0ff'] },
  { id: 'amoled', label: 'AMOLED Black', colors: ['#00f0ff', '#8b5cf6'] },
  { id: 'cyberpunk', label: 'Cyberpunk', colors: ['#f43f5e', '#facc15'] },
  { id: 'light', label: 'Light Aura', colors: ['#6d28d9', '#0891b2'] }
];

const SettingsPanel = ({ onClose, onKeySaved, activeTheme, onThemeChange }) => {
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [savedStatus, setSavedStatus] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(keyInput);
    setSavedStatus('success');
    onKeySaved(!!keyInput.trim());
    setTimeout(() => {
      setSavedStatus(null);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKey('');
    setKeyInput('');
    setSavedStatus('cleared');
    onKeySaved(false);
    setTimeout(() => setSavedStatus(null), 2000);
  };

  const hasKey = !!keyInput.trim();

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3 className="settings-title">
            <Key size={20} className="text-active" /> App Settings & Themes
          </h3>
          <button className="settings-close-btn" onClick={onClose} title="Close Settings">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="settings-body">
          {/* Theme Selector Section */}
          <div className="settings-field">
            <label className="settings-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Palette size={14} className="text-active" /> Visual Theme
            </label>
            <div className="theme-selector-grid">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-choice-btn ${activeTheme === t.id ? 'active' : ''}`}
                  onClick={() => onThemeChange(t.id)}
                >
                  <div className="theme-preview-dots">
                    {t.colors.map((c, i) => (
                      <span key={i} className="theme-dot-color" style={{ backgroundColor: c }}></span>
                    ))}
                  </div>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)' }} />

          <div className="settings-field">
            <label className="settings-label" htmlFor="api-key-input">
              Pexels API Key
            </label>
            <input 
              id="api-key-input"
              type="password"
              placeholder="Paste Pexels API Key here..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="settings-input"
              autoComplete="off"
            />
          </div>

          {/* Mode Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            {hasKey ? (
              <>
                <ShieldCheck size={16} color="#10b981" />
                <span style={{ color: '#a7f3d0' }}>Live API Mode Enabled: Unlimited Searching</span>
              </>
            ) : (
              <>
                <ShieldAlert size={16} color="#fb7185" />
                <span style={{ color: '#fecdd3' }}>Curator Fallback Mode Active (Static Images)</span>
              </>
            )}
          </div>

          <div className="settings-help">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <HelpCircle size={14} /> How do I get a free API Key?
            </div>
            <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>
                Sign up/login on{' '}
                <a href="https://www.pexels.com/join/" target="_blank" rel="noopener noreferrer">
                  Pexels.com <ExternalLink size={10} style={{ display: 'inline' }} />
                </a>
              </li>
              <li>
                Visit the Pexels API Portal at{' '}
                <a href="https://www.pexels.com/api/new/" target="_blank" rel="noopener noreferrer">
                  pexels.com/api <ExternalLink size={10} style={{ display: 'inline' }} />
                </a>
              </li>
              <li>Request a free key (approved instantly for developers) and paste it above!</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            {getApiKey() && (
              <button 
                type="button" 
                onClick={handleClear}
                className="settings-save-btn"
                style={{ 
                  background: 'rgba(244, 63, 94, 0.15)', 
                  color: '#fda4af', 
                  border: '1px solid rgba(244, 63, 94, 0.3)'
                }}
              >
                Clear Key
              </button>
            )}
            
            <button 
              type="submit" 
              className="settings-save-btn" 
              style={{ flexGrow: 1 }}
            >
              {savedStatus === 'success' ? 'Saved Successfully!' : 'Save & Apply'}
            </button>
          </div>

          {savedStatus === 'cleared' && (
            <div style={{ fontSize: '0.8rem', color: '#fda4af', textAlign: 'center' }}>
              API key cleared. Switched back to Curator Mode.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;
