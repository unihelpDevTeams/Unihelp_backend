import express from "express";
import { db } from "../firebase/firebaseAdmin.js";

const router = express.Router();

const NEWS_DATA_API_KEY = process.env.NEWS_DATA_API_KEY || "";
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || "";

const fetchAdminNews = async () => {
  if (!db) return [];

  const snapshot = await db.collection("announcements").where("published", "==", true).get();
  return snapshot.docs
    .map((doc) => {
      const item = doc.data();
      const createdAt = item.createdAt?.toDate?.() || item.createdAt || null;
      return {
        id: doc.id,
        title: item.title || "",
        description: item.description || item.body || "",
        link: "",
        image: item.image || item.imageUrl || "",
        source: "Unihelp Admin",
        category: item.category || "Campus News",
        badge: item.badge || (item.priority === "urgent" ? "HOT" : item.priority === "high" ? "Important" : "Update"),
        publishedAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
      };
    })
    .filter((item) => item.title)
    .sort((left, right) => new Date(right.publishedAt || 0).getTime() - new Date(left.publishedAt || 0).getTime())
    .slice(0, 25);
};

const fetchFromNewsData = async () => {
  if (!NEWS_DATA_API_KEY) return [];

  const url = new URL("https://newsdata.io/api/1/news");
  url.searchParams.set("apikey", NEWS_DATA_API_KEY);
  url.searchParams.set("country", "ng");
  url.searchParams.set("language", "en");
  url.searchParams.set("category", "education,politics,business,technology,sports");

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !Array.isArray(data.results)) return [];

  return data.results.map((item) => ({
    title: item.title || "",
    description: item.description || "",
    link: item.link || "#",
    image: item.image_url || "",
    source: "NewsData",
  }));
};

const fetchFromGNews = async () => {
  if (!GNEWS_API_KEY) return [];

  const url = new URL("https://gnews.io/api/v4/top-headlines");
  url.searchParams.set("country", "ng");
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", "10");
  url.searchParams.set("token", GNEWS_API_KEY);

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !Array.isArray(data.articles)) return [];

  return data.articles.map((item) => ({
    title: item.title || "",
    description: item.description || "",
    link: item.url || "#",
    image: item.image || "",
    source: "GNews",
  }));
};

router.get("/nigeria", async (req, res, next) => {
  try {
    const [newsData, gnews, adminNews] = await Promise.all([
      fetchFromNewsData().catch(() => []),
      fetchFromGNews().catch(() => []),
      fetchAdminNews().catch(() => []),
    ]);

    res.json({ articles: [...adminNews, ...newsData, ...gnews] });
  } catch (error) {
    next(error);
  }
});

export default router;
