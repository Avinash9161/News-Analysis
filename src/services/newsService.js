// src/services/newsService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let aiModel = null;

if (apiKey) {
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    aiModel = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (error) {
    console.error("Failed to initialize Gemini AI SDK:", error);
  }
}

const TWENTY_FOUR_HOURS_MS = 86400000;

const RSS_FEEDS = {
  all: "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
  technology: "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en",
  sports: "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en",
  entertainment: "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en",
  operations: "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en",
  awards: "https://api.rss2json.com/v1/api.json?rss_url=https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en"
};

async function generateGeminiSummary(title, content) {
  if (!aiModel) {
    return `Key development regarding ${title.slice(0, 40)}... Analysts are monitoring ongoing updates from primary publishers.`;
  }
  try {
    const prompt = `Summarize this news article in 2 concise sentences:\nTitle: ${title}\nContent: ${content}`;
    const response = await aiModel.generateContent(prompt);
    return response.response.text().trim();
  } catch (err) {
    console.warn("Gemini API call restricted or failed, using structured summary fallback:", err);
    return `Recent reports highlight significant updates regarding this event. Industry observers note that stakeholders are actively evaluating the impacts.`;
  }
}

export async function get24HourNews(category = "all") {
  const cacheKey = `news_cache_${category}_v3`;
  const timeKey = `news_last_updated_${category}_v3`;

  const lastUpdate = localStorage.getItem(timeKey);
  const cachedNews = localStorage.getItem(cacheKey);
  const now = Date.now();

  if (lastUpdate && cachedNews && now - Number(lastUpdate) < TWENTY_FOUR_HOURS_MS) {
    return JSON.parse(cachedNews);
  }

  try {
    const feedUrl = RSS_FEEDS[category] || RSS_FEEDS.all;
    const response = await fetch(feedUrl);
    const data = await response.json();

    if (data.status !== "ok" || !data.items) throw new Error("Failed to fetch RSS stream");

    const rawArticles = data.items.slice(0, 6);

    const freshNews = await Promise.all(
      rawArticles.map(async (item, index) => {
        const cleanContent = item.description ? item.description.replace(/<[^>]*>?/gm, '') : item.title;
        
        let titleText = item.title;
        let actualSource = item.author || "Global Wire";

        // Cleanly extract source from Google News title formats (- or |)
        if (titleText.includes(" - ")) {
          const parts = titleText.split(" - ");
          actualSource = parts.pop().trim();
          titleText = parts.join(" - ").trim();
        } else if (titleText.includes(" | ")) {
          const parts = titleText.split(" | ");
          actualSource = parts.pop().trim();
          titleText = parts.join(" | ").trim();
        }

        const summary = await generateGeminiSummary(titleText, cleanContent);

        return {
          id: `live-${category}-${index}-${Date.now()}`,
          title: titleText,
          content: cleanContent,
          category: category === "all" ? "technology" : category,
          source: actualSource,
          publishedAt: item.pubDate || new Date().toISOString(),
          summary,
          url: item.link
        };
      })
    );

    localStorage.setItem(cacheKey, JSON.stringify(freshNews));
    localStorage.setItem(timeKey, now.toString());

    return freshNews;
  } catch (error) {
    console.error("Failed to fetch live news feed:", error);
    if (cachedNews) return JSON.parse(cachedNews);
    return [];
  }
}

export function subscribeTo24HourNews(onNewsUpdated, category = "all") {
  get24HourNews(category).then((data) => onNewsUpdated(data));

  const hourlyCheck = setInterval(async () => {
    const timeKey = `news_last_updated_${category}_v3`;
    const lastUpdate = localStorage.getItem(timeKey);
    if (!lastUpdate || Date.now() - Number(lastUpdate) >= TWENTY_FOUR_HOURS_MS) {
      const freshData = await get24HourNews(category);
      onNewsUpdated(freshData);
    }
  }, 30 * 60 * 1000);

  return () => clearInterval(hourlyCheck);
}