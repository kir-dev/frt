export interface SocialPost {
  id: string;
  platform: "facebook" | "instagram" | "twitter" | "youtube";
  link: string;
  imageUrl: string;
  caption: string;
  date: string;
}

export async function getYoutubePosts(): Promise<SocialPost[]> {
  // BME FRT csatorna channel ID
  const channelId = "UCe-zQt0PS9q-oXEqu7_SpKg";
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const url = [
    `https://www.googleapis.com/youtube/v3/search`,
    `?key=${apiKey}`,
    `&channelId=${channelId}`,
    `&part=snippet,id`,
    `&order=date`,
    `&type=video`,
    `&maxResults=3`
  ].join("");

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.items) return [];

  return data.items
      .filter((item: { id: { kind: string } }) => item.id.kind === "youtube#video")
      .map((item: { id: { videoId: string }, snippet: { thumbnails?: { high?: { url?: string } }, title?: string, publishedAt?: string } }) => ({
        id: item.id.videoId,
        platform: "youtube",
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        imageUrl: item.snippet.thumbnails?.high?.url || "/placeholder.svg",
        caption: item.snippet.title || "",
        date: item.snippet.publishedAt,
      }));
}

export async function getAllSocialPosts(): Promise<SocialPost[]> {
  const [yt] = await Promise.all([
    getYoutubePosts(),
  ]);

  return [ ...yt].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
