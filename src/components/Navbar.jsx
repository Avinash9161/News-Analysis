// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const links = [
    { path: '/', label: '🔴 Live Feed' },
    { path: '/corner/technology', label: 'Technology' },
    { path: '/corner/sports', label: 'Sports' },
    { path: '/corner/entertainment', label: 'Entertainment' },
    { path: '/corner/operations', label: 'Operations' },
    { path: '/corner/awards', label: 'Awards' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>⚡ PulseBrief</h1>
          <span className="brand-tag">Real-Time Gemini AI Summary</span>
        </div>
        <div className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}