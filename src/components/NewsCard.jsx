// src/components/NewsCard.jsx
import { useState, useEffect } from "react";

export default function NewsCard({ article }) {
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    function calculateTimeDelta() {
      const differenceSeconds = Math.floor((new Date() - new Date(article.publishedAt)) / 1000);
      if (differenceSeconds < 60) {
        setTimeText("Just now");
      } else {
        const structuralMinutes = Math.floor(differenceSeconds / 60);
        if (structuralMinutes < 60) {
          setTimeText(`${structuralMinutes}m ago`);
        } else {
          setTimeText(`${Math.floor(structuralMinutes / 60)}h ago`);
        }
      }
    }

    calculateTimeDelta();
    const trackerInterval = setInterval(calculateTimeDelta, 60000);
    return () => clearInterval(trackerInterval);
  }, [article.publishedAt]);

  const publisherSlug = article.source.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="news-card">
      <div>
        <div className="card-header">
          <span className={`source-badge ${publisherSlug}`}>{article.source}</span>
          <span className="card-time">{timeText}</span>
        </div>
        <h3 className="card-title">{article.title}</h3>
        
        <div className="ai-summary-box">
          <div className="ai-summary-header">
            <span>✨</span>
            <h4>Gemini AI Summary</h4>
          </div>
          <p className="ai-summary-text">{article.summary}</p>
        </div>
      </div>

      <div className="card-footer">
        <span className="category-tag">#{article.category}</span>
        {/* Updated to open the real article URL in a new tab */}
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="read-more-btn"
        >
          Read Original Source →
        </a>
      </div>
    </div>
  );
}