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

interface FacebookPostData {
  id: string;
  permalink_url: string;
  full_picture?: string;
  message?: string;
  created_time: string;
}

interface FacebookApiResponse {
  data: FacebookPostData[];
}

export async function getFacebookPosts(): Promise<SocialPost[]> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  console.log("Facebook Config:", { 
    hasPageId: !!pageId, 
    hasAccessToken: !!accessToken,
    pageId: pageId 
  });

  if (!pageId || !accessToken) {
    console.log("Missing Facebook credentials");
    return [];
  }

  const url = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=id,permalink_url,full_picture,message,created_time&limit=3&access_token=${accessToken}`;

  try {
    console.log("Fetching Facebook posts...");
    const res = await fetch(url);
    console.log("Facebook API Response Status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Facebook API Error Body:", errorText);
      return [];
    }
    
    const data = (await res.json()) as FacebookApiResponse;
    console.log("Facebook API Data:", JSON.stringify(data, null, 2));

    if (!data.data) {
        console.log("No data field in response");
        return [];
    }

    const posts = data.data
      .filter((item) => item.full_picture) // Only show posts with images
      .map((item) => ({
        id: item.id,
        platform: "facebook" as const,
        link: item.permalink_url,
        imageUrl: item.full_picture || "",
        caption: item.message || "",
        date: item.created_time,
      }));
      
    console.log(`Found ${posts.length} Facebook posts`);
    return posts;
  } catch (error) {
    console.error("Error fetching Facebook posts:", error);
    return [];
  }
}

export async function getAllSocialPosts(): Promise<SocialPost[]> {
  const [yt, fb] = await Promise.all([
    getYoutubePosts(),
    getFacebookPosts(),
  ]);

  return [...yt, ...fb].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
