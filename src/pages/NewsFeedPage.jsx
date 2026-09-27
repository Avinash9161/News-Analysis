import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { subscribeTo24HourNews } from "../services/newsService";
import NewsCard from "../components/NewsCard";

export default function NewsFeedPage() {
  const { categoryId } = useParams();
  const [dailyNews, setDailyNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeTo24HourNews((newsData) => {
      setDailyNews(newsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryId]);

  const displayedArticles = categoryId
    ? dailyNews.filter((item) => item.category === categoryId)
    : dailyNews;

  return (
    <main className="main-content">
      <div className="page-header">
        <h2 style={{ textTransform: "uppercase" }}>
          {categoryId ? `${categoryId} Division` : "Daily 24-Hour Summary Feed"}
        </h2>
        <p>
          {categoryId
            ? `Displaying daily summaries for the ${categoryId} sector.`
            : "Aggregating daily top dispatches refreshed every 24 hours with Gemini AI analysis."}
        </p>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Processing 24-hour news cycle with Gemini AI...</p>
        </div>
      ) : displayedArticles.length === 0 ? (
        <div className="empty-state">
          <p>No articles available in this division for today's briefing cycle.</p>
        </div>
      ) : (
        <div className="news-grid">
          {displayedArticles.map((item) => (
            <NewsCard key={item.id} article={item} />
          ))}
        </div>
      )}
    </main>
  );
}