// src/components/NewsCard.jsx
import React from 'react';

export default function NewsCard({ article }) {
  const formatTime = (isoString) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <div className="news-card">
      <div className="card-header">
        <span className={`source-badge ${article.source.toLowerCase().replace(/\s+/g, '-')}`}>
          {article.source}
        </span>
        <span className="card-time">{formatTime(article.timestamp)}</span>
      </div>
      
      <h3 className="card-title">{article.title}</h3>
      
      <div className="ai-summary-box">
        <div className="ai-summary-header">
          <span className="sparkle-icon">✨</span>
          <h4>Gemini AI Summary</h4>
        </div>
        <p className="ai-summary-text">{article.summary}</p>
      </div>

      <div className="card-footer">
        <span className="category-tag">#{article.category}</span>
        <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="read-more-btn">
          Read Original Source →
        </a>
      </div>
    </div>
  );
}