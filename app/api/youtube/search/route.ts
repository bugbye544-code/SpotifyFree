import { NextRequest, NextResponse } from "next/server";
import ytSearch from "yt-search";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  
  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    // חיפוש חופשי ביוטיוב ללא צורך במפתח (API Key)
    const result = await ytSearch(query);
    
    // אנחנו לוקחים את 14 התוצאות הראשונות ומסדרים אותן בפורמט שהאתר שלך מכיר
    const items = result.videos.slice(0, 14).map(video => ({
      id: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.seconds,
      author: video.author.name,
      views: video.views,
      url: video.url
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json(
      { error: "YouTube search failed", items: [] },
      { status: 500 }
    );
  }
}