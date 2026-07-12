// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './pages/Category';
import { getInitialNews, subscribeToLiveNews } from './services/newsService';

export default function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Populate base historical articles
    setNews(getInitialNews());

    // Connect to background live news service updater
    const unsubscribe = subscribeToLiveNews((newArticle) => {
      setNews((prevNews) => {
        // Prevent duplicate loads if stream loops or refreshes
        if (prevNews.some((item) => item.title === newArticle.title)) return prevNews;
        return [newArticle, ...prevNews];
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home news={news} />} />
            <Route path="/corner/:categoryId" element={<Category news={news} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}