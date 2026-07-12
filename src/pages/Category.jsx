// src/pages/Category.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';

export default function Category({ news }) {
  const { categoryId } = useParams();
  
  const filteredNews = news
    .filter((article) => article.category === categoryId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="page-container">
      <header className="page-header">
        <h2 className="category-title-text">{categoryId} Corner</h2>
        <p>Real-time updates isolated to the {categoryId} sector.</p>
      </header>

      {filteredNews.length === 0 ? (
        <div className="empty-state">No recent live updates on this frequency yet. Waiting for stream...</div>
      ) : (
        <div className="news-grid">
          {filteredNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}