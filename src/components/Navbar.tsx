import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ALL_TOOL_ROUTES } from '../config/seoRoutes';
import './Navbar.css';

export function Navbar() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsToolsOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const currentTool = ALL_TOOL_ROUTES.find((r) => r.path === location.pathname);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container" aria-label="Main Navigation">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" title="Image to PDF Converter - Home">
          <div className="brand-icon">
            <span className="brand-emoji">📄</span>
            <span className="brand-dot"></span>
          </div>
          <span className="brand-text">
            Images to <span className="highlight">PDF</span>
          </span>
        </Link>

        {/* Center / Navigation Items */}
        <div className="navbar-center">
          {/* Tools Dropdown */}
          <div className="dropdown-container" ref={dropdownRef}>
            <button
              type="button"
              className={`dropdown-toggle ${isToolsOpen ? 'active' : ''}`}
              onClick={() => setIsToolsOpen((prev) => !prev)}
              aria-expanded={isToolsOpen}
              aria-haspopup="true"
              id="tools-menu-button"
            >
              <span className="tools-icon">🛠️</span>
              <span className="tools-text">Tools</span>
              {currentTool && location.pathname !== '/' && (
                <span className="current-tool-pill">{currentTool.shortName}</span>
              )}
              <svg
                className={`dropdown-chevron ${isToolsOpen ? 'rotate' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu for Users and Google Crawlers */}
            {isToolsOpen && (
              <div
                className="dropdown-menu"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="tools-menu-button"
              >
                <div className="dropdown-header">
                  <span>Format Converters</span>
                  <span className="dropdown-badge">Free</span>
                </div>
                <div className="dropdown-items">
                  {ALL_TOOL_ROUTES.map((route) => {
                    const isActive = location.pathname === route.path;
                    return (
                      <Link
                        key={route.path}
                        to={route.path}
                        role="menuitem"
                        className={`dropdown-item ${isActive ? 'active' : ''}`}
                        title={route.name}
                      >
                        <span className="item-icon">{route.icon}</span>
                        <div className="item-details">
                          <div className="item-title-row">
                            <span className="item-title">{route.name}</span>
                            {route.badge && (
                              <span className="item-tag">{route.badge}</span>
                            )}
                          </div>
                          <span className="item-subtext">{route.acceptedTypesLabel}</span>
                        </div>
                        {isActive && <span className="active-indicator">●</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Direct Links for Desktop Crawlers & Users */}
          <div className="quick-nav-links">
            <Link
              to="/jpg-to-pdf"
              className={`quick-link ${location.pathname === '/jpg-to-pdf' ? 'active' : ''}`}
            >
              JPG
            </Link>
            <Link
              to="/png-to-pdf"
              className={`quick-link ${location.pathname === '/png-to-pdf' ? 'active' : ''}`}
            >
              PNG
            </Link>
            <Link
              to="/heic-to-pdf"
              className={`quick-link ${location.pathname === '/heic-to-pdf' ? 'active' : ''}`}
            >
              HEIC
            </Link>
            <Link
              to="/webp-to-pdf"
              className={`quick-link ${location.pathname === '/webp-to-pdf' ? 'active' : ''}`}
            >
              WEBP
            </Link>
            <Link
              to="/add-image-to-pdf"
              className={`quick-link ${location.pathname === '/add-image-to-pdf' ? 'active' : ''}`}
            >
              Add to PDF
            </Link>
          </div>
        </div>

        {/* Right side status badge */}
        <div className="navbar-right">
          <div className="privacy-badge" title="Files are processed directly on your device">
            <span className="privacy-icon">🔒</span>
            <span className="privacy-label">100% In-Browser</span>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="mobile-hamburger"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-menu-header">Conversion Tools</div>
          {ALL_TOOL_ROUTES.map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`mobile-menu-item ${isActive ? 'active' : ''}`}
              >
                <span className="mobile-item-icon">{route.icon}</span>
                <div className="mobile-item-text">
                  <span className="mobile-item-name">{route.name}</span>
                  <span className="mobile-item-sub">{route.acceptedTypesLabel}</span>
                </div>
                {isActive && <span className="active-dot">●</span>}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
