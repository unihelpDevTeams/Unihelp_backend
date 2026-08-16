import express from "express";

const router = express.Router();

const NEWS_DATA_API_KEY = process.env.NEWS_DATA_API_KEY || "";
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || "";

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
    const [newsData, gnews] = await Promise.all([
      fetchFromNewsData().catch(() => []),
      fetchFromGNews().catch(() => []),
    ]);

    res.json({ articles: [...newsData, ...gnews] });
  } catch (error) {
    next(error);
  }
});

export default router;
