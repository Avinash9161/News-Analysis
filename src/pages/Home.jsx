// src/pages/Home.jsx
import React from 'react';
import NewsCard from '../components/NewsCard';

export default function Home({ news }) {
  // Show most recent news first
  const sortedNews = [...news].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>Live Global Stream</h2>
        <p>Displaying all incoming events across outlets synchronized in real-time.</p>
      </header>
      
      {sortedNews.length === 0 ? (
        <div className="loading-state">Connecting to stream wire...</div>
      ) : (
        <div className="news-grid">
          {sortedNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}