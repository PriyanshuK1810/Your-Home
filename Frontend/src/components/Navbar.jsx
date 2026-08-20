import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, User, Menu, X } from 'lucide-react';

export default function Navbar({ bookmarkCount = 0, onOpenBookmarks, onOpenUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDropdownClick = (name, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <nav ref={navRef} className="navbar-sticky" style={{ position: 'relative' }}>

      {/* Brand Logo — same logo.svg as all other pages */}
      <a href="/" className="react-brand" aria-label="Your Home Homepage">
        <img src="/logo.svg" alt="Your Home - Plan • Analyze • Invest" className="react-brand-logo" />
      </a>

      {/* Nav Links Desktop */}
      <ul className="nav-menu">
        <li>
          <a href="/" className="nav-link active">Home</a>
        </li>

        {/* Calculators Dropdown (Hover + Tap/Click to keep open) */}
        <li className={`react-nav-dropdown ${activeDropdown === 'calculators' ? 'dropdown-open' : ''}`}>
          <a 
            href="#" 
            className="nav-link react-dropdown-trigger"
            onClick={(e) => handleDropdownClick('calculators', e)}
          >
            <span>Calculators</span>
            <svg className="react-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>
          <div className="react-dropdown-menu">
            <a href="/emi-calculator" className="react-dropdown-item" onClick={() => setActiveDropdown(null)}>
              <span className="react-dropdown-icon">💰</span>
              <div className="react-dropdown-text">
                <strong>EMI Calculator</strong>
                <span>Calculate loan payments &amp; interest</span>
              </div>
            </a>
            <a href="/true-cost" className="react-dropdown-item" onClick={() => setActiveDropdown(null)}>
              <span className="react-dropdown-icon">🏷️</span>
              <div className="react-dropdown-text">
                <strong>True Cost Calculator</strong>
                <span>Stamp duty, GST &amp; hidden costs</span>
              </div>
            </a>
            <a href="/affordability" className="react-dropdown-item" onClick={() => setActiveDropdown(null)}>
              <span className="react-dropdown-icon">📊</span>
              <div className="react-dropdown-text">
                <strong>Affordability Check</strong>
                <span>Know how much home you can afford</span>
              </div>
            </a>
            <a href="/rental-roi" className="react-dropdown-item" onClick={() => setActiveDropdown(null)}>
              <span className="react-dropdown-icon">📈</span>
              <div className="react-dropdown-text">
                <strong>Rental ROI Calculator</strong>
                <span>Estimate rental returns &amp; yields</span>
              </div>
            </a>
            <a href="/risk-analysis" className="react-dropdown-item" onClick={() => setActiveDropdown(null)}>
              <span className="react-dropdown-icon">🛡️</span>
              <div className="react-dropdown-text">
                <strong>Risk Analysis</strong>
                <span>Property &amp; builder risk scoring</span>
              </div>
            </a>
            <a href="/buy-vs-rent" className="react-dropdown-item" onClick={() => setActiveDropdown(null)}>
              <span className="react-dropdown-icon">⚖️</span>
              <div className="react-dropdown-text">
                <strong>Buy vs Rent Calculator</strong>
                <span>Compare financial impact of renting</span>
              </div>
            </a>
          </div>
        </li>

        {/* Property Dropdown (Hover + Tap/Click to keep open) */}
        <li className={`react-nav-dropdown ${activeDropdown === 'property' ? 'dropdown-open' : ''}`}>
          <a 
            href="#" 
            className="nav-link react-dropdown-trigger"
            onClick={(e) => handleDropdownClick('property', e)}
          >
            <span>Property</span>
            <svg className="react-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>
          <div className="react-dropdown-menu react-dropdown-menu--narrow">
            <a href="/#browse-properties" className="react-dropdown-item" onClick={() => setActiveDropdown(null)}>
              <span className="react-dropdown-icon">🏠</span>
              <div className="react-dropdown-text">
                <strong>Buy Properties</strong>
                <span>Explore verified homes &amp; apartments</span>
              </div>
            </a>
            <a href="/#browse-properties" className="react-dropdown-item" onClick={() => setActiveDropdown(null)}>
              <span className="react-dropdown-icon">🏢</span>
              <div className="react-dropdown-text">
                <strong>Rent Properties</strong>
                <span>Find apartments with high yields</span>
              </div>
            </a>
          </div>
        </li>

        <li>
          <a href="/insights" className="nav-link">Insights</a>
        </li>

        <li>
          <a href="/schemes" className="nav-link">Schemes</a>
        </li>

        <li>
          <a href="/tools" className="nav-link">Tools</a>
        </li>

        <li>
          <a href="/about-us" className="nav-link">About Us</a>
        </li>
      </ul>

      {/* Action Icons Right */}
      <div className="nav-actions">
        <button
          className="icon-btn"
          aria-label="Bookmarks"
          onClick={onOpenBookmarks}
          title="Saved Properties"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          {bookmarkCount > 0 && <span className="badge-count">{bookmarkCount}</span>}
        </button>

        <button
          className="icon-btn"
          aria-label="User Account"
          onClick={onOpenUser}
          title="User Account"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          className="icon-btn mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="react-mobile-drawer">
          <a href="/" className="nav-link active" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="/emi-calculator" className="nav-link" onClick={() => setMobileOpen(false)}>EMI Calculator</a>
          <a href="/affordability" className="nav-link" onClick={() => setMobileOpen(false)}>Affordability Check</a>
          <a href="/true-cost" className="nav-link" onClick={() => setMobileOpen(false)}>True Cost</a>
          <a href="/rental-roi" className="nav-link" onClick={() => setMobileOpen(false)}>Rental ROI</a>
          <a href="/buy-vs-rent" className="nav-link" onClick={() => setMobileOpen(false)}>Buy vs Rent</a>
          <a href="/#browse-properties" className="nav-link" onClick={() => setMobileOpen(false)}>Property</a>
          <a href="/insights" className="nav-link" onClick={() => setMobileOpen(false)}>Insights</a>
          <a href="/schemes" className="nav-link" onClick={() => setMobileOpen(false)}>Schemes</a>
          <a href="/tools" className="nav-link" onClick={() => setMobileOpen(false)}>Tools</a>
          <a href="/about-us" className="nav-link" onClick={() => setMobileOpen(false)}>About Us</a>
        </div>
      )}
    </nav>
  );
}
