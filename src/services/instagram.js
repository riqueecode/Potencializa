const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getInstagramReels() {
  const response = await fetch(
    `${API_URL}/api/instagram/reels`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar Reels do Instagram");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Resposta inválida ao buscar Reels do Instagram");
  }

  return data;
}

export function normalizeInstagramReel(item) {
  if (!item?.id) return null;

  const caption = item.caption || "";

  return {
    id: item.id,
    title: caption ? caption.slice(0, 40) : "Reel",
    thumbnail: item.thumbnail_url || item.media_url || "",
    video: item.media_url || "",
    caption,
    timestamp: item.timestamp || null,
    permalink: item.permalink || "https://www.instagram.com/potencializa_/",
  };
}

export async function fetchInstagramReels() {
  const data = await getInstagramReels();
  return data.map(normalizeInstagramReel).filter(Boolean);
}
